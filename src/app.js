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

  function events(event, data) {
    socket.to(gameId).emit(event, data);
    socket.emit(event, data);
  }

  if (game._users === game._maxUsers) {
    events("gameFull");
    game.memory.can_flip = true;
  }

  socket.onAny(() => {
    if (game._expired) {
      console.log("game expired, disconnecting socket");
      socket.emit("expired");
      socket.disconnect(true);
    }
  });

  socket.on("flip", (cardIndex, callback) => {
    try {
      game.memory.flip(cardIndex, gameUserId, events);
      callback({
        success: true,
      });
    } catch (error) {
      console.error(error);
      callback({
        success: false, error: error.message
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
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
  if (!game)
    throw createError(404, "Game does not exist.");

  const userId = game.addUser();

  console.log(userId, game);

  res.render("play", {
    cards: game.memory.cards,
    difficulty: game.memory.difficulty,
    gameId: game._maxUsers === 1 ? null : gameId,
    global: {
      userId,
      translations: req.filterCatalog([
        "play.*",
        "notifications.*",
      ]),
    },
  });
});

app.get("/play/:theme/:difficulty", (req, res, next) => {
  try {
    const { theme, difficulty } = req.params;
    const multiplayer = Object.hasOwn(req.query, "m");

    const memory = new Memory({ difficulty, theme, shuffle: false, users: multiplayer ? 2 : 1 });

    const game = {
      memory,
    }

    const gameId = gameManager.createGame(game, memory.users);

    res.redirect(`/play/${gameId}`);

    // res.render("play", {
    //   cards: memory.cards,
    //   difficulty,
    //   multiplayerId: session.multiplayerId,
    //   global: {
    //     sessionId,
    //     translations: req.filterCatalog([
    //       "play.*",
    //       "notifications.*",
    //     ]),
    //   },
    // });
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
