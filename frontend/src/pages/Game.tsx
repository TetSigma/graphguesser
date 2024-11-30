import React from "react";
import GuessMap from "../components/Game/GuessMap";


const Game: React.FC = () => {
  const handleGuessSubmitted = (score: number, distance: number) => {
    alert(`Your score: ${score}\nDistance: ${distance.toFixed(2)} km`);
  };

  return (
    <div style={{ position: "relative" }}>
      <Game />
      <GuessMap
        gameId="your-game-id-here"
        onGuessSubmitted={handleGuessSubmitted}
      />
    </div>
  );
};

export default Game;
