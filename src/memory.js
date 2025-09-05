const emojis = Array.from("🤐🎶👌😅😐😒😍🤣😂💩😎😴😭🙌😊👍🤯💕😁🤬🥶😵");

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

export function translateToIndexes(levelString) {
    const emojiIndexes = levelString.split(".");
    return emojiIndexes;
}

export function translateToEmojis(levelString) {
    const emojiIndexes = translateToIndexes(levelString);
    const level = emojiIndexes.map((emojiIndex => emojis[emojiIndex]));
    return level;
}

export function createLevel({ cards = 4, shuffle = true } = {}) {
    if (cards % 2 !== 0) throw new Error("The cards must be even.");

    const level = [];

    for (let i = 0; level.length < cards; i++) {
        const emojiIndex = Math.floor(Math.random() * emojis.length);
        if (!level.includes(emojiIndex)) {
            level.push(emojiIndex);
            level.push(emojiIndex);
        }
    }

    if (shuffle) {
        shuffleLevel(level);
    }

    const levelString = level.join(".");

    return levelString;
}

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