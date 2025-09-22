import i18n from "i18n";

i18n.configure({
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
    const urlParts = req.path.split("/").filter(Boolean);

    const lng = urlParts[0];

    if (!i18n.getLocales().includes(lng)) {
      return next();
    }

    res.cookie("lang", lng, { httpOnly: true, sameSite: "lax" });

    const pathWithoutLng = "/" + urlParts.slice(1).join("/");

    return res.redirect(pathWithoutLng || "/");
  });

  app.use((req, res, next) => {
    res.locals.currentUrl = req.originalUrl;

    const protocol = req.protocol;
    const host = req.get("host");
    res.locals.baseURl = `${protocol}://${host}`;

    req.filterCatalog = function (phrases) {
      const catalog = req.getCatalog();
      const result = {};

      const copySubtree = (src) => {
        return JSON.parse(JSON.stringify(src));
      };

      for (const path of phrases) {
        const keys = path.split(".");
        let src = catalog;
        let dest = result;

        let found = true;
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];

          if (key === "*") {
            Object.assign(dest, copySubtree(src));
            found = false;
            break;
          }

          if (!(key in src)) {
            found = false;
            break;
          }

          if (i === keys.length - 1) {
            dest[key] = copySubtree(src[key]);
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
