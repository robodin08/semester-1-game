const userId = window.userId;
const user = window.gameUserId;

let canFlip = true;
let isOnMove = false;
let stopTimer = null;

const cards = document.querySelectorAll("#memory-card");

const multiplayerOverlay = document.getElementById("multiplayer-overlay");
const timerElement = document.getElementById("timer");

function updateStats(stat, count) {
  const el = document.getElementById(stat);
  if (el) el.textContent = t(`play.${stat}`, { count });
}

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
const stateSounds = {
  win: winSound = new CreateSound({
    src: "/assets/sounds/win.mp3",
    startAt: 0.16,
    notifications: { error: true },
  }),
  lose: winSound = new CreateSound({
    src: "/assets/sounds/tie.mp3", // <----------------
    notifications: { error: true },
  }),
  tie: winSound = new CreateSound({
    src: "/assets/sounds/tie.mp3",
    notifications: { error: true },
  }),
}

const socket = io({
  auth: {
    uid: userId,
  },
});

socket.on("onMove", ({ userGameId, isFirst = false }) => {
  console.log(userGameId, user);

  if (isFirst) {
    multiplayerOverlay?.classList.add("!hidden");
  }

  if (userGameId === user) {
    isOnMove = true;
    console.log(true, "You are ON the move");
    document.body.classList.remove("!bg-gray-200");

    notification({
      title: t("notifications.cardClick.onMove.title"),
      body: t("notifications.cardClick.onMove.body"),
      type: "success",
    });
  } else {
    isOnMove = false;
    console.log(false, "You are NOT on the move");
    document.body.classList.add("!bg-gray-200");
  }
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
  await delay(5000);
  window.location.href = "/";
});

window.addEventListener("beforeunload", () => socket.off());

socket.on("flipUiCard", ({ i, image }) => {
  console.log("flipUiCard");
  const card = cards[i];
  if (card.querySelector("#image").src !== "") {
    card.querySelector("#image").src = image;
  }

  card.classList.add("card-flip");
  cardFlipSound.play();

  canFlip = true;
});

socket.on(
  "updateStats",
  async ({ turns, pairs, user0, user1, isMatch, cardIndex, lastCardIndex }) => {
    console.log("updateStats");
    await delay(200);

    const card = cards[cardIndex];
    const lastCard = cards[lastCardIndex];

    console.log(user, user0, user1);

    if (isMatch) {
      if (pairs) updateStats("pairs", pairs);
      if (user === 0) {
        updateStats("you", user0);
        updateStats("opponent", user1);
      } else {
        updateStats("you", user1);
        updateStats("opponent", user0);
      }
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

    if (turns) updateStats("turns", turns);
  },
);

socket.on("startTimer", ({ startedAt }) => {
  if (stopTimer) return;
  stopTimer = createTimer(timerElement, startedAt);
});

socket.on("end", ({ time, user0, user1 = 0 }) => {
  console.log("LEVEL COMPLETED");
  fireConfettiCannon();
  stopTimer(time);

  let state;
  if (user0 === user1) {
    state = "tie";
  } else {
    const isUser0 = user === 0;
    const didWin = isUser0 ? user0 > user1 : user1 > user0;
    state = didWin ? "win" : "lose";
  }

  showPopUp(state, time);

  stateSounds[state].play();
});

async function onCardClick(i) {
  if (!isOnMove) {
    notification({
      title: t("notifications.cardClick.notOnMove.title"),
      body: t("notifications.cardClick.notOnMove.body"),
      type: "error",
    });
    return;
  }

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

  canFlip = true;

  console.log(data);

  if (!data && socket.connected) {
    notification({
      title: t("notifications.cardClick.noResponse.title"),
      body: t("notifications.cardClick.noResponse.body"),
      type: "error",
    });
    return;
  }

  if (!data?.success) {
    console.error(data?.error);
    return;
  }
}

cards.forEach((card, i) => {
  card.addEventListener("click", () => {
    onCardClick(i);
  });
});
