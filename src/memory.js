const themes = {
    animals: 30,
    faces: 30,  
    food: 30,
    objects: 30,
    plants: 30,
    symbols: 30,
    vehicles: 30,
}

function shuffleLevel(level) {
    let i = level.length, j, temp;
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
    constructor({ cards = 4, theme = "emojis", shuffle = true } = { cards: 4, theme: "emojis", shuffle: true }) {
        if (cards % 2 !== 0) throw new Error("The cards must be even.");

        this.level = [];
        this.imageIndexes = [];

        for (let i = 0; this.level.length < cards; i++) {
            const imageIndex = Math.floor(Math.random() * themes[theme]);
            if (!this.level.includes(imageIndex)) {
                this.level.push(imageIndex);
                this.level.push(imageIndex);

                this.imageIndexes.push(imageIndex);
            }
        }

        if (shuffle) {
            shuffleLevel(this.level);
        }

        this.theme = theme,
        this.cards = cards;
        this.guesses = 0;
        this.pairs = 0;
        this.is_first_flip = true;
        this.last_card_index = null;
        this.started_at = null;
    }

    flip(cardIndex) {
        if (cardIndex < 0 || cardIndex >= this.cards) {
            return { status: 401, data: { message: "Invalid cardIndex." } };
        }

        const data = {
            image: `/assets/themes/${this.theme}/${this.level[cardIndex]}.svg`,
        }

        if (!this.started_at) {
            this.started_at = Date.now();
            data.started_at = this.started_at;
        }

        if (this.is_first_flip) {
            this.last_card_index = cardIndex;
        } else {
            this.guesses += 1;
            data.guesses = this.guesses;

            const success = this.level[cardIndex] === this.level[this.last_card_index];
            if (success) {
                this.pairs++;
                data.pairs = this.pairs;
                data.success_flip = true;
            };

            if (this.pairs * 2 === this.cards) {
                data.win = true;
            }

            this.last_card_index = null;
        }

        this.is_first_flip = !this.is_first_flip;

        return { status: 200, data };
    }
}