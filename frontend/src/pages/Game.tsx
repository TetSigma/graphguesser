import React, { useEffect, useRef, useState } from "react";
import { Viewer, ViewerOptions } from "mapillary-js";
import useGameData from "../hooks/game/useGameData";
import GuessMap from "../components/Game/GuessMap";
import Loader from "../components/Loader";

const Game: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true); // Loading state
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

      // Assume viewer is ready after it's created and imageId is set
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
      {loading && <Loader />} {/* Show loader until the viewer is loaded */}
      <div ref={containerRef}></div>
      <GuessMap />
    </div>
  );
};

export default Game;

