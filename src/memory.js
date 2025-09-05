const emojis = Array.from("🤐🎶👌😅😐😒😍🤣😂💩😎😴😭🙌😊👍🤯💕😁🤬🥶😵🍕");

console.log(emojis);

function shuffleLevel(level) {
    let i = level.length, j, temp;
    while (--i > 0) {
        j = Math.floor(Math.random() * (i + 1));
        temp = level[j];
        level[j] = level[i];
        level[i] = temp;
    }
}

export default class Memory {
    constructor({ cards = 4, shuffle = true } = { cards: 4, shuffle: true }) {
        if (cards % 2 !== 0) throw new Error("The cards must be even.");

        this.level = [];

        for (let i = 0; this.level.length < cards; i++) {
            const emojiIndex = Math.floor(Math.random() * emojis.length);
            if (!this.level.includes(emojiIndex)) {
                this.level.push(emojiIndex);
                this.level.push(emojiIndex);
            }
        }

        if (shuffle) {
            shuffleLevel(this.level);
        }

        this.cards = cards;
        this.guesses = 0;
        this.guessed = 0;
        this.is_first_flip = true;
        this.last_card_index = null;
        this.started_at = null;
    }

    flip(cardIndex) {
        if (cardIndex < 0 || cardIndex >= this.cards) {
            return { status: 401, data: { message: "Invalid cardIndex." } };
        }

        const imageLevel = this.level.map((i => emojis[i]));

        const data = {
            emoji: imageLevel[cardIndex],
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
                this.guessed++;
                data.guessed = this.guessed;
                data.success_flip = true;
            };

            if (this.guessed * 2 === this.cards) {
                data.win = true;
            }

            this.last_card_index = null;
        }

        this.is_first_flip = !this.is_first_flip;

        return { status: 200, data };
    }
}

// export function translateToIndexes(levelString) {
//     const emojiIndexes = levelString.split(".");
//     return emojiIndexes;
// }

// export function translateToEmojis(levelString) {
//     const emojiIndexes = translateToIndexes(levelString);
//     const level = emojiIndexes.map((emojiIndex => emojis[emojiIndex]));
//     return level;
// }

// export function createLevel({ cards = 4, shuffle = true } = {}) {
//     if (cards % 2 !== 0) throw new Error("The cards must be even.");

//     const level = [];

//     for (let i = 0; level.length < cards; i++) {
//         const emojiIndex = Math.floor(Math.random() * emojis.length);
//         if (!level.includes(emojiIndex)) {
//             level.push(emojiIndex);
//             level.push(emojiIndex);
//         }
//     }

//     if (shuffle) {
//         shuffleLevel(level);
//     }

//     const levelString = level.join(".");

//     return levelString;
// }



// export function translateLevelString(levelString) {
//     const emojiIndexs = levelString.split(".");

//     console.log(emojiIndexs);
// }

// function shuffle(level) {
//     let i = level.length, j, temp;
//     while (--i > 0) {
//         j = Math.floor(Math.random() * (i + 1));
//         temp = level[j];
//         level[j] = level[i];
//         level[i] = temp;
//     }
// }

// export function createLevel({ cardSets } = { cardSets: 4 }) {
//     const level = [];

//     for (let i = 0; level.length < cardSets * 2; i++) {
//         const emoji = emojis[Math.floor(Math.random() * emojis.length)];
//         if (!level.includes(emoji)) {
//             level.push(emoji);
//             level.push(emoji);
//         }
//     }

//     shuffle(level);

//     let levelString = "";
//     for (let i = 0; i < level.length; i++) {
//         const emojiIndex = emojis.indexOf(level[i]);
//         levelString += emojiIndex + ".";
//     }
//     levelString = levelString.slice(0, -1); // cut off last dot

//     return level;
// }