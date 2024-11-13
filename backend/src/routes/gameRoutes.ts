import { Router } from "express";
import {
  startGame,
  submitGuess,
  getGameResults,
} from "../controllers/gameController";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.post("/start", authMiddleware, startGame);

router.post("/guess", authMiddleware, submitGuess);

router.get("/results", authMiddleware, getGameResults);

export default router;
