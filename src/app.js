import express from "express";

import { createSession, expireSession, getSession } from "./sessions.js";
import Memory from "./memory.js";
import config from "./config.js";
import createError from "./error.js";
import middlewares from "./middlewares/index.js";

const app = express();

middlewares(app);

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

app.get("/play/:theme/:difficulty", (req, res, next) => {
  try {
    const { theme, difficulty } = req.params;

    const game = new Memory({ difficulty, theme, shuffle: true });

    const session = {
      game,
    };

    const sessionId = createSession({ session });

    res.render("play", {
      cards: game.cards,
      difficulty,
      global: {
        sessionId,
        translations: req.filterCatalog([
          "play.pairs",
          "play.timer",
          "play.turns",
          "sounds.loaded",
          "sounds.success",
          "statuses.error",
          "statuses.success",
        ]),
      },
    });
  } catch (error) {
    next(error);
  }
});

app.get("/change-language/:lng", (req, res) => {
  const { lng } = req.params;
  const { redirect } = req.query;

  res.cookie("lang", lng);

  let safeRedirect = "/";

  if (redirect && redirect.startsWith("/") && !redirect.startsWith("//")) {
    safeRedirect = redirect;
  }

  res.redirect(safeRedirect);
});

app.post("/api/close", express.text(), (req, res) => {
  const exists = expireSession(req.body);
  res.sendStatus(exists ? 200 : 401);
});

app.post("/api/flip", (req, res, next) => {
  try {
    const { sessionId, cardIndex } = req.body;

    const session = getSession(sessionId);
    if (!session)
      throw createError(401, "Session expired or does not exist.", {
        refresh: true,
      });

    const data = session.game.flip(cardIndex);
    if (data.win) {
      expireSession(sessionId);

      console.log(Date.now() - session.game.started_at);
    }

    res.status(200).json(data);
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

app.listen(config.port, () =>
  console.log(`App listening on port ${config.port}`),
);
