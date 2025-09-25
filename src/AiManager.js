const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function chance(i) { // 0 - 1
    return Math.random() < i;
}

export default class AiManager {
    constructor(game, userEvent, iq = .7) {
        this.game = game;
        this.userEvent = userEvent;
        this.cards = game.memory.cards;
        this.level = new Array(this.cards).fill(null);
        this.iq = iq;
    }

    flip({ i, image }) {
        const filename = image.split("/").pop();
        const imageIndex = filename.split(".")[0] || image;

        this.level[i] = Number(imageIndex);
    }

    stats({ isMatch, cardIndex, lastCardIndex }) {
        if (isMatch) {
            this.level[cardIndex] = ".";
            this.level[lastCardIndex] = ".";
        }
    }

    onMove() {
        if (this.level.every(card => card === ".")) {
            return [];
        }

        const seen = new Map();
        const unknown = [];

        for (let i = 0; i < this.level.length; i++) {
            const imageIndex = this.level[i];

            if (imageIndex !== "." && imageIndex !== null) {
                if (seen.has(imageIndex) && imageIndex === this.level[seen.get(imageIndex)] && chance(this.iq)) { // iq
                    if (chance(.5)) {
                        return [seen.get(imageIndex), i];
                    } else {
                        return [i, seen.get(imageIndex)];
                    }
                } else {
                    seen.set(imageIndex, i);
                }
            }

            if ((this.level[i] === null || chance((1 - this.iq) / 2)) && this.level[i] !== ".") { // iq
                unknown.push(i);
            }
        }

        if (unknown.length < 2) {
            this.level.forEach((val, i) => {
                if (val !== "." && !unknown.includes(i)) {
                    unknown.push(i);
                }
            });
        }

        const first = unknown[Math.floor(Math.random() * unknown.length)];
        let second = first;

        const imageIndex = this.game.memory.level[first][0];

        if (seen.has(imageIndex) && chance(this.iq)) { // iq
            second = seen.get(imageIndex);
        }

        let attempts = 0;
        while (second === first && attempts < unknown.length * 2) {
            second = unknown[Math.floor(Math.random() * unknown.length)];
            attempts++;
        }

        if (second === first) { // fallback for random
            for (const i of unknown) {
                if (i !== first) {
                    second = i;
                    break;
                }
            }
        }

        return [first, second];
    }

    async event(eventName, data) {
        if (eventName === "flipUiCard") {
            this.flip(data);
        } else if (eventName === "updateStats") {
            this.stats(data);
        } else if (eventName === "onMove" && data?.userGameId === 1) {
            const result = this.onMove();

            if (result.length !== 2) return;

            await delay(getRandomArbitrary(1800, 2500));

            this.game.memory.flip(result[0], 1, this.userEvent);

            await delay(getRandomArbitrary(800, 1800));

            const completed = this.game.memory.flip(result[1], 1, this.userEvent);
            if (completed) this.game.expire();
        }
    }
}