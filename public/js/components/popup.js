function showPopUp(state = "tie", timeSpent = 0) {
  const popup = document.getElementById("popup");
  const content = popup.querySelector("#content");
  const title = popup.querySelector("#title");
  const message = popup.querySelector("#message");
  const time = popup.querySelector("#time");

  title.textContent = t(`popups.${state}.title`);
  message.textContent = t(`popups.${state}.message`);
  time.textContent = formatMMSS(timeSpent);

  popup.classList.remove("!hidden");
  setTimeout(() => {
    content.classList.remove("scale-50", "opacity-0");
    content.classList.add("scale-100", "opacity-100");
  }, 50);
}
