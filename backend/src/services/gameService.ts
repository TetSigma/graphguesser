import { config } from "dotenv";
import supabase from "../config/supabaseCLient";
import { Location, GameSession } from "../types/interfaces";
import { calculateDistance, calculateScore } from "../utils/utils";
import axios from "axios";

config();
const MAPILLARY_ACCESS_TOKEN = process.env.MAPILLARY_ACCESS_TOKEN;

// Start a new game session and generate a random location for the player to guess
const startNewGame = async (userId: string): Promise<{ gameSessionId: string; imageId: string }> => {

  const { data: existingSession, error: sessionError } = await supabase
    .from("game_sessions")
    .select("id, location_id")
    .eq("user_id", userId)
    .eq("is_complete", false)
    .single(); 

  if (sessionError && sessionError.code !== "PGRST116") { // Handle non-empty results
    console.error("Error checking for existing game session:", sessionError.message);
    throw new Error("Error checking for existing game session");
  }

  if (existingSession) {
    return {
      gameSessionId: existingSession.id,
      imageId: existingSession.location_id,
    };
  }

  // Proceed to create a new game session if no active session exists
  const location = await getRandomLocation();

  if (!location) {
    throw new Error("No location found to start the game.");
  }

  const { data, error } = await supabase
    .from("game_sessions")
    .insert({
      user_id: userId,
      score: 0,
      is_complete: false,
      location_id: location.id,
      latitude: location.latitude,
      longitude: location.longitude,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating game session: ${error.details}`);
  }

  return {
    gameSessionId: data.id,
    imageId: data.location_id,
  };
};


// Get a random location from Mapillary based on a random bounding box
const getRandomLocation = async (): Promise<Location | null> => {
  // Generate a smaller, random bounding box
  const generateRandomBox = () => {
    // Pick a random center point
    const centerLat = Math.random() * 140 - 70; // Range: -70 to 70 (avoiding extreme poles)
    const centerLon = Math.random() * 360 - 180; // Range: -180 to 180

    // Create a 5-degree box around the center
    const offset = 2.5;
    return {
      minLat: Math.max(centerLat - offset, -90),
      maxLat: Math.min(centerLat + offset, 90),
      minLon: centerLon - offset,
      maxLon: centerLon + offset
    };
  };

  // Try up to 3 different random boxes
  for (let attempt = 0; attempt < 3; attempt++) {
    const bbox = generateRandomBox();
    
    const url = `https://graph.mapillary.com/images?access_token=${MAPILLARY_ACCESS_TOKEN}&bbox=${bbox.minLon},${bbox.minLat},${bbox.maxLon},${bbox.maxLat}&limit=100`;

    try {
      const response = await axios.get(url);
      
      if (response.data.data && response.data.data.length > 0) {
        // Pick a random image from the results
        const randomIndex = Math.floor(Math.random() * response.data.data.length);
        const randomImage = response.data.data[randomIndex];
        
        return {
          id: randomImage.id,
          latitude: randomImage.geometry.coordinates[1],
          longitude: randomImage.geometry.coordinates[0],
        };
      }
    } catch (error) {
      console.error("Error fetching image data:", error);
    }
  }

  console.log("Failed to find location after 3 attempts");
  return null;
};

// Evaluate the user's guess and return the score and distance
const evaluateGuess = async (
  gameId: string,
  userId: string,
  guessLat: number,
  guessLon: number
): Promise<{ score: number; distance: number; realCoordinates: { latitude: number; longitude: number } }> => {
  const { data: game, error: gameError } = await supabase
    .from("game_sessions")
    .select("latitude, longitude, score, is_complete")
    .eq("id", gameId)
    .eq("user_id", userId)
    .single();

  if (gameError || !game) {
    console.error("Game session not found", gameError);
    throw new Error("Game session not found");
  }

  const distance = calculateDistance(
    game.latitude,
    game.longitude,
    guessLat,
    guessLon
  );
  const score = calculateScore(distance);

  if (score > 0) {
    
    const { data: users, error: fetchError } = await supabase
      .from('users')
      .select('rating')
      .eq('id', userId);

    if (fetchError) {
      console.error("Error fetching user rating:", fetchError);
      throw new Error("Error fetching user rating");
    }

      console.log("Current user rating:", users[0].rating);
      const newRating = (users[0].rating || 0) + score;
      console.log("New rating will be:", newRating);
      
      const { error: updateError } = await supabase
        .from('users')
        .update({ rating: newRating })
        .eq('id', userId);

      if (updateError) {
        console.error("Error updating user rating:", updateError);
        throw new Error("Error updating user rating");
      }

  }

  // Update the game session score and mark it as complete
  const { error: updateError } = await supabase
    .from("game_sessions")
    .update({ 
      score: game.score + score, 
      is_complete: true
    })
    .eq("id", gameId);

  if (updateError) {
    console.error("Error updating game session:", updateError);
    throw new Error("Error updating game session");
  }

  return { 
    score, 
    distance, 
    realCoordinates: { 
      latitude: game.latitude, 
      longitude: game.longitude 
    } 
  };
};


const getGameResults = async (
  gameId: string,
  userId: string
): Promise<GameSession> => {
  const { data, error } = await supabase
    .from("game_sessions")
    .select()
    .eq("id", gameId)
    .eq("user_id", userId)
    .single();

  if (error || !data) throw new Error("Game results not found");
  return data as GameSession;
};

export default {
  startNewGame,
  getRandomLocation,
  evaluateGuess,
  getGameResults,
};
