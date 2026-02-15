import DxfParser from "dxf-parser";
import Flatten from "@flatten-js/core";
import fs from "fs/promises";
import config from "./config";
import { convertWattsToKVA } from "./utils";

interface DxfEntity {
  type: string;
  text?: string;
  position?: { x: number; y: number };
  startPoint?: { x: number; y: number };
  vertices?: Array<{ x: number; y: number }>;
  [key: string]: unknown;
}

interface TextEntity {
  text: string;
  point: Flatten.Point;
}

interface PolylineData {
  polygon: Flatten.Polygon;
  area: number;
  rawArea: number;
}

interface RoomData {
  id: number;
  name: string;
  type: string;
  area: number;
  rawArea: number;
  lightingLoad: number;
  socketsLoad: number;
  totalLoad: number;
}

interface ProcessResult {
  success: boolean;
  rooms?: RoomData[];
  totalLoad?: number;
  totalRooms?: number;
  unitsDetected?: string;
  unitFactor?: number;
  timestamp: string;
  error?: string;
}

/**
 * Clean DXF text by removing formatting codes and normalizing
 */
function cleanText(text: string): string {
  if (!text) return "";

  // Remove DXF formatting codes like \P, \A, etc.
  let cleaned = text.replace(/\\[PALSQWHFCT].*?;/g, "");

  // Remove curly braces
  cleaned = cleaned.replace(/[{}]/g, "");

  return cleaned.trim().toUpperCase();
}

/**
 * Identify room type and name from text labels found inside polygon
 * Priority: 1) Keywords matching, 2) Non-numeric/non-tag text, 3) First text
 */
function identifyRoom(textsFound: string[]): {
  name: string;
  category: string;
} {
  if (!textsFound || textsFound.length === 0) {
    return { name: "ROOM", category: "DEFAULT" };
  }

  // Priority 1: Search for engineering keywords (Kitchen, Bedroom, etc.)
  for (const txt of textsFound) {
    for (const [category, data] of Object.entries(config.loadFactors)) {
      if (data.keywords.some((keyword) => txt.includes(keyword))) {
        return { name: txt, category };
      }
    }
  }

  // Priority 2: Take first non-numeric, non-tag text
  for (const txt of textsFound) {
    const isNumeric = /^\d+$/.test(txt);
    const isTag = /L2-|DT|DS/.test(txt);

    if (!isNumeric && !isTag) {
      return { name: txt, category: "DEFAULT" };
    }
  }

  // Priority 3: Use first text found
  return { name: textsFound[0], category: "DEFAULT" };
}

/**
 * Detect unit factor by analyzing sample polyline areas
 * If average area is very large, assume millimeters (divide by 1,000,000)
 * Otherwise assume meters (scale 1:1)
 */
function detectUnitFactor(
  polylines: PolylineData[],
  insunits?: number
): {
  factor: number;
  detected: string;
} {
  // Sample first 5 polylines to calculate average area
  const sampleAreas = polylines.slice(0, 5).map((p) => p.rawArea);

  if (sampleAreas.length === 0) {
    return { factor: 1.0, detected: "Meters/Units (Scale 1:1)" };
  }

  const avgArea =
    sampleAreas.reduce((sum, a) => sum + a, 0) / sampleAreas.length;

  // Use config threshold for detection
  const threshold = config.unitDetection?.millimeterThreshold ?? 500000;
  const mmFactor = config.unitDetection?.millimeterFactor ?? 1_000_000.0;

  // If average area > threshold or insunits indicates millimeters (4)
  if (avgArea > threshold || insunits === 4) {
    return {
      factor: mmFactor,
      detected: "Millimeters (Dividing by 1,000,000)",
    };
  }

  return { factor: 1.0, detected: "Meters/Units (Scale 1:1)" };
}

