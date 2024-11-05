import React from 'react';
import RotatingEarth from '../components/RotatingEarth'; 
import UserInfo from '../components/UserInfo'; 
import Leaderboard from '../components/Leaderboard'; 
import PlayButton from '../components/PlayButton';


const Home: React.FC = () => {
  // Example user data
  const user = {
    username: "John Doe",
    rating: 4.5,
    profilePicture: "https://via.placeholder.com/60" 
  };

  // Example leaderboard data
  const topPlayer = {
    username: "Jane Smith",
    rating: 5.0
  };

    const handlePlayButtonClick = () => {
    console.log("Play button clicked!");
  };

  return (
    <div>
      <RotatingEarth />
      <UserInfo 
        username={user.username} 
        rating={user.rating} 
        profilePicture={user.profilePicture} 
      />
      <Leaderboard 
        topPlayer={topPlayer} 
      />
      <div className='absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10'>
        <PlayButton  onClick={handlePlayButtonClick} />
      </div>
    </div>
  );
};

export default Home;
