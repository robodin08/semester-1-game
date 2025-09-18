import i18n from "i18n";

i18n.configure({
  // locales: config.locales,
  directory: "src/locales",
  defaultLocale: "en",
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

/**
 * @param {import("express").Express} app
 */
export default function (app) {
  app.use(i18n.init);
  app.use((req, res, next) => {
    res.locals.currentUrl = req.originalUrl;
    req.filterCatalog = function (phrases) {
      const catalog = req.getCatalog();
      const result = {};

      for (const path of phrases) {
        const keys = path.split(".");
        let src = catalog;
        let dest = result;

        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          if (!(key in src)) break;

          if (i === keys.length - 1) {
            dest[key] = src[key];
          } else {
            dest = dest[key] = dest[key] || {};
            src = src[key];
          }
        }
      }

      return result;
    };
    next();
  });
}
