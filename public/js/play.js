const cards = document.querySelectorAll('.card');

const global = window.GLOBAL;

let canFlip = true;
let isFirstFlip = true;
let lastCardIndex = null;

const timerElement = document.getElementById('timer');
const guessesElement = document.getElementById('guesses');
const pairsElement = document.getElementById('pairs');

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
    if (response.error.refresh) {
      return window.location.reload();
    }

    // Display error
    console.error('Fetch Error:', response.error || 'Unknown error');
    canFlip = true;
    return;
  }

  const data = response.data;

  if (data.started_at) {
    stopTimer = createTimer(timerElement, data.started_at);
  }

  card.querySelector('#image').src = data.image;

  card.classList.add('card-flip');

  playSound({
    name: 'card_flip.mp3',
    volume: 0.6,
    startAt: 0.14,
  });

  if (isFirstFlip) {
    lastCardIndex = i;
  } else {
    const lastCard = cards[lastCardIndex];
    if (data.success_flip) {
      card.classList.add('card-pairs');
      lastCard.classList.add('card-pairs');

      updatePairs(data.pairs);

      playSound({
        name: 'success_flip.mp3',
        volume: 0.4,
        startAt: 0.056,
      });

      if (data.win) {
        console.log('LEVEL COMPLETED');
        stopTimer();

        (async () => {
          await playSound({
            name: 'win.mp3',
            startAt: 0.16,
          });

          fireConfettiCannon();
        })();
      }
    } else {
      playSound({
        name: 'fail_flip.mp3',
        volume: 0.4,
      });

      await delay(1200);

      card.classList.remove('card-flip');
      lastCard.classList.remove('card-flip');

      playSound({
        name: 'card_flip.mp3',
        volume: 0.6,
        startAt: 0.14,
      });

      // await waitForTransitionEnd(card.querySelector(".card-inner"));

      // card.querySelector("span").textContent = "";
      // lastCard.querySelector("span").textContent = "";
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
