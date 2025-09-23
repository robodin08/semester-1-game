import crypto from "node:crypto";
import createError from "./error.js";

function createUUID() {
  return crypto.randomUUID().replace(/-/g, "");
}

function createShortUUID() {
  return createUUID().slice(0, 10);
}

class GameManager {
  constructor() {
    this.games = new Map(); // gameId -> game object
    this.users = new Map(); // userId -> { gameId, gameUserId }
  }

  createGame(game = {}, users = 1) {
    const gameId = createShortUUID();

    game._maxUsers = users;
    game._freeSlots = new Set([...Array(game._maxUsers).keys()]);
    game._users = 0;
    game._expired = false;

    game.expire = () => {
      game._expired = true;
      this.games.delete(gameId);
    };

    game.addUser = () => {
      if (game._users >= game._maxUsers) {
        throw createError(403, "Game is full.");
      }
      const [gameUserId] = game._freeSlots;
      game._freeSlots.delete(gameUserId);

      const userId = createUUID();
      this.users.set(userId, { gameId, gameUserId, isConnected: false });
      game._users++;
      return [userId, gameUserId];
    };

    game.deleteUser = (userId) => {
      const user = this.users.get(userId);
      if (!user) {
        throw createError(404, "User not found in this game.");
      }

      game._freeSlots.add(user.gameUserId);

      this.users.delete(userId);
      game._users--;

      return userId;
    };

    this.games.set(gameId, game);
    return gameId;
  }

  setUserConnected(userId) {
    const entry = this.users.get(userId);
    if (!entry) return null;
    if (entry.isConnected) return false;
    entry.isConnected = true;
    return true;
  }

  getGame(gameId) {
    return this.games.get(gameId) || null;
  }

  getGameFromUser(userId) {
    const entry = this.users.get(userId);
    return entry ? this.getGame(entry.gameId) : null;
  }

  getGameIdFromUser(userId) {
    const entry = this.users.get(userId);
    return entry ? entry.gameId : null;
  }

  getGameUserId(userId) {
    const entry = this.users.get(userId);
    return entry ? entry.gameUserId : null;
  }

  // getUserIdFromGameUser(gameId, gameUserId) {
  //   for (const [userId, entry] of this.users.entries()) {
  //     if (entry.gameId === gameId && entry.gameUserId === gameUserId) {
  //       return userId;
  //     }
  //   }
  //   return null;
  // }
}

export default new GameManager();
