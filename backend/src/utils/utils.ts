import { config } from "dotenv";
config();

// Generate a random ID for the game
export const generateRandomId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Calculate the distance between two sets of coordinates (in kilometers)
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
};

// Calculate score based on distance (smaller distance gives a better score)
export const calculateScore = (distance: number): number => {
  return Math.round(Math.max(500 - distance * 5, 0)); // Max 500 points, lose 5 points per km
};
