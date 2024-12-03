import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';


interface GameResultsProps {
  guess: [number, number] | null;
  realCoordinates: {
    latitude: number;
    longitude: number;
  };
  distance: number;
  score: number;
}

const GameResults: React.FC<GameResultsProps> = ({
  guess,
  realCoordinates,
  distance,
  score,
}) => {
  const getMidpoint = () => {
    if (!guess) return [0, 0];
    return [
      (guess[0] + realCoordinates.latitude) / 2,
      (guess[1] + realCoordinates.longitude) / 2
    ];
  };

  const linePositions = guess ? [
    guess,
    [realCoordinates.latitude, realCoordinates.longitude]
  ] : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[1000]">
      <div className="bg-blue-500 bg-opacity-50 rounded-lg w-1/3 shadow-lg p-4 backdrop-blur-lg border border-blue-700 border-opacity-80 relative overflow-hidden text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Results</h2>
        <div className="space-y-4">
          <div className="h-64 w-full mb-4">
            <MapContainer
              center={getMidpoint()}
              zoom={2}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={true}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              {guess && (
                <>
                  <Marker position={guess}>
                    <Popup>Your Guess</Popup>
                  </Marker>
                  <Polyline 
                    positions={linePositions}
                    color="black"
                    weight={2}
                    dashArray="5, 10"
                  >
                    <Popup>
                      Distance: {distance.toFixed(2)} km
                    </Popup>
                  </Polyline>
                </>
              )}
              <Marker position={[realCoordinates.latitude, realCoordinates.longitude]}>
                <Popup>Actual Location</Popup>
              </Marker>
            </MapContainer>
          </div>
          <p className="text-xl font-semibold text-center">
            Score: {score} points
          </p>
          <div className="flex space-x-4 mt-8 justify-center">
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Go Home
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              New Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameResults; 