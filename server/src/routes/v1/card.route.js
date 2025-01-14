const express = require('express');
const validate = require('../../middlewares/validate');
const cardController = require('../../controllers/card.controller');
const cardValidation = require('../../validations/card.validation');
const router = express.Router();

router
    .route('/info/:partyName/:name')
    .get(validate(cardValidation.queryName), cardController.queryName);

router
    .route('/new/:partyName')
    .get(validate(cardValidation.getACard), cardController.getACard);

router
    .route('/add/initCards')
    .get(cardController.initCards);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Card
 *   description: Card Route
 */

/**
 * @swagger
 * /card/info/{partyName}/{name}:
 *   get:
 *     summary: Get details of a card if all players voted
 *     tags: [Card]
 *     parameters:
 *       - in: path
 *         name: partyName
 *         required: true
 *         schema:
 *           type: string
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
 *                $ref: '#/components/schemas/Card'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 * 
 */

/**
 * @swagger
 * /card/new/{partyName}:
 *   get:
 *     summary: Get new card and update the game in db
 *     tags: [Card]
 *     parameters:
 *       - in: path
 *         name: partyName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                type: string
 *                example: card_name_8
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 * 
 */

/**
 * @swagger
 * /card/add/initCards:
 *   get:
 *     summary: Debug root to add cards to test
 *     tags: [Card]
 *     responses:
 *       "200":
 *         description: Greeting 
 *
 */
