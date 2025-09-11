const cards = document.querySelectorAll('#memory-card');

const global = window.GLOBAL;

let canFlip = true;
let isFirstFlip = true;
let lastCardIndex = null;

const timerElement = document.getElementById('timer');
const guessesElement = document.getElementById('guesses');
const pairsElement = document.getElementById('pairs');

const winSound = new CreateSound({ url: "/assets/sounds/win.mp3", startAt: .16 });
const failFlipSound = new CreateSound({ url: "/assets/sounds/fail_flip.mp3", volume: .4 });
const cardFlipSound = new CreateSound({ url: "/assets/sounds/card_flip.mp3", volume: .6, startAt: .14 });
const successSound = new CreateSound({ url: "/assets/sounds/success_flip.mp3", volume: .4, startAt: .056 });

let stopTimer = null;

function updateGuesses(guesses) {
  guessesElement.textContent = guesses;
}

function updatePairs(pairs) {
  pairsElement.textContent = pairs;
}

async function onCardClick(i) {
  const card = cards[i];
  if (!canFlip || card.classList.contains('card-flip')) return;
  canFlip = false;

  const response = await fetchUrl({
    url: '/api/flip',
    body: {
      sessionId: global.sessionId,
      cardIndex: i,
    },
  });

  console.log(response);

  if (!response.success) {
    if (response.data.refresh) {
      return window.location.reload();
    }

    // Display error
    console.error('Fetch Error:', response.message || 'Unknown error');
    canFlip = true;
    return;
  }

  const data = response.data;

  if (data.started_at) {
    stopTimer = createTimer(timerElement, data.started_at);
  }

  if (!card.querySelector('#image').src) {
    card.querySelector('#image').src = data.image;
  }

  card.classList.add('card-flip');

  cardFlipSound.play();

  if (isFirstFlip) {
    lastCardIndex = i;
  } else {
    const lastCard = cards[lastCardIndex];
    if (data.success_flip) {
      card.classList.add('card-pairs');
      lastCard.classList.add('card-pairs');

      updatePairs(data.pairs);

      successSound.play();

      if (data.win) {
        console.log('LEVEL COMPLETED');
        stopTimer();

        (async () => {
          await winSound();

          fireConfettiCannon();
        })();
      }
    } else {
      failFlipSound.play();

      await delay(1200);

      card.classList.remove('card-flip');
      lastCard.classList.remove('card-flip');

      cardFlipSound.play();
    }

    updateGuesses(data.guesses);
  }

  canFlip = true;

  isFirstFlip = !isFirstFlip;
}

cards.forEach((card, i) => {
  card.addEventListener('click', () => {
    onCardClick(i);
  });
});

// Remove session when closed
window.addEventListener('unload', function () {
  navigator.sendBeacon('/api/close', global.sessionId);
});
