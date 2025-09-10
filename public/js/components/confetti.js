(async () => {
  await import(
    'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js'
  );
})();

const confetti_count = 400;
const confetti_defaults = {
  origin: { y: 0.65, x: 0.5 },
};

function fire(particleRatio, opts) {
  confetti(
    Object.assign({}, confetti_defaults, opts, {
      particleCount: Math.floor(confetti_count * particleRatio),
    })
  );
}

function fireConfettiCannon() {
  fire(0.25, {
    spread: 32,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 72,
  });
  fire(0.35, {
    spread: 120,
    decay: 0.91,
    scalar: 0.4,
  });
  fire(0.1, {
    spread: 144,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 144,
    startVelocity: 45,
  });
}
