import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import useGameData from "./useGameData";

export interface GuessGameState {
  score: number;
  distance: number;
  isGameComplete: boolean;
  realCoordinates: { latitude: number; longitude: number };
}

const useGuessGame = () => {
  const { accessToken } = useAuth();
  const { gameId, imageId } = useGameData();
  const [gameState, setGameState] = useState<GuessGameState | null>(null);

  const submitGuess = useCallback(async (latitude: number, longitude: number) => {  
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.post(
        `${backendUrl}/api/game/guess`,
        {
          gameId,
          latitude,
          longitude,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("Backend Response:", response.data);

      const { score, distance, realCoordinates } = response.data;

      setGameState({
        score,
        distance,
        realCoordinates,
        isGameComplete: true,
      });
    } catch (error) {
      console.error("Error submitting guess:", error);
    }
  }, [accessToken, gameId]);

  return {
    gameState,
    submitGuess,
  };
};

export default useGuessGame;
