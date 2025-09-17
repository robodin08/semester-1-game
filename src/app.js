import express from "express";
import nunjucks from "nunjucks";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import i18n from "i18n";

import Memory from "./memory.js";
import * as sessions from "./sessions.js";
import config from "./config.js";
import createError from "./error.js";

const app = express();

i18n.configure({
  locales: config.locales,
  directory: "src/locales",
  defaultLocale: config.locales[0],
  // header: "accept-language",
  // queryParameter: "lang",
  cookie: "lang",
  autoReload: true,
  syncFiles: true,
  objectNotation: true,
  api: {
    __: "t",
    __n: "tn",
  },
});

app.set("view engine", "html");
const env = nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

env.addFilter("capitalize", (str) => {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
});

env.addFilter("url_encode", function (str) {
  if (!str) return "";
  return encodeURIComponent(str);
});

app.use(express.static("public"));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use(i18n.init);
app.use((req, res, next) => {
  res.locals.currentUrl = req.originalUrl;
  next();
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

app.get("/change-language/:lng", (req, res) => {
  const { lng } = req.params;
  const { redirect } = req.query;

  if (config.locales.includes(lng)) res.cookie("lang", lng);

  let safeRedirect = "/";

  if (redirect && redirect.startsWith("/") && !redirect.startsWith("//")) {
    safeRedirect = redirect;
  }

  res.redirect(safeRedirect);
});

app.get("/play/:theme/:difficulty", (req, res, next) => {
  try {
    const { theme, difficulty } = req.params;

    const game = new Memory({ difficulty, theme, shuffle: false });

    const session = {
      game,
    };

    const sessionId = sessions.createSession({ session });

    const translations = req.getCatalog();

    // console.log(i18n.__h("info.name"));

    res.render("play", {
      cards: game.cards,
      difficulty,
      global: {
        sessionId,
        translations, // Only send the ones you use
      },
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/close", express.text(), (req, res) => {
  const exists = sessions.expireSession(req.body);
  res.sendStatus(exists ? 200 : 401);
});

app.post("/api/flip", (req, res, next) => {
  try {
    const { sessionId, cardIndex } = req.body;

    const session = sessions.getSession(sessionId);
    if (!session)
      throw createError(401, "Session expired or does not exist.", {
        refresh: true,
      });

    const data = session.game.flip(cardIndex);
    if (data.win) {
      sessions.expireSession(sessionId);

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
  console.log(`App is listening on port ${config.port}`),
);
