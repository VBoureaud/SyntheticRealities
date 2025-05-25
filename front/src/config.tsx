const config = {
    imagesNumber: 25,
    totalPlayers: 1,
    playersHP: 100,
    AiHP: 100,
    hpChooseMax: 100,
    hpChooseMin: 10,
    timer: 10000,//10s in milliseconds
    isTimerFix: true,//answer needed before timer 0
    choices: [0, 1],
    maxCards: 10,
    voteTimerTolerance: 1000,
    //api: "http://127.0.0.1:3001/v1",
    api: "https://syntheticrealities-server.vercel.app/v1",
    online: true,
};

export const apiServer = {
    allGames: { url: config.api + "/game", method: "GET" },
    newGame: { url: config.api + "/game", method: "POST" },
    getGame: { url: config.api + "/game/", method: "GET" },
    updateGame: { url: config.api + "/game/", method: "PATCH" },
    allGamesScore: { url: config.api + "/game/score", method: "GET" },
    getCardDetail: { url: config.api + "/cards/get/", method: "GET" },
    getCard: { url: config.api + "/cards/get/", method: "GET" },
};

export default config;