window.fireConfettiCannon = () => "Confetti script loading";

const confettiScript = document.createElement("script");
confettiScript.src = "/js/libs/confetti.min.js";

confettiScript.onload = () => {
  function fire(particleRatio, opts) {
    confetti(
      Object.assign({}, { origin: { y: 0.65, x: 0.5 } }, opts, {
        particleCount: Math.floor(400 * particleRatio),
      }),
    );
  }

  window.fireConfettiCannon = () => {
    fire(0.25, { spread: 32, startVelocity: 55 });
    fire(0.2, { spread: 72 });
    fire(0.35, { spread: 120, decay: 0.91, scalar: 0.4 });
    fire(0.1, { spread: 144, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 144, startVelocity: 45 });
  };
};

confettiScript.onerror = () => {
  console.error("Failed to load confetti script");
  window.fireConfettiCannon = () => "Confetti loading failed";
};

document.head.appendChild(confettiScript);
