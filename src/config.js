export default {
  port: 3000,
  game: {
    difficulties: {
      easy: { color: "bg-emerald-400", cards: 4 },
      normal: { color: "bg-sky-500", cards: 16 },
      hard: { color: "bg-rose-500", cards: 30 },
      extreme: { color: "bg-purple-900", cards: 40 },
    },
    themes: {
      animals: { color: "bg-emerald-400", items: 30 },
      faces: { color: "bg-sky-400", items: 30 },
      food: { color: "bg-amber-400", items: 30 },
      objects: { color: "bg-violet-500", items: 30 },
      plants: { color: "bg-lime-400", items: 30 },
      symbols: { color: "bg-pink-400", items: 30 },
      vehicles: { color: "bg-orange-400", items: 30 },
      activities: { color: "bg-indigo-500", items: 30 },
    },
  }
};
