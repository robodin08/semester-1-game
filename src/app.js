import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

import gameManager from "./GameManager.js";
import Memory from "./memory.js";
import config from "./config.js";
import createError from "./error.js";
import middlewares from "./middlewares/index.js";

const app = express();
const server = createServer(app);
const io = new Server(server);

middlewares(app);

io.on("connection", (socket) => {
  console.log("a user connected");
  const userId = socket.handshake.auth.uid;

  const gameId = gameManager.getGameIdFromUser(userId);
  if (!gameId) return socket.disconnect(true);

  const connected = gameManager.setUserConnected(userId);
  if (!connected) return socket.disconnect(true);

  const game = gameManager.getGame(gameId);
  const gameUserId = gameManager.getGameUserId(userId);

  socket.join(gameId);

  // 0 - sender; 1 - opponent; 2 - both;
  function event(eventName, data, i = 2) {
    if (i === 0) {
      socket.emit(eventName, data);
    } else if (i === 1) {
      socket.to(gameId).emit(eventName, data);
    } else if (i === 2) {
      io.to(gameId).emit(eventName, data);
    }
  }

  if (game._users === game._maxUsers && !game.memory.started_at) {
    event("onMove", { userGameId: 0, isFirst: true });
    game.memory.can_flip = true;
  } else if (game.memory.started_at) {
    event("onMove", { userGameId: game.memory.current_user, isFirst: true }, 0);
    event("startTimer", { startedAt: game.memory.started_at }, 0);
  }

  socket.use(([event, ...args], next) => {
    if (game._expired) {
      console.log("game expired, disconnecting socket");
      socket.emit("expired");
      socket.disconnect(true);
      return;
    }
    next();
  });

  socket.on("flip", (cardIndex, callback) => {
    try {
      const completed = game.memory.flip(cardIndex, gameUserId, event);
      if (completed) game.expire();
      callback({
        success: true,
      });
    } catch (error) {
      console.error(error);
      callback({
        success: false,
        error: error.message,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    game.deleteUser(userId);
  });
});

app.get("/status", (req, res) => res.sendStatus(200));

app.get("/", (req, res) => {
  res.render("home", {
    themes: Object.entries(config.game.themes).map(([name, t]) => ({
      name,
      color: t.color,
    })),
    difficulties: Object.entries(config.game.difficulties).map(([name, d]) => ({
      name,
      color: d.color,
    })),
  });
});

app.get("/play/:gameId", (req, res) => {
  const { gameId } = req.params;

  const game = gameManager.getGame(gameId);
  if (!game) throw createError(404, "Game does not exist.");

  const [userId, gameUserId] = game.addUser();

  res.render("play", {
    cards: game.memory.cards,
    state: game.memory.getState(),
    difficulty: game.memory.difficulty,
    gameId: game._users === game._maxUsers ? null : gameId,
    scores:
      game._maxUsers > 1
        ? {
          user0: game.memory[gameUserId].pairs,
          user1: game.memory[gameUserId === 0 ? 1 : 0].pairs,
        }
        : null,
    global: {
      userId,
      gameUserId,
      translations: req.filterCatalog([
        "play.*",
        "notifications.*",
        "popups.*",
      ]),
    },
  });
});

app.get("/play/:theme/:difficulty", (req, res, next) => {
  try {
    const { theme, difficulty } = req.params;
    const multiplayer = Object.hasOwn(req.query, "m");

    const memory = new Memory({
      difficulty,
      theme,
      shuffle: true,
      users: multiplayer ? 2 : 1,
    });

    const game = {
      memory,
    };

    const gameId = gameManager.createGame(game, memory.users);

    res.redirect(`/play/${gameId}`);
  } catch (error) {
    next(error);
  }
});

app.use((req, res, next) => {
  next(createError(404, `Page ${req.originalUrl} not found`));
});

app.use((error, req, res, next) => {
  const isApi = req.path.startsWith("/api");
  const status = error.status || 500;

  if (isApi) {
    res.status(status).json({
      message: error.message,
      ...error.data,
    });
  } else {
    res.status(status).render("error", {
      status,
      error: error.message,
    });
  }
});

server.listen(config.port, () =>
  console.log(`Server listening on port ${config.port}`),
);
