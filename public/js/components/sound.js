class CreateSound {
  constructor({ url, volume = 1, startAt = 0 }) {
    this.url = url;
    this.volume = volume;
    this.startAt = startAt;

    // Preload
    this.baseAudio = new Audio(url);
    this.baseAudio.preload = "auto";
    this.ready = new Promise((resolve, reject) => {
      this.baseAudio.addEventListener("canplaythrough", () => resolve(true), { once: true });
      this.baseAudio.addEventListener("error", (e) => reject(e), { once: true });
    });
  }

  async play({ volume, startAt } = {}) {
    await this.ready;

    const audioElement = this.baseAudio.cloneNode(true);
    audioElement.volume = volume ?? this.volume;
    audioElement.currentTime = startAt ?? this.startAt;

    return new Promise((resolve) => {
      audioElement.addEventListener("ended", () => resolve(true), { once: true });
      audioElement.addEventListener("error", (e) => {
        console.error("Audio play error:", e);
        resolve(false);
      }, { once: true });

      audioElement.play().catch((err) => {
        console.error("Audio play error:", err);
        resolve(false);
      });
    });
  }
}