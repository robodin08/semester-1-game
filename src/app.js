import express from 'express';
import nunjucks from 'nunjucks';
import morgan from 'morgan';
import crypto from 'node:crypto';

import * as memory from "./memory.js";

const EXPIRE_SESSION = 60 * 60;


// MAKE GAME IN CLASS


const app = express();

app.set("view engine", "njk");
nunjucks.configure("views", {
    autoescape: true,
    express: app,
});

app.use(express.static("public"));

app.use(morgan("dev")); // after static so skip static events
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

const sessions = new Map();

app.get("/status", (req, res) => {
    res.sendStatus(200);
});

app.get("/", (req, res) => {
    const cards = 16;
    const levelString = memory.createLevel({ cards, shuffle: true });

    const sessionKey = crypto.randomUUID();

    const session = {
        level_string: levelString,
        guesses: 0, // how many attempts
        guessed: 0, // how many guessed correctly
        cards,
        is_first_flip: true,
        last_card_index: null,
        started_at: Date.now(),
        last_api_call: Date.now(),
        expire: function () {
            clearTimeout(session.expire_observer);
            sessions.delete(sessionKey);
        },
        expire_observer: null,
    }

    session.expire_observer = setTimeout(session.expire, EXPIRE_SESSION * 1000);

    sessions.set(sessionKey, session);

    res.render("index", {
        cards,
        global: {
            sessionKey: sessionKey,
            startedAt: session.started_at,
        }
    });
});

app.post("/api/close", express.text(), (req, res) => {
    const session = sessions.get(req.body);
    if (!session) {
        return res.sendStatus(401).end();
    }
    session.expire();
    res.sendStatus(200).end();
});

app.post("/api/flip", (req, res) => {
    const { sessionKey, cardIndex } = req.body;

    const session = sessions.get(sessionKey);
    if (!session) {
        return res.status(401).json({ message: "Session expired or does not exist.", refresh: true });
    }

    const now = Date.now();
    if (now - session.last_api_call < 250) {
        return res.status(429).json({ message: "Too soon." });
    }
    session.last_api_call = now;

    if (cardIndex < 0 || cardIndex >= session.cards) {
        res.status(401).json({ message: "Invalid cardIndex." });
        return;
    }

    const emojiLevel = memory.translateToEmojis(session.level_string);

    const data = {
        emoji: emojiLevel[cardIndex],
    }

    if (session.is_first_flip) {
        session.last_card_index = cardIndex;
    } else {
        session.guesses += 1;

        const success = emojiLevel[cardIndex] === emojiLevel[session.last_card_index];
        if (success) {
            session.guessed++;
            data.success_flip = true;
        };

        if (session.guessed * 2 === session.cards) {
            session.expire();
            data.win = true;
        }

        session.last_card_index = null;
    }

    data.guesses = session.guesses;
    data.guessed = session.guessed;

    session.is_first_flip = !session.is_first_flip;

    res.status(200).json(data);
});

app.listen(3000, () => console.log("App is listening on port 3000"));