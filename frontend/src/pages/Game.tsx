import React, { useEffect, useRef, useState } from "react";
import { Viewer, ViewerOptions } from "mapillary-js";
import useGameData from "../hooks/game/useGameData";
import GuessMap from "../components/Game/GuessMap";
import Loader from "../components/Loader";

const Game: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true); 
  const { imageId } = useGameData();
  const mapillaryToken = import.meta.env.MAPILLARY_TOKEN;
  
  useEffect(() => {
    if (imageId && containerRef.current) {
      const container = containerRef.current;
      container.style.width = "100vw";
      container.style.height = "100vh";

      const options: ViewerOptions = {
        accessToken: mapillaryToken,
        container: container,
        imageId: imageId,
      };

      const viewer = new Viewer(options);

      setLoading(false);

      return () => {
        if (viewer) {
          viewer.remove();
        }
      };
    }
  }, [imageId]);

  return (
    <div>
      {loading && <Loader />} 
      <div ref={containerRef}></div>
      <GuessMap />
    </div>
  );
};

export default Game;

