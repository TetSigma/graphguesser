import axios from "axios";
import { config } from "dotenv";
config();

// Generate a random ID for the game
export const generateRandomId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Generate random latitude and longitude within valid geographic ranges
export const generateRandomBBox = () => {
  // Generate random center lat and lon
  const centerLat = Math.random() * (85 - -85) + -85;
  const centerLon = Math.random() * (180 - -180) + -180;

  // Define a small offset range to create a small bounding box around the center point
  const offset = 0.01;

  const minLat = centerLat - offset;
  const maxLat = centerLat + offset;
  const minLon = centerLon - offset;
  const maxLon = centerLon + offset;

  return { minLon, minLat, maxLon, maxLat };
};

// Function to check if a location has street view imagery (using Mapillary)
export const getStreetViewMetadata = async (
  latitude: number,
  longitude: number
): Promise<boolean> => {
  const MAPILLARY_API_URL = "https://a.mapillary.com/v3/images";
  const MAPILLARY_CLIENT_ID = process.env.MAPILLARY_CLIENT_ID;

  try {
    const response = await axios.get(MAPILLARY_API_URL, {
      params: {
        client_id: MAPILLARY_CLIENT_ID,
        lat: latitude,
        lon: longitude,
        radius: 50, // Search radius
        limit: 1,
      },
    });

    return response.data.features.length > 0;
  } catch (error: unknown) {
    // Check if the error is an instance of Error
    if (error instanceof Error) {
      console.error("Error fetching street view metadata:", error.message);
    } else {
      // If the error is not an instance of Error, log a generic message
      console.error(
        "Unknown error occurred while fetching street view metadata"
      );
    }
    return false;
  }
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
  return R * c; // Distance in kilometers
};

// Calculate score based on distance (smaller distance gives a better score)
export const calculateScore = (distance: number): number => {
  return Math.round(Math.max(1000 - distance * 10, 0)); // Round the score to the nearest integer
};
