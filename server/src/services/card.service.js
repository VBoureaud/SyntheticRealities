const { randomInt } = require('../utils');
const { Card } = require('../models');

/**
 * Query Name
 * @param {string} name - Name of Card
 * @returns {Promise<QueryResult>}
*/
const queryName = async (name) => {
  const card = await Card.find({ name });
  return card;
};

/**
 * Get a new card
 * @param {Array} currentCards - array of cards to don't select
 * @returns {Promise<QueryResult>}
 */
const getACard = async (currentCards) => {
  const cards = await Card.find({});
  let newId = randomInt(0, cards.length - 1);

  if (currentCards.indexOf(cards[newId].name) !== -1 && cards.length > currentCards.length) {
    while (currentCards.indexOf(cards[newId].name) !== -1)
      newId = randomInt(0, cards.length - 1);
  }

  return cards[newId];
};

const initCards = async () => {
  const cardsToUpdate = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  for (let i = 0; i < cardsToUpdate.length; i++) {
    const newCard = await Card.create({
      name: cardsToUpdate[i],
      isHuman: false,
      isAI: true,
    });
  }
}

module.exports = {
  queryName,
  getACard,
  initCards,
};
