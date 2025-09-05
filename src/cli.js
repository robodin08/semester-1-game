import * as logs from "./logs.js";

const cardSets = 8;
const gridRows = 4
const gridCols = 4;

const emojis = ["👍", "💩", "🎶", "🤐", "😭", "🤯", "😎", "😴", "🙌"];

function shuffle(level) {
    let i = level.length, j, temp;
    while (--i > 0) {
        j = Math.floor(Math.random() * (i + 1));
        temp = level[j];
        level[j] = level[i];
        level[i] = temp;
    }
}

function createLevel({ cardSets } = { cardSets: 4 }) {
    const level = [];

    for (let i = 0; level.length < cardSets * 2; i++) {
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        if (!level.includes(emoji)) {
            level.push(emoji);
            level.push(emoji);
        }
    }

    shuffle(level);

    return level;
}

async function start() {
    logs.start();

    const level = createLevel({ cardSets });
    const userLevel = Array(level.length).fill("*");
    let guessedSets = 0;
    let guesses = 0;
    let selecedCard = null;

    console.log(level);

    while (guessedSets < cardSets) {
        logs.logLevel(userLevel, gridRows, gridCols);
        logs.logScore(guesses, guessedSets);
        const cardIndex = await logs.askCard(gridRows, gridCols);
        if (cardIndex === null) break;

        if (selecedCard !== null) {
            if (level[selecedCard] === level[cardIndex]) {
                userLevel[cardIndex] = level[cardIndex];
                guessedSets++;
            } else {
                userLevel[selecedCard] = "*";
            }
            selecedCard = null;
            guesses++;
        } else {
            userLevel[cardIndex] = level[cardIndex];
            selecedCard = cardIndex;
        }
    }

    logs.stop();
    logs.logScore(guesses, guessedSets);
}

start();