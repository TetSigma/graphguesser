import { config } from "dotenv";
import supabase from "../config/supabaseCLient";
import { Location, GameSession } from "../types/interfaces";
import { calculateDistance, calculateScore } from "../utils/utils";
import axios from "axios";

config();
const MAPILLARY_ACCESS_TOKEN = process.env.MAPILLARY_ACCESS_TOKEN;

// Start a new game session and generate a random location for the player to guess
const startNewGame = async (userId: string): Promise<{ gameSessionId: string; imageId: string }> => {
  // Lock or check first to prevent multiple calls from creating new sessions
  const { data: existingSession, error: sessionError } = await supabase
    .from("game_sessions")
    .select("id, location_id")
    .eq("user_id", userId)
    .eq("is_complete", false)
    .single(); // Only fetch one record

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
  // Generate a large bounding box that covers the entire Earth
  const bbox = {
    minLat: -90,
    maxLat: 90,
    minLon: -180,
    maxLon: 180,
  };

  let location: Location | null = null;

  // Try fetching a location
  const url = `https://graph.mapillary.com/images?access_token=${MAPILLARY_ACCESS_TOKEN}&bbox=${bbox.minLon},${bbox.minLat},${bbox.maxLon},${bbox.maxLat}&limit=1`;

  try {
    const response = await axios.get(url);

    if (response.data.data && response.data.data.length > 0) {
      location = {
        id: response.data.data[0].id,
        latitude: response.data.data[0].geometry.coordinates[1],
        longitude: response.data.data[0].geometry.coordinates[0],
      };
      console.log(location);
      return location;
    } else {
      console.log("No images found in this bbox. Trying again...");
      return null; // Explicitly return null if no image is found
    }
  } catch (error) {
    console.error("Error fetching image data:", error);
    console.log("Fetching failed. Retrying...");
    return null; // Explicitly return null on error
  }
};

// Evaluate the user's guess and return the score and distance
const evaluateGuess = async (
  gameId: string,
  userId: string,
  guessLat: number,
  guessLon: number
): Promise<{ score: number; distance: number; realCoordinates: { latitude: number; longitude: number } }> => {
  // Fetch the game session data
  const { data: game, error: gameError } = await supabase
    .from("game_sessions")
    .select("latitude, longitude, score, is_complete") // Fetch relevant fields
    .eq("id", gameId)
    .eq("user_id", userId)
    .single();

  if (gameError || !game) {
    console.error("Game session not found", gameError);
    throw new Error("Game session not found");
  }

  // Calculate distance and score
  const distance = calculateDistance(
    game.latitude,
    game.longitude,
    guessLat,
    guessLon
  );
  const score = calculateScore(distance);

  // Update the score and mark the session as complete
  const { error: updateError } = await supabase
    .from("game_sessions")
    .update({ 
      score: game.score + score, 
      is_complete: true // Mark as completed
    })
    .eq("id", gameId);

  if (updateError) {
    console.error("Error updating score or marking session as complete:", updateError);
    throw new Error("Error updating game session");
  }

  // Return the results to the user
  return { 
    score, 
    distance, 
    realCoordinates: { 
      latitude: game.latitude, 
      longitude: game.longitude 
    } 
  };
};



// Get the final results of a completed game
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
