export interface RoomData {
  id: number;
  name: string;
  type: string;
  area: number;
  lightingLoad: number;
  socketsLoad: number;
  totalLoad: number;
}

export interface LoadEstimationResult {
  rooms: RoomData[];
  totalLoad: number;
  timestamp: string;
}

export interface ProcessingError {
  message: string;
  details?: string;
}
