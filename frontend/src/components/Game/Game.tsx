import React, { useRef, useEffect } from "react";
import { Viewer, ViewerOptions } from "mapillary-js";
import useGameData from "../../hooks/game/useGameData"

const Game: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { imageId } = useGameData();
  const viewerRef = useRef<Viewer | null>(null); // To hold the Viewer instance

  useEffect(() => {
    if (imageId && containerRef.current) {
      const container = containerRef.current;
      container.style.width = "100vw";
      container.style.height = "100vh";

      const options: ViewerOptions = {
        accessToken: "MLY|8378375865606327|b5a74a1ee921350410c2af79a01e454d",
        container: container,
        imageId: imageId,
      };

      console.log("Initializing Mapillary viewer with imageId:", imageId);

      // Initialize the viewer and store it in the ref
      viewerRef.current = new Viewer(options);

      // Cleanup function to remove the viewer on component unmount or imageId change
      return () => {
        // If the viewer is defined, clean up by removing the container's content
        if (viewerRef.current) {
          viewerRef.current = null;
        }
      };
    }
  }, [imageId]); // Re-run the effect when imageId changes

  return <div ref={containerRef}></div>;
};

export default Game;