const express = require('express');
const validate = require('../../middlewares/validate');
const gamesValidation = require('../../validations/games.validation');
const gamesController = require('../../controllers/games.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(gamesValidation.addOne), gamesController.addOne);

router
  .route('/all')
  .get(gamesController.allGames);

router
  .route('/score')
  .get(gamesController.scoreGame);

router
  .route('/:name')
  .get(validate(gamesValidation.getGame), gamesController.getGame);

router
  .route('/update/:name')
  .patch(validate(gamesValidation.updateOne), gamesController.updateOne);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: games
 *   description: Manage games of CardGame
 */

/**
 * @swagger
 * /games:
 *   post:
 *    summary: Add One
 *    description: Add an game
 *    tags: [Games]
 *    requestBody:
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
 *               - maxCards
 *             properties:
 *               name:
 *                 type: string
 *               players:
 *                 type: [string]
 *                 description: list of players
 *               AiHp:
 *                 type: number
 *                 description: default HP for AI
 *               defaultPlayersHP:
 *                 type: number
 *                 description: default HP for players
 *               timer:
 *                 type: number
 *                 description: default timer for each step
 *               cards:
 *                 type: [string]
 *                 description: list of cards 
 *               maxCards:
 *                 type: number
 *                 description: max amount of step
 *             example:
 *               name: 'player-test'
 *               players: ['player-test']
 *               AiHp: 100
 *               defaultPlayersHP: 100
 *               timer: 20
 *               maxCards: 5
 *    responses: 
 *      "200":
 *        description: Ok
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/Game'
 *      "400":
 *        $ref: '#/components/responses/DuplicateGame'
 *      "401":
 *        $ref: '#/components/responses/Unauthorized'
 *      "403":
 *        $ref: '#/components/responses/Forbidden'
 *
 */

/**
* @swagger
* /games/{name}:
*   get:
*     summary: Get a game
*     description: Get informations for one game.
*     tags: [Games]
*     parameters:
*       - in: path
*         name: name
*         required: true
*         schema:
*           type: string
*     responses:
*       "200":
*         description: OK
*         content:
*           application/json:
*             schema:
*                $ref: '#/components/schemas/Game'
*       "401":
*         $ref: '#/components/responses/Unauthorized'
*       "403":
*         $ref: '#/components/responses/Forbidden'
*/


/**
* @swagger
* /games/update/{name}:
*   patch:
*     summary: Update a game
*     description: Update a game.
*     tags: [Games]
*     parameters:
*       - in: path
*         name: name
*         required: true
*         schema:
*           type: string
*         description: Name of the game
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               votes:
*                 type: Object
*             example:
*               votes: {playerName: 'player-test', stepStart: 1000, stepEnd: 2000, choice: 1, hp: 30 }
*     responses:
*       "200":
*         description: OK
*         content:
*           application/json:
*             schema:
*                $ref: '#/components/schemas/Game'
*       "400":
*         $ref: '#/components/responses/DuplicateGame'
*       "401":
*         $ref: '#/components/responses/Unauthorized'
*       "403":
*         $ref: '#/components/responses/Forbidden'
*       "404":
*         $ref: '#/components/responses/NotFound'
*
*/


/**
 * @swagger
 * /games/all:
 *   get:
 *     summary: get all
 *     description: full list of games
 *     tags: [Games]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                type: array
 *                items:
 *                  oneOf:
 *                    - $ref: '#/components/schemas/Game'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 */

/**
 * @swagger
 * /games/score:
 *   get:
 *     summary: get score game
 *     description: score for all the game
 *     tags: [Games]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                type: array
 *                items:
 *                  oneOf:
 *                    - $ref: '#/components/schemas/Game'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 */
