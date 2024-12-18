import React, { useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import useGuessGame from "../../hooks/game/useGuessGame"
import GameResults from './GameResults';

const GuessMap: React.FC = () => {
  const { gameState, submitGuess } = useGuessGame();
  const [guess, setGuess] = useState<[number, number] | null>(null);

  const handleMapClick = (event: L.LeafletMouseEvent) => {
    const { lat, lng } = event.latlng;
    console.log(`Clicked at Latitude: ${lat}, Longitude: ${lng}`);
    setGuess([lat, lng]);
    console.log("Updated guess state:", [lat, lng]);
  };
  

  const handleSubmit = useCallback(() => {
    console.log("Submitting guess. Current state:", guess);
    if (!guess) {
      alert("Please make a guess by clicking on the map!");
      return;
    }
    const [latitude, longitude] = guess;
    submitGuess(latitude, longitude);
  }, [guess, submitGuess]);

  console.log("Game State:", gameState);

  return (
    <div className="relative">
      <div className="absolute bottom-10 right-20 w-72 h-72 rounded-lg overflow-hidden z-50 
            hover:scale-125 hover:w-[600px] hover:h-[400px]
            hover:origin-bottom-right transition-transform duration-300 transform ease-out
            border-2 border-blue-700 border-opacity-80"
      >
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <ClickHandler onMapClick={handleMapClick} />
          {guess && (
            <Marker position={guess}>
              <Popup>
                You guessed at Latitude: {guess[0].toFixed(4)}, Longitude: {guess[1].toFixed(4)}
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {!gameState?.isGameComplete && (
        <button
          onClick={handleSubmit}
          className="absolute bottom-4 left-1/2 transform z-50 -translate-x-1/2 bg-blue-500 rounded-full shadow-lg p-4 text-white hover:bg-blue-600"
        >
          Guess
        </button>
      )}

      {gameState?.isGameComplete && guess && (
        <GameResults
          guess={guess}
          realCoordinates={gameState.realCoordinates}
          distance={gameState.distance}
          score={gameState.score}
        />
      )}
    </div>
  );
};

interface ClickHandlerProps {
  onMapClick: (event: L.LeafletMouseEvent) => void;
}

const ClickHandler: React.FC<ClickHandlerProps> = ({ onMapClick }) => {
  useMapEvents({
    click: onMapClick,
  });
  return null;
};

export default GuessMap;
