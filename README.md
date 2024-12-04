# Geoguesser clone game
![Screenshot_1](https://github.com/user-attachments/assets/0a001d9d-7360-4a1f-9d3a-c06347513e7e)


> Tech Stack: React Express Supabase THREE Tailwind

Graphguesser is a geoguesser clone that works on [Mapillary](https://www.mapillary.com) 

Just like in geoguesser, user gets shown random streetview and has to guess where this streetview is located on the map

## Get Started 

### .env on frontend 
```
VITE_BACKEND_URL=http://localhost:5000
MAPILLARY_TOKEN=<your_mapillary_token>
```
### .env on backend
Mapillary API token can be obtained on [their website](https://www.mapillary.com/developer/api-documentation)

```
SUPABASE_URL=<your_supabase_url>
SUPABASE_KEY=<your_supabase_key>
MAPILLARY_ACCESS_TOKEN=<your_mapillary_access_token>
```

### Set up on localhost

```bash
// cloning the repo
git clone https://github.com/TetSigma/graphguesser.git

cd frontend
npm i
npm run dev

// This should be done in separate terminal
cd backend
npm i
npm run dev
```

## How the random location logic works?

Mapillary API doesnt support random locations by default, but it supports something called Bounding Box  
Graphguesser generates random coordinates, and after that generates bounding box around it  

After this, it sends the bounding box coordinates to graph.mapillary.com, and usually Mapillary API returns imageId which can then be used to generate streetview  

Script tries to generate bounding box 3 times, if nothing is found it breaks  

```js
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
```








