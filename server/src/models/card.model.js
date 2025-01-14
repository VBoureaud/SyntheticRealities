const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const cardSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  isHuman: {
    type: Boolean,
    required: true,
  },
  isAI: {
    type: Boolean,
    required: true,
  },
},
);

// add plugin that converts mongoose to json
cardSchema.plugin(toJSON);
cardSchema.plugin(paginate);

/**
 * @typedef Card
 */
const Card = mongoose.model('Card', cardSchema);

module.exports = Card;
