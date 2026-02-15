import DxfParser from "dxf-parser";
import Flatten from "@flatten-js/core";
import fs from "fs/promises";
import config from "./config";

const { polygon, point } = Flatten;

interface TextEntity {
  text: string;
  point: any; // Flatten.Point
}

interface PolylineData {
  polygon: any; // Flatten.Polygon
  area: number;
}

interface RoomData {
  id: number;
  name: string;
  type: string;
  area: number;
  lightingLoad: number;
  socketsLoad: number;
  totalLoad: number;
}

interface ProcessResult {
  success: boolean;
  rooms?: RoomData[];
  totalLoad?: number;
  timestamp: string;
  error?: string;
}

/**
 * Process DXF file and extract room data with load calculations
 * @param filePath - Path to the DXF file
 * @returns Processed room data and total load
 */
export async function processDxfFile(filePath: string): Promise<ProcessResult> {
  try {
    // Read DXF file
    const fileContent = await fs.readFile(filePath, "utf-8");
    const parser = new DxfParser();
    const dxf = parser.parseSync(fileContent);

    if (!dxf || !dxf.entities) {
      throw new Error("Invalid DXF file structure");
    }

    const texts: TextEntity[] = [];
    const polylines: PolylineData[] = [];

    // Extract TEXT and MTEXT entities
    for (const entity of dxf.entities) {
      if (entity.type === "TEXT" || entity.type === "MTEXT") {
        try {
          const text = (entity.text || "").trim().toUpperCase();
          const position = entity.position || entity.startPoint;

          if (text && position) {
            texts.push({
              text,
              point: point(position.x, position.y),
            });
          }
        } catch (err) {
          // Skip invalid text entities silently
        }
      }
    }

    // Extract LWPOLYLINE entities and create polygons
    for (const entity of dxf.entities) {
      if (entity.type === "LWPOLYLINE" || entity.type === "POLYLINE") {
        try {
          const vertices = entity.vertices || [];

          if (vertices.length < 3) {
            continue;
          }

          // Convert vertices to Flatten.js points
          const points = vertices.map((v) => point(v.x, v.y));

          // Create Flatten.js polygon
          const poly = polygon(points);

          // Get area (automatically calculated for Cartesian coordinates)
          const area = poly.area();

          // Filter out small areas (< 1 m²)
          if (area > 1.0) {
            polylines.push({ polygon: poly, area });
          }
        } catch (err) {
          // Skip invalid polylines silently
        }
      }
    }

    // Sort polylines by area (smallest to largest)
    polylines.sort((a, b) => a.area - b.area);

    const roomsData: RoomData[] = [];
    let totalLoad = 0;

    // Match text labels to rooms using point-in-polygon
    for (const { polygon: poly, area } of polylines) {
      let roomName = "UNKNOWN";
      let roomType = "DEFAULT";

      // Check which text label is inside this polygon
      for (const { text, point: pt } of texts) {
        if (poly.contains(pt)) {
          roomName = text;
          // Extract room type from label (first word or before underscore)
          const parts = text.split(/[_ ]/);
          roomType = parts[0];
          break;
        }
      }

      // Skip outer boundaries (large unknown areas)
      if (roomName === "UNKNOWN" && area > 5000) {
        continue;
      }

      // Get load factors for this room type
      const factors =
        config.loadFactors[roomType] || config.loadFactors.DEFAULT;

      // Calculate loads
      const lightingLoad = area * factors.lighting;
      const socketsLoad = area * factors.sockets;
      const roomTotal = lightingLoad + socketsLoad;
      totalLoad += roomTotal;

      roomsData.push({
        id: roomsData.length + 1,
        name: roomName,
        type: roomType,
        area: Math.round(area * 100) / 100,
        lightingLoad: Math.round(lightingLoad * 100) / 100,
        socketsLoad: Math.round(socketsLoad * 100) / 100,
        totalLoad: Math.round(roomTotal * 100) / 100,
      });
    }

    return {
      success: true,
      rooms: roomsData,
      totalLoad: Math.round(totalLoad * 100) / 100,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("DXF processing error:", errorMessage);

    return {
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString(),
    };
  }
}
