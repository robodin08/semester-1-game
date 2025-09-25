const backgroundSound = new CreateSound({
  src: "/assets/sounds/background_music.mp3",
  volume: 0.12,
  loop: true,
  notifications: { error: true },
  maxQueue: 1,
});

function playBackgroundMusic() {
  backgroundSound.play().catch(() => {
    document.addEventListener("click", () => playBackgroundMusic(), {
      once: true,
    });
  });
}

playBackgroundMusic();