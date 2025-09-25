function showPopUp(state = "tie", time = 0, score) {
  const popup = document.getElementById("popup");
  const content = popup.querySelector("#content");
  const titleEl = popup.querySelector("#title");
  const messageEl = popup.querySelector("#message");
  const scoreEl = popup.querySelector("#score");
  const timeEl = popup.querySelector("#time");

  titleEl.textContent = t(`popups.${state}.title`);
  messageEl.textContent = t(`popups.${state}.message`);
  timeEl.textContent = formatMMSS(time);

  if (score) {
    scoreEl.textContent = score;
  } else {
    scoreEl.classList.add("!hidden");
  }

  popup.classList.remove("!hidden");
  setTimeout(() => {
    content.classList.remove("scale-50", "opacity-0");
    content.classList.add("scale-100", "opacity-100");
  }, 50);
}
