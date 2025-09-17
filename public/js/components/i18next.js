window.t = () => "i18n loading";

const i18nScript = document.createElement("script");
i18nScript.src = "/js/libs/i18next.min.js";
i18nScript.onload = () => {
  i18next
    .init({
      lng: window.lang,
      resources: {
        [window.lang]: {
          translation: window.translations,
        },
      },
    })
    .then(() => {
      window.t = i18next.t;
    })
    .catch(() => {
      console.error("i18next initialization failed");
      window.t = () => "i18n failed";
    });
};
i18nScript.onerror = () => {
  console.error("Failed to load i18next");
  window.t = () => "i18n failed";
};
document.head.appendChild(i18nScript);
