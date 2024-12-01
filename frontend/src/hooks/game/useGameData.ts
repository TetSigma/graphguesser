import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

// Singleton variable to track if the data has already been fetched
let hasFetchedOnce = false;

interface UseGameDataReturn {
  imageId: string | null;
  gameStarted: boolean;
  gameId: string | null;
  isLoading: boolean;
  error: string | null;
  fetchGameData: () => void;
}

const useGameData = (): UseGameDataReturn => {
  const [imageId, setImageId] = useState<string | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useAuth();

  const fetchGameData = useCallback(async () => {
    if (isLoading || gameStarted || hasFetchedOnce) return; // Guard conditions to prevent multiple calls

    setIsLoading(true);
    setError(null);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.post(
        `${backendUrl}/api/game/start`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("Game data response:", response);

      if (!response || !response.data) throw new Error("Failed to start game");

      const gameData = response.data;
      const { imageId, gameSessionId } = gameData.gameSession;
      setImageId(imageId);
      setGameId(gameSessionId);
      setGameStarted(true);
      hasFetchedOnce = true; 
    } catch (err) {
      setError(
        (err as Error)?.message || "An unexpected error occurred while fetching game data."
      );
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, gameStarted, isLoading]);

  useEffect(() => {
    if (accessToken && !gameStarted && !hasFetchedOnce) {
      console.log("Fetching game data...");
      fetchGameData();
    }
  }, [accessToken, gameStarted, fetchGameData]);

  return { imageId, gameStarted, gameId, isLoading, error, fetchGameData };
};

export default useGameData;
