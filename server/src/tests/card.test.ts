import request from 'supertest';
import app from './utils/test_app';
import { Card } from '../models/card.model';
import { Game } from '../models/game.model';
import httpStatus from 'http-status';
import { setupTestDB } from './utils/setupTestDB';

setupTestDB();

describe('Card routes', () => {
  let testCard: any;
  let testGame: any;
  let createdGame: any;

  beforeEach(async () => {
    await Card.deleteMany({});
    await Game.deleteMany({});
    
    testCard = {
      name: 'TestCard',
      isHuman: true,
      isAI: false,
      original_name: 'Test Card',
    };

    testGame = {
      name: 'TestGame',
      players: ['Player1'],
      AiHp: 100,
      defaultPlayersHP: 50,
      timer: 60,
      isTimerFix: true,
      maxCards: 10,
    };

    // Create a game before each test
    createdGame = await Game.create(testGame);
  });

  describe('POST /v1/cards/init', () => {
    test('should initialize cards in DB', async () => {
      const res = await request(app).post('/v1/cards/init').send({});
      expect(res.status).toBe(httpStatus.OK);
      expect(res.body.success).toBe(true);
    });
  });

  describe('GET /v1/cards/get/:partyName', () => {
    test('should return a random card for the party', async () => {
      // Create multiple cards
      const cards = await Card.insertMany([
        {
          name: 'Card_1',
          isHuman: true,
          isAI: false,
          original_name: 'Original Card 1',
        },
        {
          name: 'Card_2',
          isHuman: false,
          isAI: true,
          original_name: 'Original Card 2',
        },
        {
          name: 'Card_3',
          isHuman: true,
          isAI: false,
          original_name: 'Original Card 3',
        },
      ]);

      // Get a random card using the created game's name
      const res = await request(app).get(`/v1/cards/get/${createdGame.name}`);
      expect(res.status).toBe(httpStatus.OK);
      
      // Verify the returned card is one of the created cards
      const cardNames = cards.map(card => card.name);
      expect(cardNames).toContain(res.body.newCard);

      // Verify the card is added to the game
      const updatedGame = await Game.findOne({ name: createdGame.name });
      expect(updatedGame?.cards).toContain(res.body.newCard);
    });

    test('should return different cards on subsequent calls', async () => {
      // Create multiple cards
      const cards = await Card.insertMany([
        {
          name: 'Card_1',
          isHuman: true,
          isAI: false,
          original_name: 'Original Card 1',
        },
        {
          name: 'Card_2',
          isHuman: false,
          isAI: true,
          original_name: 'Original Card 2',
        },
      ]);

      // Get two random cards using the created game's name
      const res1 = await request(app).get(`/v1/cards/get/${createdGame.name}`);

      // Add vote to the current party to be able to get new card
      createdGame.votes.push({
        playerName: createdGame.players[0],
        stepStart: 0,
        stepEnd: 10,
        choice: 1,
        hp: 100
      });
      await createdGame.save();
      const res2 = await request(app).get(`/v1/cards/get/${createdGame.name}`);

      expect(res1.status).toBe(httpStatus.OK);
      expect(res2.status).toBe(httpStatus.OK);
      
      // While it's possible to get the same card twice, it's unlikely with multiple cards
      // This test might occasionally fail due to randomness, but that's acceptable
      if (cards.length > 1) {
        expect(res1.body.newCard).not.toBe(res2.body.newCard);
      }
    });

    test('should return 404 if no cards available', async () => {
      const res = await request(app).get(`/v1/cards/get/${createdGame.name}`);
      expect(res.status).toBe(httpStatus.NOT_FOUND);
      expect(res.body.message).toBe('No more cards available');
    });

    test('should not return cards already used in the game', async () => {
      // Create multiple cards
      const cards = await Card.insertMany([
        {
          name: 'Card_1',
          isHuman: true,
          isAI: false,
          original_name: 'Original Card 1',
        },
        {
          name: 'Card_2',
          isHuman: false,
          isAI: true,
          original_name: 'Original Card 2',
        },
      ]);

      // Add first card to game
      createdGame.cards.push(cards[0].name);
      await createdGame.save();

      // Add vote to the current party to be able to get new card
      createdGame.votes.push({
        playerName: createdGame.players[0],
        stepStart: 0,
        stepEnd: 10,
        choice: 1,
        hp: 100
      });
      await createdGame.save();

      // Get a random card for the game
      const res = await request(app).get(`/v1/cards/get/${createdGame.name}`);
      expect(res.status).toBe(httpStatus.OK);
      
      // Verify the returned card is not the one already used
      expect(res.body.newCard).not.toBe(cards[0].name);
      expect(res.body.newCard).toBe(cards[1].name);
    });
  });

  describe('GET /v1/cards/get/:partyName/:name', () => {
    test('should return card by party name and card name', async () => {
      const card = await Card.create({
        name: 'Test_Card',
        isHuman: true,
        isAI: false,
        original_name: 'Original Test Card',
      });

      // Add card to game
      createdGame.cards.push(card.name);
      await createdGame.save();

      // Add vote to the current party to be able to get new card
      createdGame.votes.push({
        playerName: createdGame.players[0],
        stepStart: 0,
        stepEnd: 10,
        choice: 1,
        hp: 100
      });
      await createdGame.save();

      const res = await request(app).get(`/v1/cards/get/${createdGame.name}/${card.name}`);
      expect(res.status).toBe(httpStatus.OK);
      expect(res.body).toHaveProperty('name', card.name);
      expect(res.body).toHaveProperty('isHuman', card.isHuman);
      expect(res.body).toHaveProperty('isAI', card.isAI);
      expect(res.body).toHaveProperty('original_name', card.original_name);
    });

    test('should return 500 if card not in party', async () => {
      const res = await request(app).get(`/v1/cards/get/${createdGame.name}/nonexistent`);
      expect(res.status).toBe(httpStatus.BAD_REQUEST);
      expect(res.body.message).toBe('Game doesnt have this card yet.');
    });

    test('should return 404 if card not found', async () => {
      const cardName = 'nonexistent';
      // Add card to game
      createdGame.cards.push(cardName);
      await createdGame.save();

      // Add vote to the current party to be able to get new card
      createdGame.votes.push({
        playerName: createdGame.players[0],
        stepStart: 0,
        stepEnd: 10,
        choice: 1,
        hp: 100
      });
      await createdGame.save();

      const res = await request(app).get(`/v1/cards/get/${createdGame.name}/${cardName}`);
      expect(res.status).toBe(httpStatus.NOT_FOUND);
      expect(res.body.message).toBe('Card not found');
    });
  });
});
