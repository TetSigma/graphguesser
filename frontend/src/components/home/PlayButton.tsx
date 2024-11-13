import React from "react";
import StyledContainer from "../StyledContainer";

interface PlayButtonProps {
  onClick: () => void;
}

const PlayButton: React.FC<PlayButtonProps> = ({ onClick }) => {
  return (
    <div className="flex justify-center items-center text-center cursor-pointer">
      <StyledContainer className="w-48" onClick={onClick}>
        <span className="text-blue-200 text-lg font-bold">Play</span>
      </StyledContainer>
    </div>
  );
};

export default PlayButton;
