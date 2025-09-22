const difficultyButtons = document.querySelectorAll(".difficulty-btn");
const themeButtons = document.querySelectorAll(".theme-btn");
const playButton = document.getElementById("play-btn");
const multiplayerButton = document.getElementById("multiplayer-btn");

let selectedDifficulty = null;
let selectedTheme = null;

difficultyButtons.forEach((button, i) => {
  button.addEventListener("click", () => {
    // difficultyButtons.forEach((btn) => btn.classList.remove("selected"));
    difficultyButtons[selectedDifficulty]?.classList.remove("selected");
    button.classList.add("selected");
    selectedDifficulty = i;
  });
});

themeButtons.forEach((button, i) => {
  button.addEventListener("click", () => {
    // themeButtons.forEach((btn) => btn.classList.remove("selected"));
    themeButtons[selectedTheme]?.classList.remove("selected");
    button.classList.add("selected");
    selectedTheme = i;
  });
});

difficultyButtons[1].click();
themeButtons[0].click();

function getSelectedParams() {
  if (selectedDifficulty === null || selectedTheme === null) return null;
  const difficulty = difficultyButtons[selectedDifficulty].getAttribute("data-difficulty");
  const theme = themeButtons[selectedTheme].getAttribute("data-theme");
  return { difficulty, theme };
}

playButton.addEventListener("click", () => {
  const params = getSelectedParams();
  if (!params) return;
  window.location.href = `/play/${params.theme}/${params.difficulty}`;
});

multiplayerButton.addEventListener("click", () => {
  const params = getSelectedParams();
  if (!params) return;
  window.location.href = `/play/${params.theme}/${params.difficulty}?m`;
});
