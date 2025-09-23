function formatMMSS(clock) {
  const totalSeconds = Math.floor(clock / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  const milliseconds = String(Math.floor((clock % 1000) / 100));
  return `${minutes}:${seconds}.${milliseconds}`;
}

function updateLabel(el, time) {
  el.textContent = t("play.timer", { time: formatMMSS(time) });
}

function createTimer(el, startedAt) {
  function update() {
    const now = Date.now();
    const elapsed = now - startedAt;
    updateLabel(el, elapsed);
  }

  update();
  const interval = setInterval(update, 100);

  return (time) => {
    clearInterval(interval);
    updateLabel(el, time);
  };
}
