import axios from 'axios';
import { config } from 'dotenv';
config(); 

// Generate a random ID for the game
export const generateRandomId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Generate random latitude and longitude within valid geographic ranges
export const generateRandomLatLon = () => {
  const lat = Math.random() * (85 - -85) + -85;
  const lon = Math.random() * (180 - -180) + -180; 
  return { lat, lon };
};

// Function to snap a location to the nearest road (using Mapillary's imagery)
export const snapToRoad = async (latitude: number, longitude: number): Promise<{ latitude: number; longitude: number } | null> => {
  const MAPILLARY_API_URL = 'https://graph.mapillary.com/images';
  const MAPILLARY_CLIENT_ID = process.env.MAPILLARY_CLIENT_ID;

  console.log('Client ID:', MAPILLARY_CLIENT_ID);
  console.log('Latitude:', latitude, 'Longitude:', longitude);

  // Define the distance to extend the bounding box (in degrees)

  try {
    // Use Axios to query the Mapillary API for images within the bounding box
    const response = await axios.get(MAPILLARY_API_URL, {
      headers: {
        'Authorization': `OAuth MLY|8378375865606327|b5a74a1ee921350410c2af79a01e454d`, // Your token
      },
      params: {
        client_id: MAPILLARY_CLIENT_ID,
        bbox: `-180,-90,180,90`,
        per_page: 1,
        page: Math.floor(Math.random() * 1000) + 1
      },
    });

    // Log the full response to check the structure
    console.log('Full Response:', response);

    // If images are found, return the coordinates of the first one as the snapped location
    if (response.data && response.data.features && response.data.features.length > 0) {
      const snappedPoint = response.data.features[0].geometry.coordinates;
      return { latitude: snappedPoint[1], longitude: snappedPoint[0] };
    }

  } catch (error: unknown) {
    // Log more detailed error information
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response ? error.response.data : error.message);
    } else if (error instanceof Error) {
      console.error('Error snapping to road:', error.message);
    } else {
      console.error('Unknown error occurred while snapping to road', error);
    }
  }

  return null;
};



// Function to check if a location has street view imagery (using Mapillary)
export const getStreetViewMetadata = async (latitude: number, longitude: number): Promise<boolean> => {
  const MAPILLARY_API_URL = 'https://a.mapillary.com/v3/images';
  const MAPILLARY_CLIENT_ID = process.env.MAPILLARY_CLIENT_ID;

  try {
    const response = await axios.get(MAPILLARY_API_URL, {
      params: {
        client_id: MAPILLARY_CLIENT_ID,
        lat: latitude,
        lon: longitude,
        radius: 50, // Search radius
        limit: 1
      }
    });

    return response.data.features.length > 0;
  } catch (error: unknown) {
    // Check if the error is an instance of Error
    if (error instanceof Error) {
      console.error('Error fetching street view metadata:', error.message);
    } else {
      // If the error is not an instance of Error, log a generic message
      console.error('Unknown error occurred while fetching street view metadata');
    }
    return false;
  }
};

// Calculate the distance between two sets of coordinates (in kilometers)
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

// Calculate score based on distance (smaller distance gives a better score)
export const calculateScore = (distance: number): number => {
  return Math.max(1000 - distance * 10, 0); // Score out of 1000 based on proximity
};
