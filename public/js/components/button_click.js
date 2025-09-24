const buttonClickSound = new CreateSound({
    src: "/assets/sounds/button_click.mp3",
    volume: 0.5,
    notifications: { error: true },
});

const buttons = document.querySelectorAll(".s-click");
buttons.forEach((button) => {
    button.addEventListener("click", () => buttonClickSound.play());
});