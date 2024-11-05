import React from 'react';

interface PlayButtonProps {
  onClick: () => void;
}

const PlayButton: React.FC<PlayButtonProps> = ({ onClick }) => {
  return (
    <div className="flex justify-center">
      <button
        onClick={onClick}
        className="bg-blue-500 bg-opacity-50 rounded-full shadow-lg p-4 backdrop-blur-lg w-48 transition-transform duration-300 ease-in-out transform hover:scale-105 relative overflow-hidden border border-blue-700 border-opacity-80"
      >
        <span className="text-blue-200 text-lg font-bold">Play</span>
        <div className="absolute inset-0 rounded-full border-2 border-blue-300 opacity-20"></div>
        <div className="absolute inset-0 rounded-full border border-blue-400 opacity-30 animate-pulse"></div>
      </button>
    </div>
  );
};

export default PlayButton;
