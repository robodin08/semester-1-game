import express from 'express';
import nunjucks from 'nunjucks';
import morgan from 'morgan';

import Memory from './memory.js';
import * as sessions from './sessions.js';

const EXPIRE_SESSION = 60 * 60;
const DIFFICULTIES = {
    "easy": 16,
    // "normal": 25,
}

const app = express();

app.set("view engine", "njk");
const env = nunjucks.configure("views", {
    autoescape: true,
    express: app,
});

env.addFilter("capitalize", (str) => {
    if (!str) return "";
    return str
        .split(" ")
        .map(word => word[0].toUpperCase() + word.slice(1))
        .join(" ");
});

app.use(express.static("public"));

app.use(morgan("dev")); // after static so skip static events
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

app.get("/status", (req, res) => res.sendStatus(200));

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/play/:difficulty", (req, res) => {
    const difficulty = req.params.difficulty;

    const cards = DIFFICULTIES[difficulty];
    if (!cards) {
        return res.status(404).json({ message: `Difficulty "${difficulty}" does not exist.` }); // make error page
    }

    const game = new Memory({ cards, shuffle: false });

    const session = {
        game,
        last_api_call: Date.now(),
    }

    const sessionId = sessions.createSession({ session, EXPIRE_SESSION });

    res.render("play", {
        cards,
        difficulty,
        global: {
            sessionId,
        }
    });
});

app.post("/api/close", express.text(), (req, res) => {
    const exists = sessions.expireSession(req.body);
    res.sendStatus(exists ? 200 : 401);
});

app.post("/api/flip", (req, res) => {
    const { sessionId, cardIndex } = req.body;

    const session = sessions.getSession(sessionId);
    if (!session) {
        return res.status(401).json({ message: "Session expired or does not exist.", refresh: true });
    }

    const now = Date.now();
    if (now - session.last_api_call < 250) {
        return res.status(429).json({ message: "Too soon." });
    }
    session.last_api_call = now;

    const { status, data } = session.game.flip(cardIndex);
    if (data.win) {
        sessions.expireSession(sessionId);

        console.log(now - session.game.started_at);
    }

    res.status(status).json(data);
});

app.listen(3000, () => console.log("App is listening on port 3000"));