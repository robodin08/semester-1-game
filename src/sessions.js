import crypto from 'node:crypto';

const sessions = new Map();

export function createSession({ session = {}, expire = 60 }) {
    const sessionId = crypto.randomUUID();

    function expireSession() {
        clearTimeout(session._expire_observer);
        sessions.delete(sessionId);
    }

    session.expire = expireSession;
    session._expire_observer = setTimeout(session.expire, expire * 1000);

    sessions.set(sessionId, session);

    return sessionId;
}

export function getSession(sessionId) {
    return sessions.get(sessionId);
}

export function expireSession(sessionId) {
    const session = getSession(sessionId);
    if (session) {
        session.expire();
        return true;
    }
    return false;
}