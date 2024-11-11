import { Router } from 'express';
import { startGame, getRandomLocation, submitGuess, getGameResults } from '../controllers/gameController';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

router.post('/start', authMiddleware, startGame);

router.get('/location', authMiddleware, getRandomLocation);

router.post('/guess', authMiddleware, submitGuess);

router.get('/results', authMiddleware, getGameResults);

export default router;
