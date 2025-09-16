class CreateSound {
  constructor({
    url,
    volume = 1,
    startAt = 0,
    notifications = { error: true, success: false, play: false, ended: false },
  }) {
    this.url = url;
    this.volume = volume;
    this.startAt = startAt;
    this.notifications = notifications;

    // Create an AudioContext
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // Gain node for volume control
    this.gainNode = this.audioCtx.createGain();
    this.gainNode.gain.value = volume;
    this.gainNode.connect(this.audioCtx.destination);

    // Load and decode audio
    this.ready = fetch(url)
      .then((res) => res.arrayBuffer())
      .then((arrayBuffer) => this.audioCtx.decodeAudioData(arrayBuffer))
      .then((buffer) => {
        this.buffer = buffer;

        if (this.notifications.success && typeof notification === "function") {
          notification({
            title: "Success",
            body: `Sound loaded: ${this.url}`,
            type: "success",
          });
        }

        return true;
      })
      .catch((e) => {
        console.error("Audio load/decode error:", e);

        if (this.notifications.error && typeof notification === "function") {
          notification({
            title: "Error",
            body: `Failed to load sound: ${this.url}`,
            type: "error",
          });
        }

        return false;
      });
  }

  async play({ volume, startAt, loop = false } = {}) {
    const loaded = await this.ready;
    if (!loaded) return false;

    const source = this.audioCtx.createBufferSource();
    source.buffer = this.buffer;
    source.loop = loop;

    // Connect to a gain node for individual volume control
    const gain = this.audioCtx.createGain();
    gain.gain.value = volume ?? this.volume;
    source.connect(gain).connect(this.audioCtx.destination);

    if (this.notifications.play && typeof notification === "function") {
      notification({
        title: "Playing Sound",
        body: this.url,
        type: "info",
      });
    }

    // Start at specific time
    source.start(0, startAt ?? this.startAt);

    return new Promise((resolve) => {
      source.onended = () => {
        if (this.notifications.ended && typeof notification === "function") {
          notification({
            title: "Sound Ended",
            body: this.url,
            type: "info",
          });
        }
        resolve(true);
      };
    });
  }

  setVolume(volume) {
    this.volume = volume;
    this.gainNode.gain.value = volume;
  }
}
