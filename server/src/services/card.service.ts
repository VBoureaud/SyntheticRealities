import mongoose from 'mongoose';
import httpStatus from 'http-status';
import { Card, ICard } from '../models/card.model';
import ApiError from '../utils/ApiError';

/**
 * Query card by name
 * @param {string} name
 * @returns {Promise<ICard>}
 */
const queryCardByName = async (name: string): Promise<ICard> => {
  const card = await Card.findOne({ name });
  if (!card) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Card not found');
  }
  return card;
};

/**
 * Get new card
 * @param {string[]} currentCards
 * @returns {Promise<ICard>}
 */
const getNewCard = async (currentCards: string[]): Promise<ICard> => {
  return await getRandomCard(currentCards);
};

/**
 * Get random card
 * @param {string[]} currentCards
 * @returns {Promise<ICard>}
 */
const getRandomCard = async (currentCards: string[]): Promise<ICard> => {
  // Get all cards that are not in currentCards
  const availableCards = await Card.find({ name: { $nin: currentCards } });
  
  if (availableCards.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No more cards available');
  }

  // Randomly select a card from available cards
  const randomIndex = Math.floor(Math.random() * availableCards.length);
  return availableCards[randomIndex];
};

/**
 * Get all cards
 * @returns {Promise<ICard[]>}
 */
const getAllCards = async (): Promise<ICard[]> => {
  const cards = await Card.find();
  return cards;
};

/**
 * Create a card
 * @param {Object} cardBody
 * @returns {Promise<ICard>}
 */
const createCard = async (cardBody: Partial<ICard>): Promise<ICard> => {
  const card = await Card.create(cardBody);
  return card;
};

/**
 * Initialize cards
 * @returns {Promise<boolean>}
 */
const initCards = async (): Promise<boolean> => {
  try {
    const cardsToUpdate = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    
    // Use bulkWrite with ordered: false to handle duplicates gracefully
    const cards = await Card.bulkWrite(
      cardsToUpdate.map(name => ({
        updateOne: {
          filter: { name },
          update: {
            $setOnInsert: {
              name,
              original_name: name,
              isHuman: false,
              isAI: true,
            }
          },
          upsert: true
        }
      })),
      { ordered: false }
    );

    return true;
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key error
      throw new ApiError(httpStatus.CONFLICT, 'Card already exists');
    }
    throw error;
  }
}

export default {
  queryCardByName,
  getRandomCard,
  getNewCard,
  getAllCards,
  createCard,
  initCards,
};
