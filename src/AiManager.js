const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

export default class AiManager {
    constructor(game, userEvent, iq = .7) {
        this.game = game;
        this.userEvent = userEvent;
        this.cards = game.memory.cards;
        this.level = new Array(this.cards).fill(null);
        this.iq = iq;

        console.log(this.level);
    }

    flip({ i, image }) {
        const filename = image.split("/").pop();
        const imageIndex = filename.split(".")[0] || image;

        this.level[i] = imageIndex;
    }

    stats({ isMatch, cardIndex, lastCardIndex }) {
        if (isMatch) {
            this.level[cardIndex] = ".";
            this.level[lastCardIndex] = ".";
        }
    }

    onMove({ count = 1, maxCount = 3 }) {
        if (this.level.every(card => card === ".") || count > maxCount) {
            return [];
        }

        const seen = {};
        for (let i = 0; i < this.level.length; i++) {
            const val = this.level[i];
            if (val && val !== ".") {
                if (seen[val] !== undefined && Math.random() < this.iq && seen[val] !== i) {
                    return [seen[val], i];
                } else {
                    seen[val] = i;
                }
            }
        }

        const unknown = [];
        for (let i = 0; i < this.level.length; i++) {
            if (this.level[i] === null) unknown.push(i);
        }

        if (unknown.length >= 2) {
            const first = unknown[Math.floor(Math.random() * unknown.length)];
            let second;
            do {
                second = unknown[Math.floor(Math.random() * unknown.length)];
            } while (second === first);

            return [first, second];
        }

        if (unknown.length === 1) {
            for (let i = 0; i < this.level.length; i++) {
                if (i !== unknown[0] && this.level[i] !== ".") {
                    return [unknown[0], i];
                }
            }
        }

        const candidates = this.level
            .map((v, i) => (v !== "." ? i : null))
            .filter(i => i !== null);

        if (candidates.length >= 2) {
            const first = candidates[Math.floor(Math.random() * candidates.length)];
            let second;
            do {
                second = candidates[Math.floor(Math.random() * candidates.length)];
            } while (second === first);

            return [first, second];
        }

        return this.onMove({ count: count + 1, maxCount });
    }

    async event(eventName, data) {
        if (eventName === "flipUiCard") {
            this.flip(data);
        } else if (eventName === "updateStats") {
            this.stats(data);
        } else if (eventName === "onMove" && data?.userGameId === 1) {
            const result = this.onMove();

            console.log(result);

            if (result.length !== 2) return;

            await delay(getRandomArbitrary(1800, 2500));

            this.game.memory.flip(result[0], 1, this.userEvent);

            await delay(getRandomArbitrary(800, 1800));

            const completed = this.game.memory.flip(result[1], 1, this.userEvent);
            if (completed) this.game.expire();
        }
    }
}