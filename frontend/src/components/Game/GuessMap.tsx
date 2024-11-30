import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

interface MapProps {
  gameId: string;
  onGuessSubmitted: (score: number, distance: number) => void;
}

const GuessMap: React.FC<MapProps> = ({ gameId, onGuessSubmitted }) => {
  const { accessToken } = useAuth();
  const [guess, setGuess] = useState<[number, number] | null>(null);

  // Function to recenter the map
  const CenterMap: React.FC<{ position: [number, number] | null }> = ({ position }) => {
    const map = useMap();
    useEffect(() => {
      if (position) {
        map.setView(position, 10); // Zoom level 10 for a closer look
      }
    }, [position, map]);
    return null;
  };

  const handleMapClick = (event: L.LeafletMouseEvent) => {
    const { lat, lng } = event.latlng;
    console.log(`Clicked at Latitude: ${lat}, Longitude: ${lng}`);
    setGuess([lat, lng]);
  };

  const submitGuess = async () => {
    if (!guess) {
      alert("Please click on the map to make a guess!");
      return;
    }

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.post(
        `${backendUrl}/api/game/guess`,
        {
          gameId,
          latitude: guess[0],
          longitude: guess[1],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const { score, distance } = response.data;
      console.log(`Guess submitted! Score: ${score}, Distance: ${distance}km`);
      onGuessSubmitted(score, distance);
    } catch (error) {
      console.error("Error submitting guess:", error);
    }
  };

  return (
    <div className="relative">
      <div
        className="absolute bottom-10 right-20 w-72 h-72 rounded-lg overflow-hidden z-50 
          hover:scale-125 hover:w-[600px] hover:h-[400px]
          hover:origin-bottom-right transition-transform duration-300 transform ease-out
          border-2 border-blue-700 border-opacity-80"
      >
        <MapContainer
          center={[0, 0]}
          zoom={2}
          className="w-full h-full"
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
          <CenterMap position={guess} />
        </MapContainer>
      </div>
      <button
        onClick={submitGuess}
        className="absolute bottom-2 right-2 bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 z-50"
      >
        Guess
      </button>
    </div>
  );
};

interface ClickHandlerProps {
  onMapClick: (event: L.LeafletMouseEvent) => void;
}

const ClickHandler: React.FC<ClickHandlerProps> = ({ onMapClick }) => {
  useMapEvents({
    click: (event: L.LeafletMouseEvent) => {
      console.log("Map click event triggered");
      console.log("Event:", event);
      onMapClick(event);
    },
  });
  return null;
};

export default GuessMap;