/**
 * Process DXF file and extract room data with enhanced load calculations
 * Improvements:
 * - Automatic unit detection (mm vs m)
 * - Better room identification with keywords
 * - Improved text cleaning
 * - Handles non-closed polylines
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

    // Get INSUNITS from header (if available)
    const insunits =
      typeof dxf.header?.$INSUNITS === "number"
        ? dxf.header.$INSUNITS
        : undefined;

    const texts: TextEntity[] = [];
    const polylines: PolylineData[] = [];

    // Extract TEXT and MTEXT entities with enhanced cleaning
    for (const entity of dxf.entities) {
      if (entity.type === "TEXT" || entity.type === "MTEXT") {
        try {
          const dxfEntity = entity as unknown as DxfEntity;
          const rawText = dxfEntity.text || "";
          const text = cleanText(rawText);
          const position = dxfEntity.position || dxfEntity.startPoint;

          if (text && position) {
            texts.push({
              text,
              point: new Flatten.Point(position.x, position.y),
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
          const dxfEntity = entity as unknown as DxfEntity;
          const vertices = dxfEntity.vertices || [];

          if (vertices.length < 3) {
            continue;
          }

          // Convert vertices to Flatten.js points
          const points = vertices.map(
            (v: { x: number; y: number }) => new Flatten.Point(v.x, v.y)
          );

          // Close the polygon if not already closed (enhancement from Python)
          const firstPoint = points[0];
          const lastPoint = points[points.length - 1];
          if (firstPoint.x !== lastPoint.x || firstPoint.y !== lastPoint.y) {
            points.push(firstPoint);
          }

          // Create Flatten.js polygon
          const poly = new Flatten.Polygon(points);

          // Get raw area (before unit conversion)
          const rawArea = poly.area();

          polylines.push({ polygon: poly, area: rawArea, rawArea });
        } catch (err) {
          // Skip invalid polylines silently
        }
      }
    }

    // Detect unit factor (mm vs m)
    const { factor: unitFactor, detected: unitsDetected } = detectUnitFactor(
      polylines,
      insunits
    );

    console.log(`[Status] Units Detected: ${unitsDetected}`);

    const roomsData: RoomData[] = [];
    let totalLoad = 0;

    // Get minimum room area from config
    const minRoomArea = config.unitDetection?.minimumRoomArea ?? 0.2;

    // Process each polyline to extract room data
    for (const { polygon: poly, rawArea } of polylines) {
      const area = rawArea / unitFactor;

      // Skip very small areas - likely blocks or annotations
      if (area < minRoomArea) {
        continue;
      }

      // Find all text labels inside this polygon
      const textsInside: string[] = [];
      for (const { text, point: pt } of texts) {
        if (poly.contains(pt)) {
          textsInside.push(text);
        }
      }

      // Identify room name and category using enhanced logic
      const { name: roomName, category: roomType } = identifyRoom(textsInside);

      // Get load factors for this room type from config
      const factors =
        config.loadFactors[roomType as keyof typeof config.loadFactors] ||
        config.loadFactors.DEFAULT;

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
        rawArea: Math.round(rawArea * 100) / 100,
        lightingLoad: Math.round(lightingLoad * 100) / 100,
        socketsLoad: Math.round(socketsLoad * 100) / 100,
        totalLoad: Math.round(roomTotal * 100) / 100,
      });
    }

    // Console output similar to Python version
    console.log("\n" + "=".repeat(95));
    console.log(
      `${"Room Name (Your Text)".padEnd(30)} | ${"Raw Area".padEnd(15)} | ${"Area (m2)".padEnd(10)} | ${"Load (W)".padEnd(10)}`
    );
    console.log("-".repeat(95));

    for (const room of roomsData) {
      console.log(
        `${room.name.substring(0, 29).padEnd(30)} | ${room.rawArea.toFixed(2).padEnd(15)} | ${room.area.toFixed(2).padEnd(10)} | ${Math.round(room.totalLoad).toString().padEnd(10)}`
      );
    }

    console.log("=".repeat(95));
    console.log(
      `TOTAL ROOMS: ${roomsData.length} | TOTAL ESTIMATED LOAD: ${convertWattsToKVA(totalLoad).toFixed(2)} kVA`
    );
    console.log("=".repeat(95));

    return {
      success: true,
      rooms: roomsData,
      totalLoad: Math.round(totalLoad * 100) / 100,
      totalRooms: roomsData.length,
      unitsDetected,
      unitFactor,
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
