import Joi from 'joi';
import { objectId } from './custom.validation';

const createGame = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    players: Joi.array().items(Joi.string()).required(),
    AiHp: Joi.number().required(),
    defaultPlayersHP: Joi.number().required(),
    timer: Joi.number().required(),
    isTimerFix: Joi.boolean().required(),
    maxCards: Joi.number().required(),
  }),
};

const getGameByName = {
  params: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

const updateGameByName = {
  params: Joi.object().keys({
    name: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      playerName: Joi.string().required(),
      vote: Joi.object({
        stepStart: Joi.number().integer().required(),
        stepEnd: Joi.number().integer().required(),
        choice: Joi.number().integer().required(),
        hp: Joi.number().integer().required(),
      }),
      cardId: Joi.string(),
    })
    .min(1)
    .custom((obj, helpers) => {
      // Ensure either vote or cardId is present
      if (!obj.vote && !obj.cardId) {
        return helpers.error('any.custom', { message: 'Either vote or cardId must be provided' });
      }
      // Ensure not both vote and cardId are present
      if (obj.vote && obj.cardId) {
        return helpers.error('any.custom', { message: 'Cannot provide both vote and cardId' });
      }
      return obj;
    }, 'validate-update-type'),
};

const deleteGameByName = {
  params: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

export default {
  createGame,
  getGameByName,
  updateGameByName,
  deleteGameByName,
};

