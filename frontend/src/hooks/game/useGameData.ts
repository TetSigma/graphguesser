import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

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
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false); // State-based flag
  const { accessToken } = useAuth();

  const fetchGameData = useCallback(async () => {
    if (isLoading || gameStarted || hasFetchedOnce) return;

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

      if (!response || !response.data || !response.data.gameSession) {
        throw new Error("Invalid game session data received from server.");
      }

      const { imageId, gameSessionId } = response.data.gameSession;
      if (!imageId || !gameSessionId) {
        throw new Error("Incomplete game session data received.");
      }

      setImageId(imageId);
      setGameId(gameSessionId);
      setGameStarted(true);
      setHasFetchedOnce(true);
    } catch (err) {
      setError((err as Error)?.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, gameStarted, isLoading, hasFetchedOnce]);

  useEffect(() => {
    if (accessToken && !gameStarted && !hasFetchedOnce) {
      fetchGameData();
    }
  }, [accessToken, gameStarted, fetchGameData]);

  return { imageId, gameStarted, gameId, isLoading, error, fetchGameData };
};

export default useGameData;
