import { config } from 'dotenv';
import supabase from '../config/supabaseCLient';
import { Location, GameSession } from '../types/interfaces';
import { calculateDistance, calculateScore } from '../utils/utils';
import axios from 'axios';

config(); 
const MAPILLARY_ACCESS_TOKEN = process.env.MAPILLARY_ACCESS_TOKEN;

// Start a new game session and generate a random location for the player to guess
const startNewGame = async (userId: string): Promise<{ gameSessionId: string, imageId: string }> => {
  const location = await getRandomLocation();
  console.log(location)

  if (!location) {
    throw new Error('No location found to start the game.');
  }

  // Create a new game session with the location information
  const { data, error } = await supabase
    .from('game_sessions')
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
    imageId: location.id,
  };
};


// Get a random location from Mapillary based on a random bounding box
const getRandomLocation = async (): Promise<Location | null> => {
  // Generate a large bounding box that covers the entire Earth
  const bbox = {
    minLat: -90, // Min latitude
    maxLat: 90,  // Max latitude
    minLon: -180, // Min longitude
    maxLon: 180,  // Max longitude
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
      console.log('No images found in this bbox. Trying again...');
      return null; // Explicitly return null if no image is found
    }
  } catch (error) {
    console.error("Error fetching image data:", error);
    console.log('Fetching failed. Retrying...');
    return null; // Explicitly return null on error
  }
};




// Evaluate the user's guess and return the score and distance
const evaluateGuess = async (
  gameId: string,
  userId: string,
  guessLat: number,
  guessLon: number
): Promise<{ score: number; distance: number }> => {
  const { data: game, error: gameError } = await supabase
    .from('game_sessions')
    .select()
    .eq('id', gameId)
    .eq('user_id', userId)
    .single();

  if (gameError || !game) throw new Error('Game session not found');

  const { data: location, error: locationError } = await supabase
    .from('locations')
    .select()
    .eq('id', game.location_id) // Fetch the location for this game
    .single();

  if (locationError || !location) throw new Error('Location not found');

  const distance = calculateDistance(location.latitude, location.longitude, guessLat, guessLon); 
  const score = calculateScore(distance); 

  // Update the score in the game session
  await supabase
    .from('game_sessions')
    .update({ score: game.score + score })
    .eq('id', gameId);

  return { score, distance };
};

// Get the final results of a completed game
const getGameResults = async (gameId: string, userId: string): Promise<GameSession> => {
  const { data, error } = await supabase
    .from('game_sessions')
    .select()
    .eq('id', gameId)
    .eq('user_id', userId)
    .single();

  if (error || !data) throw new Error('Game results not found');
  return data as GameSession;
};

export default { startNewGame, getRandomLocation, evaluateGuess, getGameResults };
