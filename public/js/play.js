const cards = document.querySelectorAll("#memory-card");

const sessionId = window.sessionId;

let canFlip = true;
let isFirstFlip = true;
let lastCardIndex = null;

const timerElement = document.getElementById("timer");

const winSound = new CreateSound({
  url: "/assets/sounds/win.mp3",
  startAt: 0.16,
  notifications: { error: true },
});
const failFlipSound = new CreateSound({
  url: "/assets/sounds/fail_flip.mp3",
  volume: 0.4,
  notifications: { error: true },
});
const cardFlipSound = new CreateSound({
  url: "/assets/sounds/card_flip.mp3",
  volume: 0.6,
  startAt: 0.14,
  notifications: { error: true },
});
const successSound = new CreateSound({
  url: "/assets/sounds/success_flip.mp3",
  volume: 0.4,
  startAt: 0.056,
  notifications: { error: true },
});

let stopTimer = null;

function updateStats(stat, count) {
  const el = document.getElementById(stat);
  if (el) el.textContent = t(`play.${stat}`, { count });
}

async function onCardClick(i) {
  const card = cards[i];
  if (!canFlip || card.classList.contains("card-flip")) return;
  canFlip = false;

  const response = await fetchUrl({
    url: "/api/flip",
    body: {
      sessionId: sessionId,
      cardIndex: i,
    },
  });

  console.log(response);

  if (!response.success) {
    if (response.data.refresh) {
      return window.location.reload();
    }

    // Display error
    console.error("Fetch Error:", response.message || "Unknown error");
    canFlip = true;
    return;
  }

  const data = response.data;

  if (data.started_at) {
    stopTimer = createTimer(timerElement, data.started_at);
  }

  if (!card.querySelector("#image").src) {
    card.querySelector("#image").src = data.image;
  }

  card.classList.add("card-flip");

  cardFlipSound.play();

  if (isFirstFlip) {
    lastCardIndex = i;
  } else {
    const lastCard = cards[lastCardIndex];
    if (data.success_flip) {
      card.classList.add("card-pairs");
      lastCard.classList.add("card-pairs");

      updateStats("pairs", data.pairs);

      successSound.play();

      if (data.win) {
        console.log("LEVEL COMPLETED");
        stopTimer();

        winSound.play();

        fireConfettiCannon();
      }
    } else {
      failFlipSound.play();

      await delay(1200);

      card.classList.remove("card-flip");
      lastCard.classList.remove("card-flip");

      cardFlipSound.play();
    }

    updateStats("turns", data.turns);
  }

  canFlip = true;

  isFirstFlip = !isFirstFlip;
}

cards.forEach((card, i) => {
  card.addEventListener("click", () => {
    onCardClick(i);
  });
});

// Remove session when closed
window.addEventListener("unload", function () {
  navigator.sendBeacon("/api/close", sessionId);
});
