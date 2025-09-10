export const themes = {
  animals: { color: "bg-emerald-400", items: 30 },
  faces: { color: "bg-sky-400", items: 30 },
  food: { color: "bg-amber-400", items: 30 },
  objects: { color: "bg-violet-500", items: 30 },
  plants: { color: "bg-lime-400", items: 30 },
  symbols: { color: "bg-pink-400", items: 30 },
  vehicles: { color: "bg-orange-400", items: 30 },
  activities: { color: "bg-indigo-500", items: 30 },
};

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

export function themeExists(theme) {
  return themes[theme] ? true : false;
}

export default class Memory {
  constructor(
    { cards = 4, theme = 'faces', shuffle = true } = {
      cards: 4,
      theme: 'faces',
      shuffle: true,
    }
  ) {
    if (cards % 2 !== 0) throw new Error('The cards must be even.');

    this.level = [];

    for (let i = 0; this.level.length < cards; i++) {
      const imageIndex = Math.floor(Math.random() * themes[theme].items);
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
    if (cardIndex < 0 || cardIndex >= this.cards) {
      return { status: 401, data: { message: 'Invalid cardIndex.' } };
    }

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

    return { status: 200, data };
  }
}
