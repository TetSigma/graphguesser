import React, { useEffect, useRef, useState } from 'react';
import { Viewer, ViewerOptions } from 'mapillary-js';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Game: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null); // Reference to the container div
  const [imageId, setImageId] = useState<string | null>(null); // State to store the imageId from the backend
  const [gameStarted, setGameStarted] = useState(false); // State to track whether the game has started
  const { accessToken } = useAuth();

  // Fetch game data once when component mounts or accessToken changes
  const fetchGameData = async () => {
    console.log("Fetching game data...");
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      const response = await axios.post(`${backendUrl}/api/game/start`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response) {
        throw new Error('Failed to start game');
      }

      const gameData = response.data; // This should have gameSession

      const { imageId } = gameData.gameSession; // Directly extract imageId here
      setImageId(imageId); // Set the imageId from the backend
      setGameStarted(true); // Mark the game as started

    } catch (error) {
      console.error('Error fetching game data:', error);
    }
  };

  useEffect(() => {
    // Only fetch game data if the game hasn't been started yet
    if (!gameStarted && accessToken) {
      fetchGameData();
    }
  }, [accessToken, gameStarted]); // Fetch data once when accessToken changes and gameStarted is false

  useEffect(() => {
    // Only initialize Mapillary viewer if imageId is available
    if (imageId && containerRef.current) {
      const container = containerRef.current;
      container.style.width = '100vw'; // Set the width of the viewer
      container.style.height = '100vh'; // Set the height of the viewer

      const options: ViewerOptions = {
        accessToken: 'MLY|8378375865606327|b5a74a1ee921350410c2af79a01e454d', // Replace with your Mapillary access token
        container: container, // Attach the viewer to this container
        imageId: imageId, // Use the imageId set from the backend
      };
      console.log(imageId)
      console.log('Initializing Mapillary viewer with imageId:', imageId);

      // Initialize the Mapillary viewer
      const viewer = new Viewer(options);

      // Cleanup on component unmount
      return () => {
        viewer; // Destroy the viewer when the component is unmounted
      };
    }
  }, [imageId]); // Only run this effect when imageId changes

  return (
    <div>
      <div ref={containerRef}></div>
    </div>
  );
};

export default Game;
