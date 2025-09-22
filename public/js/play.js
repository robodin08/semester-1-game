const sessionId = window.sessionId;

let canFlip = false;
let isFirstFlip = true;
let stopTimer = null;

const cards = document.querySelectorAll("#memory-card");

const multiplayerOverlay = document.getElementById("multiplayer-overlay");
const timerElement = document.getElementById("timer");

const winSound = new CreateSound({
  src: "/assets/sounds/win.mp3",
  startAt: 0.16,
  notifications: { error: true },
});
const failFlipSound = new CreateSound({
  src: "/assets/sounds/fail_flip.mp3",
  volume: 0.4,
  notifications: { error: true },
});
const cardFlipSound = new CreateSound({
  src: "/assets/sounds/card_flip.mp3",
  volume: 0.6,
  startAt: 0.14,
  notifications: { error: true },
});
const successSound = new CreateSound({
  src: "/assets/sounds/success_flip.mp3",
  volume: 0.4,
  startAt: 0.056,
  notifications: { error: true },
});

const socket = io({
  auth: {
    uid: window.userId,
    // mid: window.multiplayerId,
  },
});

socket.on("gameFull", () => {
  canFlip = true;
  multiplayerOverlay?.classList.add("!hidden");
});

let wasConnectedBefore = false;
socket.on("disconnect", () => {
  notification({
    title: t("notifications.sockets.connectionLost.title"),
    body: t("notifications.sockets.connectionLost.body"),
    type: "error",
  });
});

socket.on("connect", () => {
  if (!wasConnectedBefore) {
    wasConnectedBefore = true;
    return;
  }
  notification({
    title: t("notifications.sockets.reconnected.title"),
    body: t("notifications.sockets.reconnected.body"),
    type: "success",
  });
});

socket.on("expired", async () => {
  socket.off();
  notification({
    title: t("notifications.sockets.sessionExpired.title"),
    body: t("notifications.sockets.sessionExpired.body"),
    type: "error",
  });
  await delay(3000);
  window.location.reload();
});

window.addEventListener("beforeunload", () => socket.off());

function updateStats(stat, count) {
  const el = document.getElementById(stat);
  if (el) el.textContent = t(`play.${stat}`, { count });
}

socket.on("flipUiCard", ({ i, image }) => {
  console.log("flipUiCard");
  const card = cards[i];
  if (!card.querySelector("#image").src) {
    card.querySelector("#image").src = image;
  }

  card.classList.add("card-flip");
  cardFlipSound.play();
  if (isFirstFlip) canFlip = true;
});

socket.on("updateStats", async ({ turns, pairs, isMatch, cardIndex, lastCardIndex }) => {
  console.log("updateStats");
  await delay(200);

  const card = cards[cardIndex];
  const lastCard = cards[lastCardIndex];

  if (isMatch) {
    updateStats("pairs", pairs);
    successSound.play();
    card.classList.add("card-pairs");
    lastCard.classList.add("card-pairs");
  } else {
    failFlipSound.play();
    await delay(1000);
    cardFlipSound.play();
    card.classList.remove("card-flip");
    lastCard.classList.remove("card-flip");
  }

  updateStats("turns", turns);

  isFirstFlip = true;
  canFlip = true;
});

socket.on("startTimer", ({ started_at }) => {
  stopTimer = createTimer(timerElement, started_at);
});

socket.on("win", () => {
  console.log("LEVEL COMPLETED");
  winSound.play();
  fireConfettiCannon();
  stopTimer();
});

async function onCardClick(i) {
  const card = cards[i];
  if (!canFlip || card.classList.contains("card-flip") || socket.disconnected)
    return;
  canFlip = false;

  let data;
  try {
    data = await socket.timeout(5000).emitWithAck("flip", i);
  } catch (e) {
    console.error(e);
    notification({
      title: t("notifications.cardClick.connectionError.title"),
      body: t("notifications.cardClick.connectionError.body"),
      type: "error",
    });
    canFlip = true;
    return;
  }

  console.log(data);

  if (isFirstFlip) isFirstFlip = false;

  if (!data && socket.connected) {
    notification({
      title: t("notifications.cardClick.noResponse.title"),
      body: t("notifications.cardClick.noResponse.body"),
      type: "error",
    });
    canFlip = true;
    return;
  }

  if (!data?.success) {
    console.error(data?.error);
    canFlip = true;
    return;
  }
}

cards.forEach((card, i) => {
  card.addEventListener("click", () => {
    onCardClick(i);
  });
});
