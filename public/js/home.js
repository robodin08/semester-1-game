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

playButton.addEventListener("click", () => {
  if (selectedDifficulty === null || selectedTheme === null) return;
  const difficulty =
    difficultyButtons[selectedDifficulty].getAttribute("data-difficulty");
  const theme = themeButtons[selectedTheme].getAttribute("data-theme");
  window.location.href = `/play/${theme}/${difficulty}`;
});

// multiplayerButton.addEventListener("click", () => {
// });
