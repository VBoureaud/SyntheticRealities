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
    api: "http://127.0.0.1:3002/v1",
    //api: "https://whomadethis-server.vercel.app/v1",
    online: true,
};

export const apiServer = {
    newGame: { url: config.api + "/games", method: "POST" },
    getGame: { url: config.api + "/games/", method: "GET" },
    updateGame: { url: config.api + "/games/update/", method: "PATCH" },
    allGames: { url: config.api + "/games/all", method: "GET" },
    allGamesScore: { url: config.api + "/games/score", method: "GET" },
    getCardDetail: { url: config.api + "/card/info/", method: "GET" },
    getCard: { url: config.api + "/card/new/", method: "GET" },
};

export default config;