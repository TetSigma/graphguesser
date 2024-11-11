import { AuthenticatedRequest } from '../types/AuthenticatedRequest';
import { Response } from 'express';
import gameService from '../services/gameService';

// Start a new game session
export const startGame = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const gameSession = await gameService.startNewGame(userId);
    res.status(201).json(gameSession);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Get a random location for the player to guess
export const getRandomLocation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    console.log('User ID:', req.user?.id);
    const location = await gameService.getRandomLocation();
    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Submit a guess and receive feedback
export const submitGuess = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { gameId, latitude, longitude } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const feedback = await gameService.evaluateGuess(gameId, userId, latitude, longitude);
    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Get the final results for the completed game
export const getGameResults = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { gameId } = req.query;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const results = await gameService.getGameResults(gameId as string, userId);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
