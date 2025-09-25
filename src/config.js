export default {
  port: 3000,
  game: {
    difficulties: {
      easy: { color: "bg-green-400 hover:bg-green-300", cards: 4, botIq: .4 },
      normal: { color: "bg-blue-500 hover:bg-blue-400", cards: 16, botIq: .6 },
      hard: { color: "bg-red-500 hover:bg-red-400", cards: 30, botIq: .65 },
      extreme: { color: "bg-purple-800 hover:bg-purple-700", cards: 40, botIq: .75 }
    },
    themes: {
      animals: { color: "bg-teal-400 hover:bg-teal-300", items: 30 },
      faces: { color: "bg-cyan-400 hover:bg-cyan-300", items: 30 },
      food: { color: "bg-rose-400 hover:bg-rose-300", items: 30 },
      objects: { color: "bg-violet-500 hover:bg-violet-400", items: 30 },
      plants: { color: "bg-green-500 hover:bg-green-400", items: 30 },
      symbols: { color: "bg-fuchsia-400 hover:bg-fuchsia-300", items: 30 },
      vehicles: { color: "bg-orange-500 hover:bg-orange-400", items: 30 },
      activities: { color: "bg-indigo-500 hover:bg-indigo-400", items: 30 }
    }
  },

  //   game: {
  //   difficulties: {
  //     easy: { color: "bg-", cards: 4 },
  //     normal: { color: "bg-", cards: 16 },
  //     hard: { color: "bg-", cards: 30 },
  //     extreme: { color: "bg-", cards: 40 },
  //   },
  //   themes: {
  //     animals: { color: "bg-", items: 30 },
  //     faces: { color: "bg-", items: 30 },
  //     food: { color: "bg-", items: 30 },
  //     objects: { color: "bg-", items: 30 },
  //     plants: { color: "bg-", items: 30 },
  //     symbols: { color: "bg-", items: 30 },
  //     vehicles: { color: "bg-", items: 30 },
  //     activities: { color: "bg-", items: 30 },
  //   },
  // },

  credits: {
    css_framework: "https://tailwindcss.com",
    background_image:
      "https://www.freepik.com/free-vector/gradient-abstract-wireframe-background_15517704.htm",
    theme_icons: "https://github.com/twitter/twemoji",
    favicon:
      "https://fonts.google.com/icons?selected=Material+Symbols+Outlined:brick",
    language_images: "https://www.npmjs.com/package/flag-icons",
    sounds: "https://pixabay.com",
  },
};
