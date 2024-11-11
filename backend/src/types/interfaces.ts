export interface Location {
    id: string;
    latitude: number;
    longitude: number;
  }
  
export interface GameSession {
    id: string;
    userId: string;
    score: number;
    isComplete: boolean;
    startTime: Date;
}