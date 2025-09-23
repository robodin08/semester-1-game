class CreateSound {
  constructor({
    src,
    volume = 1,
    startAt = 0,
    notifications = { error: true, success: false },
  } = {}) {
    this.src = src;
    this.defaultVolume = volume;
    this.defaultStart = startAt;
    this.notifications = notifications;
    this.audio = new Audio(src);
    this.audio.preload = "auto";
    this.audio.volume = volume;
    this.audio.currentTime = startAt;

    this.audio.addEventListener(
      "canplaythrough",
      () => {
        if (
          this.notifications.success &&
          typeof window.notification === "function"
        ) {
          window.notification({
            title: t("notifications.sounds.loaded.title"),
            body: t("notifications.sounds.loaded.body", { url: this.src }),
            type: "success",
          });
        }
      },
      { once: true },
    );

    this.audio.addEventListener(
      "error",
      () => {
        if (
          this.notifications.error &&
          typeof window.notification === "function"
        ) {
          window.notification({
            title: t("notifications.sounds.failed.title"),
            body: t("notifications.sounds.failed.body", { url: this.src }),
            type: "error",
          });
        }
      },
      { once: true },
    );
  }

  play({
    volume = this.defaultVolume,
    startAt = this.defaultStart,
    loop = false,
  } = {}) {
    const soundClone = this.audio.cloneNode();
    soundClone.volume = volume;
    soundClone.currentTime = startAt;
    soundClone.loop = loop;

    const res = soundClone.play();
    res.catch((e) => console.error("Playback failed:", e));
    return res;
  }
}
