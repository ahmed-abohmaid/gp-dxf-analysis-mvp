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
  /**
   * Total building load in Watts (internal canonical unit).
   * The UI displays kVA (assumes power factor = 1) unless PF handling is added.
   */
  totalLoad: number;
  timestamp: string;
}

export interface ProcessingError {
  message: string;
  details?: string;
}
