import crypto from 'node:crypto';

import config from './config.js';

const sessions = new Map();

export function createSession({ session = {} }) {
  const sessionId = crypto.randomUUID();

  session._last_interaction = Date.now();

  sessions.set(sessionId, session);

  return sessionId;
}

export function getSession(sessionId) {
  const session = sessions.get(sessionId);
  if (session) session._last_interaction = Date.now();
  return session;
}

export function expireSession(sessionId) {
  return sessions.delete(sessionId);
}

function expireInactiveSessions() {
  const now = Date.now();
  sessions.forEach((session, sessionId) => {
    if (now - session._last_interaction > config.sessions.expire) {
      expireSession(sessionId);
    }
  });
}

setInterval(expireInactiveSessions, config.sessions.delay);