import React from 'react';

interface StyledContainerProps {
  children: React.ReactNode;
  className?: string;
  onMouseEnter?: () => void;
  onClick?: () => void;
}

const StyledContainer: React.FC<StyledContainerProps> = ({ children, className, onMouseEnter, onClick }) => {
  return (
    <div
      className={`bg-blue-500 bg-opacity-50 rounded-full shadow-lg p-4 backdrop-blur-lg border border-blue-700 border-opacity-80 transition-transform duration-300 ease-in-out transform hover:scale-105 relative overflow-hidden ${className}`}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      {children}
      <div className="absolute inset-0 rounded-full border-2 border-blue-300 opacity-20"></div>
      <div className="absolute inset-0 rounded-full border border-blue-400 opacity-30 animate-pulse"></div>
    </div>
  );
};

export default StyledContainer;
