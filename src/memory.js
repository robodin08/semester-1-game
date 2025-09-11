import config from "./config.js";
import createError from "./error.js";

function shuffleLevel(level) {
  let i = level.length,
    j,
    temp;
  while (--i > 0) {
    j = Math.floor(Math.random() * (i + 1));
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
    { difficulty = 'normal', theme = 'faces', shuffle = true } = {
      difficulty: 'normal',
      theme: 'faces',
      shuffle: true,
    }
  ) {
    if (!difficultyExists(difficulty)) throw createError(404, `Difficulty "${difficulty}" does not exist.`)
    if (!themeExists(theme)) throw createError(404, `Theme "${theme}" does not exist.`);

    const cards = config.game.difficulties[difficulty].cards;
    const themeItems = config.game.themes[theme].items;

    this.level = [];

    for (let i = 0; this.level.length < cards; i++) {
      const imageIndex = Math.floor(Math.random() * themeItems);
      if (!this.level.includes(imageIndex)) {
        this.level.push(imageIndex);
        this.level.push(imageIndex);
      }
    }

    if (shuffle) {
      shuffleLevel(this.level);
    }

    ((this.theme = theme), (this.cards = cards));
    this.guesses = 0;
    this.pairs = 0;
    this.is_first_flip = true;
    this.last_card_index = null;
    this.started_at = null;
  }

  flip(cardIndex) {
    if (cardIndex < 0 || cardIndex >= this.cards) throw createError(401, 'Invalid cardIndex.');

    const data = {
      image: `/assets/themes/${this.theme}/${this.level[cardIndex]}.svg`,
    };

    if (!this.started_at) {
      this.started_at = Date.now();
      data.started_at = this.started_at;
    }

    if (this.is_first_flip) {
      this.last_card_index = cardIndex;
    } else {
      this.guesses += 1;
      data.guesses = this.guesses;

      const success =
        this.level[cardIndex] === this.level[this.last_card_index];
      if (success) {
        this.pairs++;
        data.pairs = this.pairs;
        data.success_flip = true;
      }

      if (this.pairs * 2 === this.cards) {
        data.win = true;
      }

      this.last_card_index = null;
    }

    this.is_first_flip = !this.is_first_flip;

    return data;
  }
}
