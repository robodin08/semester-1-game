const difficultyButtons = document.querySelectorAll(".card-difficulty");
const playButton = document.querySelector(".card-play");

let selectedDifficulty = null;

difficultyButtons.forEach((button, i) => {
    button.addEventListener("click", () => {
        difficultyButtons.forEach(button => button.classList.remove("selected"));
        button.classList.add("selected");

        selectedDifficulty = i;
    });
});

difficultyButtons[1].click();

playButton.addEventListener("click", () => {
    window.location.href = "/play/faces/" + (difficultyButtons[selectedDifficulty].textContent).toLocaleLowerCase();
});