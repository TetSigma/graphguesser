import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import RotatingEarth from "../components/home/RotatingEarth";
import UserInfo from "../components/home/UserInfo";
import Leaderboard from "../components/home/Leaderboard";
import PlayButton from "../components/home/PlayButton";
import Loader from "../components/Loader";
import ambientSound from "../assets/ambient.mp3"; // Import ambient sound
import whooshSound from "../assets/whoosh.mp3"; // Import whoosh sound

const Home: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [startCameraMove, setStartCameraMove] = useState(false);

  const ambientAudioRef = useRef<HTMLAudioElement>(null); // Reference for ambient audio
  const whooshAudioRef = useRef<HTMLAudioElement>(null); // Reference for whoosh audio

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

    // Wait for user interaction to start ambient audio
    document.addEventListener("click", startAmbientAudio, { once: true });

    const timer = setTimeout(() => {
      setLoading(false); // Simulate loading for 3 seconds
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
      {/* Add ambient audio element */}
      <audio ref={whooshAudioRef} src={whooshSound} />{" "}
      {/* Add whoosh audio element */}
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
