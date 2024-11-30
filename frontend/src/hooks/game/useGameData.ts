import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

// Define the return type of the custom hook
interface UseGameDataReturn {
  imageId: string | null;
  gameStarted: boolean;
  fetchGameData: () => void;
}

const useGameData = (): UseGameDataReturn => {
  const [imageId, setImageId] = useState<string | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const { accessToken } = useAuth();

  const fetchGameData = async () => {
    console.log("Fetching game data...");
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

      if (!response) throw new Error("Failed to start game");

      const gameData = response.data;
      const { imageId } = gameData.gameSession
      setImageId(imageId);
      setGameId(gameData.gameSessionId);
      setGameStarted(true);
    } catch (error) {
      console.error("Error fetching game data:", error);
    }
  };

  useEffect(() => {
    if (!gameStarted && accessToken) {
      fetchGameData();
    }
  }, [accessToken, gameStarted]);

  return { imageId, gameStarted, fetchGameData };
};

export default useGameData;
