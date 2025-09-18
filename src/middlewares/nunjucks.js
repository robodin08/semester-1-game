import nunjucks from "nunjucks";

/**
 * @param {import("express").Express} app
 */
export default function (app) {
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
}
