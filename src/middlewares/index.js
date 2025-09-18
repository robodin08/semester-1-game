import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import i18n from "./i18n.js";
import nunjucks from "./nunjucks.js";

/**
 * @param {import("express").Express} app
 */
export default function (app) {
  app.set("view engine", "html");

  app.use(express.static("public"));
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(cookieParser());

  nunjucks(app);
  i18n(app);
}
