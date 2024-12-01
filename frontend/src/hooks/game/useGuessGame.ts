import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import useGameData from "./useGameData";

export interface GuessGameState {
  score: number;
  distance: number;
  isGameComplete: boolean;
}

const useGuessGame = () => {
  const { accessToken } = useAuth();
  const { gameId, imageId } = useGameData();
  const [gameState, setGameState] = useState<GuessGameState | null>(null);

  // useCallback to memoize the submitGuess function
  const submitGuess = useCallback(async (latitude: number, longitude: number) => {
    if (!gameId) {
      alert("Game is not active. Please start a new game.");
      return;
    }
  
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

      console.log(response);

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
  }, [accessToken, gameId]);

  return {
    gameState,
    submitGuess,
  };
};

export default useGuessGame;
