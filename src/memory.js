import config from "./config.js";
import createError from "./error.js";

function createRng(seed) {
  let t = seed;
  return function () {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleLevel(level, rng) {
  let i = level.length,
    j,
    temp;
  while (--i > 0) {
    j = Math.floor(rng() * (i + 1));
    temp = level[j];
    level[j] = level[i];
    level[i] = temp;
  }
}

function themeExists(theme) {
  return config.game.themes[theme] ? true : false;
}

function difficultyExists(difficulty) {
  return config.game.difficulties[difficulty] ? true : false;
}

export default class Memory {
  constructor(
    { difficulty = "normal", theme = "faces", shuffle = true, seed = Date.now(), users = 1 }
  ) {
    if (!difficultyExists(difficulty))
      throw createError(404, `Difficulty "${difficulty}" does not exist.`);
    if (!themeExists(theme))
      throw createError(404, `Theme "${theme}" does not exist.`);

    this.rng = createRng(seed);
    this.seed = seed;

    const cards = config.game.difficulties[difficulty].cards;
    const themeItems = config.game.themes[theme].items;

    this.level = [];

    for (let i = 0; this.level.length < cards; i++) {
      const imageIndex = Math.floor(this.rng() * themeItems);
      if (!this.level.includes(imageIndex)) {
        this.level.push(imageIndex);
        this.level.push(imageIndex);
      }
    }

    if (shuffle) {
      shuffleLevel(this.level, this.rng);
    }

    this.level = this.level.map(i => [i, 0]);
    /*
    [ [ imageIndex, state (0=normal 1=flipped 2=guessed) ] ]
    */

    this.users = users
    this.shuffle = shuffle;
    this.difficulty = difficulty;
    this.theme = theme;
    this.cards = cards;

    for (let user = 0; user < users; user++) {
      this[user] = {};
      this[user].turns = 0;
      this[user].pairs = 0;
      this[user].can_flip = user === 0;
    }

    this.is_first_flip = true;
    this.last_card_index = null;
    this.started_at = null;
    this.can_flip = false;
  }

  getCardImage(cardIndex) {
    return `/assets/themes/${this.theme}/${this.level[cardIndex][0]}.svg`;
  }

  flip(cardIndex, user = 0, events = {}) {
    if (!this.can_flip)
      throw new Error("Game is not started yet.");

    if (!this[user].can_flip)
      throw new Error("You cannot flip a card.");

    if (cardIndex < 0 || cardIndex >= this.cards)
      throw new Error("Invalid cardIndex.");

    if (this.level[cardIndex][1] !== 0)
      throw new Error("You cannot flip a card that is already flipped.");

    this[user].can_flip = false;

    if (!this.started_at) {
      this.started_at = Date.now();
      events("startTimer", { started_at: this.started_at });
    }

    this.level[cardIndex][1] = 1;
    events("flipUiCard", { i: cardIndex, image: `/assets/themes/${this.theme}/${this.level[cardIndex][0]}.svg` });

    if (this.is_first_flip) {
      this.last_card_index = cardIndex;
      this[user].can_flip = true;
      this.is_first_flip = false;
    } else {
      this[user].turns += 1;

      const [cardImageIndex, cardState] = this.level[cardIndex];
      const [lastImageIndex, lastState] = this.level[this.last_card_index];

      const isMatch = cardImageIndex === lastImageIndex && cardState === 1 && lastState === 1;
      if (isMatch) {
        this[user].pairs++;
      }

      this.level[cardIndex][1] = isMatch ? 2 : 0;
      this.level[this.last_card_index][1] = isMatch ? 2 : 0;

      events("updateStats", { turns: this[user].turns, pairs: this[user].pairs, isMatch, cardIndex, lastCardIndex: this.last_card_index });

      const allMatched = this.level.every(card => card[1] === 2);

      if (allMatched) {
        console.log("🎉 All cards matched!");
        events("win");
      }

      this.last_card_index = null;
      this[(user + 1) % this.users].can_flip = true;
      this.is_first_flip = true;

      
    }
  }

  // clone() {
  //   return new Memory({ difficulty: this.difficulty, theme: this.theme, shuffle: this.shuffle, seed: this.seed });
  // }
}
