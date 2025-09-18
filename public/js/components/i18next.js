(async () => {
  await loadScript("/js/libs/i18next.min.js");

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
    });
})();
