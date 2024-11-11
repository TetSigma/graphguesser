import React, { useEffect, useRef } from 'react';
import { Viewer, ViewerOptions } from 'mapillary-js';

const Game: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null); // Reference to the container div

  useEffect(() => {
    // Ensure the container is available before initializing the viewer
    if (containerRef.current) {
      const container = containerRef.current;
      container.style.width = '100vw'; // Set the width of the viewer
      container.style.height = '100vh'; // Set the height of the viewer

      const options: ViewerOptions = {
        accessToken: 'MLY|8378375865606327|b5a74a1ee921350410c2af79a01e454d', // Replace with your Mapillary access token
        container: container, // Attach the viewer to this container
        imageId: '660754075548855', // Replace with a valid image ID to initialize the viewer
      };

      // Initialize the Mapillary viewer
      const viewer = new Viewer(options);

      // Cleanup on component unmount
      return () => {
        viewer; // Destroy the viewer when the component is unmounted
      };
    }
  }, []);

  return (
    <div>
      <div ref={containerRef}></div>
    </div>
  );
};

export default Game;
