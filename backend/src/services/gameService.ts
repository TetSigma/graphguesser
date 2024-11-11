import { config } from 'dotenv';
import supabase from '../config/supabaseCLient'
import { Location, GameSession } from '../types/interfaces';
import { generateRandomId, generateRandomLatLon, snapToRoad, getStreetViewMetadata, calculateDistance, calculateScore } from '../utils/utils';

config(); 

// Start a new game session
const startNewGame = async (userId: string): Promise<GameSession> => {
  const { data, error } = await supabase
    .from('game_sessions')
    .insert({ user_id: userId, score: 0, is_complete: false })
    .select()
    .single();

  if (error) throw new Error(`Error creating game session:${error.details}`);
  return data as GameSession;
};

const getRandomLocation = async (): Promise<Location | null> => {
  let attempts = 0;
  while (attempts < 10) {
    try {
      const { lat, lon } = generateRandomLatLon(); 
      const snappedLocation = await snapToRoad(lat, lon); 

      if (snappedLocation) {
        console.log(`Location snapped to: ${snappedLocation.latitude}, ${snappedLocation.longitude}`);
        const hasStreetView = await getStreetViewMetadata(snappedLocation.latitude, snappedLocation.longitude);

        if (hasStreetView) {
          return {
            id: generateRandomId(),
            latitude: snappedLocation.latitude,
            longitude: snappedLocation.longitude,
          };
        } else {
          console.log(`No Street View available for location: ${snappedLocation.latitude}, ${snappedLocation.longitude}`);
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching snapped location or Street View metadata:', error.message);
      } else {
        console.error('An unknown error occurred', error);
      }
    }

    attempts++;
  }

  console.log('Failed to find a valid location with Street View after 10 attempts');
  return null;
};

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
    .eq('id', game.location_id)
    .single();

  if (locationError || !location) throw new Error('Location not found');

  const distance = calculateDistance(location.latitude, location.longitude, guessLat, guessLon); 
  const score = calculateScore(distance); 

  await supabase
    .from('game_sessions')
    .update({ score: game.score + score })
    .eq('id', gameId);

  return { score, distance };
};

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
