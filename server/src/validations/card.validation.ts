import Joi from 'joi';
import { objectId } from './custom.validation';

const createCard = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    isHuman: Joi.boolean().required(),
    isAI: Joi.boolean().required(),
    original_name: Joi.string().required(),
  }),
};

const getAllCards = {
  params: Joi.object().keys({
    partyName: Joi.string().required(),
  }),
};

const getCardByName = {
  params: Joi.object().keys({
    partyName: Joi.string().required(),
    name: Joi.string().required(),
  }),
};

const getNewCard = {
  // body: Joi.object().keys({
  //   currentCards: Joi.array().items(Joi.string().custom(objectId)),
  // })
};

const getRandomCard = {};

export default {
  createCard,
  getAllCards,
  getCardByName,
  getNewCard,
  getRandomCard,
}; 