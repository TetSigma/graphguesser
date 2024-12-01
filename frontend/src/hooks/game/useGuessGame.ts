import { useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export interface GuessGameState {
  score: number;
  distance: number;
  isGameComplete: boolean;
  gameId?: string;
  imageId?: string;
}

export const useGuessGame = () => {
  const { accessToken } = useAuth();
  const [gameState, setGameState] = useState<GuessGameState | null>(null);

  const startNewGame = useCallback(async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.post(
        `${backendUrl}/api/game/start`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const { gameSession } = response.data;
      setGameState({
        score: 0,
        distance: 0,
        isGameComplete: false,
        gameId: gameSession.gameSessionId,
        imageId: gameSession.imageId,
      });
    } catch (error) {
      console.error("Error starting new game:", error);
    }
  }, [accessToken]);

  const submitGuess = useCallback(
    async (latitude: number, longitude: number) => {
      if (!gameState || !gameState.gameId) {
        alert("Game is not active. Please start a new game.");
        return;
      }

      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const response = await axios.post(
          `${backendUrl}/api/game/guess`,
          {
            gameId: gameState.gameId,
            latitude,
            longitude,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const { score, distance } = response.data;

        setGameState((prevState) => {
          if (!prevState) return null;
          return {
            ...prevState,
            score,
            distance,
            isGameComplete: distance < 1, 
          };
        });
      } catch (error) {
        console.error("Error submitting guess:", error);
      }
    },
    [gameState, accessToken]
  );

  return {
    gameState,
    startNewGame,
    submitGuess,
  };
};
