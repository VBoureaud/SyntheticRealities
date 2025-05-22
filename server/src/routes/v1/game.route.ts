import { Router } from 'express';
import gameController from '../../controllers/game.controller';
import validate from '../../middlewares/validate';
import gameValidation from '../../validations/game.validation';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Games
 *   description: Game management endpoints
 */

/**
 * @swagger
 * /v1/game:
 *   post:
 *     summary: Create a new game
 *     tags: [Games]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - players
 *               - AiHp
 *               - defaultPlayersHP
 *               - timer
 *               - isTimerFix
 *               - maxCards
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the game (will be automatically suffixed with #number if duplicate)
 *               players:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of player names
 *               AiHp:
 *                 type: number
 *                 description: Initial HP for AI
 *               defaultPlayersHP:
 *                 type: number
 *                 description: Initial HP for players
 *               timer:
 *                 type: number
 *                 description: Game timer duration
 *               isTimerFix:
 *                 type: boolean
 *                 description: Whether the timer is fixed
 *               maxCards:
 *                 type: number
 *                 description: Maximum number of cards in the game
 *     responses:
 *       201:
 *         description: Game created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       400:
 *         description: Invalid input
 *   get:
 *     summary: Get all games
 *     tags: [Games]
 *     responses:
 *       200:
 *         description: List of games
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Game'
 */
router
  .route('/')
  .post(validate(gameValidation.createGame), gameController.createGame)
  .get(gameController.getAllGames);

/**
 * @swagger
 * /v1/game/score:
 *   get:
 *     summary: Get game scores
 *     tags: [Games]
 *     responses:
 *       200:
 *         description: Game scores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   votes:
 *                     type: object
 *                   score:
 *                     type: number
 *                   scoreAi:
 *                     type: number
 */
router
  .route('/score')
  .get(gameController.getScoreGame);

/**
 * @swagger
 * /v1/game/{name}:
 *   get:
 *     summary: Get a game by name
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Game name
 *     responses:
 *       200:
 *         description: Game details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       404:
 *         description: Game not found
 *   patch:
 *     summary: Update a game by name
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Game name
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - playerName
 *               - vote
 *             properties:
 *               playerName:
 *                 type: string
 *                 description: Name of the player making the vote
 *               vote:
 *                 type: object
 *                 required:
 *                   - stepStart
 *                   - stepEnd
 *                   - choice
 *                   - hp
 *                 properties:
 *                   stepStart:
 *                     type: number
 *                     description: Start time of the vote
 *                   stepEnd:
 *                     type: number
 *                     description: End time of the vote
 *                   choice:
 *                     type: number
 *                     description: Player's choice
 *                   hp:
 *                     type: number
 *                     description: Player's HP after the vote
 *               cardId:
 *                  type: string
 *                  description: Name of card to add
 *     responses:
 *       200:
 *         description: Game updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       400:
 *         description: Invalid input or player not found in game
 *       404:
 *         description: Game not found
 *   delete:
 *     summary: Delete a game by name
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Game name
 *     responses:
 *       204:
 *         description: Game deleted successfully
 *       404:
 *         description: Game not found
 */
router
  .route('/:name')
  .get(validate(gameValidation.getGameByName), gameController.getGameByName)
  .patch(validate(gameValidation.updateGameByName), gameController.updateGameByName)
  .delete(validate(gameValidation.deleteGameByName), gameController.deleteGameByName);

export default router;
