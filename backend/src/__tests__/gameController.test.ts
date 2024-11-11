import { Request, Response } from 'express';
import { startGame, getRandomLocation, submitGuess, getGameResults } from '../controllers/gameController';
import gameService from '../services/gameService';

jest.mock('../services/gameService');  // Mock the gameService

describe('Game Controller', () => {

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  const req = {
    user: { id: '1' },  // Mock authenticated user
    body: { gameId: '1', latitude: 50.0, longitude: 50.0 },
    query: { gameId: '1' },
  } as unknown as Request;

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('startGame', () => {
    it('should start a new game', async () => {
      const gameSession = { id: '1', score: 0 };  // Mocked game session
      (gameService.startNewGame as jest.Mock).mockResolvedValue(gameSession);

      await startGame(req, res);

      expect(gameService.startNewGame).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(gameSession);
    });

    it('should return error if starting game fails', async () => {
      (gameService.startNewGame as jest.Mock).mockRejectedValue(new Error('Failed to start game'));

      await startGame(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to start game' });
    });
  });

  describe('getRandomLocation', () => {
    it('should return a random location', async () => {
      const location = { id: '1', latitude: 50.0, longitude: 50.0 };  // Mocked location
      (gameService.getRandomLocation as jest.Mock).mockResolvedValue(location);

      await getRandomLocation(res);

      expect(gameService.getRandomLocation).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(location);
    });

    it('should return error if getting location fails', async () => {
      (gameService.getRandomLocation as jest.Mock).mockRejectedValue(new Error('Failed to get location'));

      await getRandomLocation(res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to get location' });
    });
  });

  describe('submitGuess', () => {
    it('should return score and distance when the guess is submitted successfully', async () => {
      const feedback = { score: 80, distance: 1000 };  // Mock feedback
      (gameService.evaluateGuess as jest.Mock).mockResolvedValue(feedback);

      await submitGuess(req, res);

      expect(gameService.evaluateGuess).toHaveBeenCalledWith('1', '1', 50.0, 50.0);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(feedback);
    });

    it('should return error if evaluateGuess fails', async () => {
      const errorMessage = 'Error evaluating guess';
      (gameService.evaluateGuess as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await submitGuess(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });

    it('should return unauthorized error if user is not authenticated', async () => {
      const reqWithoutUser = { body: { gameId: '1', latitude: 50.0, longitude: 50.0 } } as Request;

      await submitGuess(reqWithoutUser, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });
    });

  describe('getGameResults', () => {
    it('should return game results successfully', async () => {
      const gameResults = { id: '1', score: 100, is_complete: true };  // Mock game results
      (gameService.getGameResults as jest.Mock).mockResolvedValue(gameResults);

      await getGameResults(req, res);

      expect(gameService.getGameResults).toHaveBeenCalledWith('1', '1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(gameResults);
    });

    it('should return error if getGameResults fails', async () => {
      const errorMessage = 'Error fetching game results';
      (gameService.getGameResults as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await getGameResults(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });

    it('should return unauthorized error if user is not authenticated', async () => {
      const reqWithoutUser = { query: { gameId: '1' } } as unknown as Request;

      await getGameResults(reqWithoutUser, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });
  });
});
