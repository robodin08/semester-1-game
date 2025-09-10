import express from 'express';
import nunjucks from 'nunjucks';
import morgan from 'morgan';

import Memory, { themes, themeExists } from './memory.js';
import * as sessions from './sessions.js';

const EXPIRE_SESSION = 60 * 60;
const DIFFICULTIES = {
  easy:    { color: "bg-emerald-400", cards: 4 },
  normal:  { color: "bg-sky-500", cards: 16 },
  hard:    { color: "bg-rose-500", cards: 30 },
  extreme: { color: "bg-purple-900", cards: 52 },
};

const app = express();

app.set('view engine', 'html');
const env = nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

env.addFilter('capitalize', (str) => {
  if (!str) return '';
  return str
    .split(' ')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
});

app.use(express.static('public'));

app.use(morgan('dev')); // after static so skip static events
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

app.get('/status', (req, res) => res.sendStatus(200));

app.get('/new', (req, res) => {
  res.render('newhome', {
    themes: Object.entries(themes).map(([name, t]) => ({ name, color: t.color })),
    difficulties: Object.entries(DIFFICULTIES).map(([name, d]) => ({ name, color: d.color })),
  });
});

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/play/:theme/:difficulty', (req, res) => {
  const { theme, difficulty } = req.params;

  const cards = DIFFICULTIES[difficulty].cards;
  if (!cards) {
    return res
      .status(404)
      .json({ message: `Difficulty "${difficulty}" does not exist.` }); // make error page
  }

  if (!themeExists(theme)) {
    return res
      .status(404)
      .json({ message: `Theme "${theme}" does not exist.` });
  }

  const game = new Memory({ cards, theme, shuffle: true });

  const session = {
    game,
    last_api_call: Date.now(),
  };

  const sessionId = sessions.createSession({ session, EXPIRE_SESSION });

  res.render('play', {
    cards,
    difficulty,
    global: {
      sessionId,
    },
  });
});

app.post('/api/close', express.text(), (req, res) => {
  const exists = sessions.expireSession(req.body);
  res.sendStatus(exists ? 200 : 401);
});

app.post('/api/flip', (req, res) => {
  const { sessionId, cardIndex } = req.body;

  const session = sessions.getSession(sessionId);
  if (!session) {
    return res
      .status(401)
      .json({ message: 'Session expired or does not exist.', refresh: true });
  }

  const now = Date.now();
  if (now - session.last_api_call < 250) {
    return res.status(429).json({ message: 'Too soon.' });
  }
  session.last_api_call = now;

  const { status, data } = session.game.flip(cardIndex);
  if (data.win) {
    sessions.expireSession(sessionId);

    console.log(now - session.game.started_at);
  }

  res.status(status).json(data);
});

app.listen(3000, () => console.log('App is listening on port 3000'));
