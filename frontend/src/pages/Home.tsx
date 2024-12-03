import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import RotatingEarth from "../components/home/RotatingEarth";
import UserInfo from "../components/home/UserInfo";
import Leaderboard from "../components/home/Leaderboard";
import PlayButton from "../components/home/PlayButton";
import Loader from "../components/Loader";
import ambientSound from "../assets/ambient.mp3"; 
import whooshSound from "../assets/whoosh.mp3"; 

const Home: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [startCameraMove, setStartCameraMove] = useState(false);

  const ambientAudioRef = useRef<HTMLAudioElement>(null); 
  const whooshAudioRef = useRef<HTMLAudioElement>(null); 

  const topPlayer = {
    username: "Jane Smith",
    rating: 5.0,
  };

  const handlePlayButtonClick = () => {
    setIsPlaying(true);
    setStartCameraMove(true);

    if (whooshAudioRef.current) {
      whooshAudioRef.current.currentTime = 0;
      whooshAudioRef.current
        .play()
        .catch((error) => console.error("Whoosh audio play failed:", error));

      setTimeout(() => {
        if (whooshAudioRef.current) whooshAudioRef.current.pause();
      }, 5000);
    }
  };

  useEffect(() => {
    const startAmbientAudio = () => {
      if (ambientAudioRef.current && ambientAudioRef.current.paused) {
        ambientAudioRef.current
          .play()
          .catch((error) => console.error("Ambient audio play failed:", error));
      }
    };

    document.addEventListener("click", startAmbientAudio, { once: true });

    const timer = setTimeout(() => {
      setLoading(false); 
    }, 3000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", startAmbientAudio);
    };
  }, []);

  return (
    <div>
      {loading && <Loader />}
      <audio ref={ambientAudioRef} src={ambientSound} loop />{" "}
      <audio ref={whooshAudioRef} src={whooshSound} />{" "}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isPlaying ? 0 : 1 }}
        transition={{ duration: 2 }}
      >
        <RotatingEarth startCameraMove={startCameraMove} redirectUrl="/game" />
        <UserInfo />
        <Leaderboard topPlayer={topPlayer} />
      </motion.div>
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
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
