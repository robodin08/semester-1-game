const backgroundSound = new CreateSound({
  src: "/assets/sounds/background_music.mp3",
  volume: 0.08,
  loop: true,
  notifications: { error: true },
  maxQueue: 1,
});

backgroundSound.play().catch(() => {
  document.addEventListener("click", () => backgroundSound.play(), {
    once: true,
  });
});
