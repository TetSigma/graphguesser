import React, { useState } from 'react';
import buttonSound from '../assets/buttonSound.mp3';

interface Player {
  username: string;
  rating: number;
}

interface LeaderboardProps {
  topPlayer: Player;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ topPlayer }) => {
  const [isHovered, setIsHovered] = useState(false);
  const sound = new Audio(buttonSound);

  const handleMouseEnter = () => {
    sound.currentTime = 0;
    sound.play();
    setTimeout(() => {
      sound.pause();
      sound.currentTime = 0;
    }, 2000);
  };

  return (
    <div
      className="absolute top-5 right-5 z-10"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-blue-500 bg-opacity-50 rounded-full shadow-lg p-4 backdrop-blur-lg w-64 flex flex-col items-center border border-blue-700 border-opacity-80 transition-transform duration-300 ease-in-out transform hover:scale-105 relative overflow-hidden">
        <h2 className="text-blue-200 text-lg font-bold">{topPlayer.username}</h2>
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-yellow-300 mr-1"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M10 15.27L16.18 18 14.54 11.97 20 7.24l-8.19-.61L10 0 8.19 6.63 0 7.24l5.46 4.73L3.82 18z" />
          </svg>
          <span className="text-blue-100 text-sm">{topPlayer.rating}</span>
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-blue-300 opacity-20"></div>
        <div className="absolute inset-0 rounded-full border border-blue-400 opacity-30 animate-pulse"></div>
      </div>
    </div>
  );
};

export default Leaderboard;