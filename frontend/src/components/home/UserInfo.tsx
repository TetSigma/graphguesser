import React from "react";
import buttonSound from "../../assets/buttonSound.mp3";
import { useAuth } from "../../context/AuthContext";
import StyledContainer from "../StyledContainer";

const UserInfo: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

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
    <div className="absolute top-5 left-5 z-10">
      <StyledContainer
        className="w-72 flex items-center"
        onMouseEnter={handleMouseEnter}
      >
        <img
          src={user.profile_photo}
          alt="Profile"
          className="w-16 h-16 rounded-full border-4 border-blue-300 shadow-md"
        />
        <div className="ml-4">
          <h2 className="text-blue-200 text-lg font-bold flex gap-2 items-center">
            <span>{user.name}</span> <span>{user.surname}</span>
          </h2>
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
            <span className="text-blue-100 text-sm">{user.rating}</span>
          </div>
        </div>
      </StyledContainer>
    </div>
  );
};

export default UserInfo;
