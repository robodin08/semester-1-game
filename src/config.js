export default {
    port: 3000,
    game: {
        difficulties: {
            easy: { color: "bg-emerald-400", cards: 4 },
            normal: { color: "bg-sky-500", cards: 16 },
            hard: { color: "bg-rose-500", cards: 30 },
            extreme: { color: "bg-purple-900", cards: 52 },
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
    },
    sessions: {
        expire: 30 * 60 * 1000, // expire session after Xms of inactivity
        delay: 5 * 1000, // check sessions after each Xms
    },
    errorMessages: {
        "default": "Something Went Wrong",

        400: "Bad Request",
        401: "Unauthorized",
        403: "Forbidden",
        404: "Page not found",
        405: "Method Not Allowed",
        409: "Conflict",
        422: "Unprocessable Entity",
        429: "Too Many Requests",
        500: "Internal Server Error",
        502: "Bad Gateway",
        503: "Service Unavailable",
        504: "Gateway Timeout"
    },
}