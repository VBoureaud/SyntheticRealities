const Joi = require('joi');
const { objectId } = require('./custom.validation');

const addOne = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    players: Joi.array().required(),
    AiHp: Joi.number().required(),
    defaultPlayersHP: Joi.number().required(),
    timer: Joi.number().required(),
    isTimerFix: Joi.boolean().required(),
    maxCards: Joi.number().required(),
  }),
};
const getGame = {
  params: Joi.object().keys({
    name: Joi.string().required(),
  }),
};
const updateOne = {
  params: Joi.object().keys({
    name: Joi.string(),
  }),
  body: Joi.object()
    .keys({
      votes: Joi.object().keys({
        playerName: Joi.string(),
        stepStart: Joi.number().integer(),
        stepEnd: Joi.number().integer(),
        choice: Joi.number().integer(),
        hp: Joi.number().integer(),
      })
    })
    .min(1),
};

const allGames = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  addOne,
  getGame,
  updateOne,
  allGames,
};