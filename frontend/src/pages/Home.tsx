import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import RotatingEarth from '../components/RotatingEarth'; 
import UserInfo from '../components/UserInfo'; 
import Leaderboard from '../components/Leaderboard'; 
import PlayButton from '../components/PlayButton';
import Loader from '../components/Loader'; 

const Home: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [startCameraMove, setStartCameraMove] = useState(false);

  const user = {
    username: "John Doe",
    rating: 4.5,
    profilePicture: "https://via.placeholder.com/60"
  };

  const topPlayer = {
    username: "Jane Smith",
    rating: 5.0
  };

  const handlePlayButtonClick = () => {
    setIsPlaying(true);
    setStartCameraMove(true);  
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);  // Simulate loading for 3 seconds
    }, 3000); 

    return () => clearTimeout(timer); 
  }, []);

  return (
    <div>
      {loading && <Loader />}
      
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isPlaying ? 0 : 1 }}  
        transition={{ duration: 2 }}  
      >
        <RotatingEarth startCameraMove={startCameraMove} redirectUrl='/game' />
        <UserInfo 
          username={user.username} 
          rating={user.rating} 
          profilePicture={user.profilePicture} 
        />
        <Leaderboard 
          topPlayer={topPlayer} 
        />
      </motion.div>

      <motion.div 
        className='absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10'
        initial={{ opacity: 1 }}
        animate={{ opacity: isPlaying ? 0 : 1 }} 
        transition={{ duration: 1 }}
      >
        <PlayButton onClick={handlePlayButtonClick} />
      </motion.div>
    </div>
  );
};

export default Home;
