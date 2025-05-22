import request from 'supertest';
import app from './utils/test_app';
import { Game } from '../models/game.model';
import httpStatus from 'http-status';
import { setupTestDB } from './utils/setupTestDB';

setupTestDB();

describe('Game routes', () => {
  let testGame: any;

  beforeEach(async () => {
    await Game.deleteMany({});
    testGame = {
      name: 'TestGame',
      players: ['player1', 'player2'],
      AiHp: 100,
      defaultPlayersHP: 100,
      timer: 60,
      isTimerFix: true,
      maxCards: 10,
    };
  });

  describe('POST /v1/game', () => {
    test('should create a new game with auto-incremented name', async () => {
      const res = await request(app).post('/v1/game').send(testGame);
      expect(res.status).toBe(httpStatus.CREATED);
      expect(res.body.name).toMatch(/^TestGame#\d+$/);
      expect(res.body).toEqual(expect.objectContaining({
        ...testGame,
        name: expect.stringMatching(/^TestGame#\d+$/),
        votes: [],
        cards: [],
      }));
    });

    test('should return 400 if required fields are missing', async () => {
      const { name, ...gameWithoutName } = testGame;
      const res = await request(app).post('/v1/game').send(gameWithoutName);
      expect(res.status).toBe(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/game', () => {
    test('should return all games', async () => {
      const game = await Game.create({
        ...testGame,
        name: 'TestGame#1'
      });
      const res = await request(app).get('/v1/game');
      expect(res.status).toBe(httpStatus.OK);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body).toHaveLength(1);
      expect(res.body[0]).toEqual(expect.objectContaining({
        name: game.name,
        players: game.players,
        AiHp: game.AiHp,
        defaultPlayersHP: game.defaultPlayersHP,
      }));
    });
  });

  describe('GET /v1/game/:name', () => {
    test('should return game by name', async () => {
      // First create a game through the API
      const createRes = await request(app)
        .post('/v1/game')
        .send(testGame)
        .expect(httpStatus.CREATED);

      const gameName = createRes.body.name;
      expect(gameName).toBeDefined();
      expect(gameName).toMatch(/^TestGame#\d+$/);

      // Then try to get it by name
      const getRes = await request(app)
        .get(`/v1/game/${encodeURIComponent(gameName)}`)
        .expect(httpStatus.OK);

      expect(getRes.body).toBeDefined();
      expect(getRes.body).toEqual(expect.objectContaining({
        name: gameName,
        players: testGame.players,
        AiHp: testGame.AiHp,
        defaultPlayersHP: testGame.defaultPlayersHP,
        votes: [],
        cards: [],
      }));
    });

    test('should return 404 if game not found', async () => {
      const res = await request(app)
        .get('/v1/game/nonexistent')
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /v1/game/:name', () => {
    test('should update game with vote', async () => {
      // First create a game through the API
      const createRes = await request(app)
        .post('/v1/game')
        .send(testGame)
        .expect(httpStatus.CREATED);

      const gameName = createRes.body.name;
      expect(gameName).toBeDefined();

      const data = {
        playerName: 'player1',
        vote: {
          stepStart: 0,
          stepEnd: 10,
          choice: 1,
          hp: 100
        }
      };

      const res = await request(app)
        .patch(`/v1/game/${encodeURIComponent(gameName)}`)
        .send(data)
        .expect(httpStatus.OK);

      expect(res.body.votes).toHaveLength(1);
      expect(res.body.votes[0]).toEqual(expect.objectContaining({
        playerName: data.playerName,
        stepStart: data.vote.stepStart,
        stepEnd: data.vote.stepEnd,
        choice: data.vote.choice,
        hp: data.vote.hp
      }));
    });

    test('should update game with card', async () => {
      // First create a game through the API
      const createRes = await request(app)
        .post('/v1/game')
        .send(testGame)
        .expect(httpStatus.CREATED);

      const gameName = createRes.body.name;
      expect(gameName).toBeDefined();

      const cardUpdate = {
        playerName: 'player1',
        cardId: 'card1'
      };

      const res = await request(app)
        .patch(`/v1/game/${encodeURIComponent(gameName)}`)
        .send(cardUpdate)
        .expect(httpStatus.OK);

      expect(res.body.cards).toHaveLength(1);
      expect(res.body.cards[0]).toBe(cardUpdate.cardId);
    });

    test('should return 400 if player not in game', async () => {
      // First create a game through the API
      const createRes = await request(app)
        .post('/v1/game')
        .send(testGame)
        .expect(httpStatus.CREATED);

      const gameName = createRes.body.name;
      expect(gameName).toBeDefined();

      const vote = {
        playerName: 'nonexistentPlayer',
        vote: {
          stepStart: 0,
          stepEnd: 10,
          choice: 1,
          hp: 100
        }
      };

      const res = await request(app)
        .patch(`/v1/game/${encodeURIComponent(gameName)}`)
        .send(vote)
        .expect(httpStatus.BAD_REQUEST);

      expect(res.body.message).toBe('Player not found in game');
    });

    test('should return 404 if game not found', async () => {
      const vote = {
        playerName: 'player1',
        vote: {
          stepStart: 0,
          stepEnd: 10,
          choice: 1,
          hp: 100
        }
      };

      const res = await request(app)
        .patch('/v1/game/nonexistent')
        .send(vote)
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /v1/game/:name', () => {
    test('should delete game by name', async () => {
      // First create a game through the API
      const createRes = await request(app)
        .post('/v1/game')
        .send(testGame)
        .expect(httpStatus.CREATED);

      const gameName = createRes.body.name;
      expect(gameName).toBeDefined();

      const res = await request(app)
        .delete(`/v1/game/${encodeURIComponent(gameName)}`)
        .expect(httpStatus.NO_CONTENT);

      const deletedGame = await Game.findOne({ name: gameName });
      expect(deletedGame).toBeNull();
    });

    test('should return 404 if game not found', async () => {
      const res = await request(app)
        .delete('/v1/game/nonexistent')
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('GET /v1/game/score', () => {
    test('should return game scores', async () => {
      // First create a game through the API
      const createRes = await request(app)
        .post('/v1/game')
        .send({...testGame, maxCards: 0, AiHp: 0})
        .expect(httpStatus.CREATED);

      const gameName = createRes.body.name;
      expect(gameName).toBeDefined();

      const res = await request(app)
        .get('/v1/game/score')
        .expect(httpStatus.OK);

      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body[0]).toEqual(expect.objectContaining({
        name: gameName,
        votes: expect.any(Object),
        score: expect.any(Number),
        scoreAi: expect.any(Number)
      }));
    });

    test('should return empty array when no games exist', async () => {
      const res = await request(app)
        .get('/v1/game/score')
        .expect(httpStatus.OK);

      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body).toHaveLength(0);
    });
  });
});
