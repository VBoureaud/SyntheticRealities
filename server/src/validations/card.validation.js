const Joi = require('joi');

const queryName = {
  params: Joi.object().keys({
    partyName: Joi.string().required(),
    name: Joi.string().required(),
  }),
};

const getACard = {
  params: Joi.object().keys({
    partyName: Joi.string().required(),
  }),
};

module.exports = {
  queryName,
  getACard,
}