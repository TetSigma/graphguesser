import React, { useEffect, useRef } from "react";
import { Viewer, ViewerOptions } from "mapillary-js";
import useGameData from "../hooks/game/useGameData";
import GuessMap from "../components/Game/GuessMap";

const Game: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { imageId } = useGameData();

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

      const viewer = new Viewer(options);

      return () => viewer.remove();
    }
  }, [imageId]);

  return (
    <div>
      <div ref={containerRef}></div>
      <GuessMap />
    </div>
  );
};

export default Game;
