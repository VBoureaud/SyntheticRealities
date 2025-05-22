import { Router } from 'express';
import cardController from '../../controllers/card.controller';
import validate from '../../middlewares/validate';
import cardValidation from '../../validations/card.validation';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Cards
 *   description: Card management endpoints
 */

/**
 * @swagger
 * /v1/cards/random:
 *   get:
 *     summary: Get a random card that hasn't been used
 *     tags: [Cards]
 *     responses:
 *       200:
 *         description: A random card
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       404:
 *         description: No more cards available
 */
// router
//   .route('/random')
//   .get(validate(cardValidation.getRandomCard), cardController.getRandomCard);

/**
 * @swagger
 * /v1/cards/init:
 *   post:
 *     summary: add cards in DB
 *     tags: [Cards]
 *     responses:
 *       201:
 *         description: The server response
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 *               example: true
 */
router
  .route('/init')
  .post(cardController.initCards);

/**
 * @swagger
 * /v1/cards/get/{partyName}:
 *   post:
 *     summary: Get a new card for the partyName
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: partyName
 *         required: true
 *         description: The name of the party
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentCards:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of card IDs that have already been used
 
 *     responses:
 *       200:
 *         description: A new card
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 */
router
  .route('/get/:partyName')
  .get(validate(cardValidation.getNewCard), cardController.getNewCard);

/**
 * @swagger
 * /v1/cards/get/{partyName}/{name}:
 *   get:
 *     summary: Get a card by name
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: partyName
 *         required: true
 *         description: The name of the party
 *         schema:
 *           type: string
 *       - in: path
 *         name: name
 *         required: true
 *         description: The name of the card
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The requested card
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       404:
 *         description: Card not found
 */
router
  .route('/get/:partyName/:name')
  .get(validate(cardValidation.getCardByName), cardController.getCardByName);

export default router; 