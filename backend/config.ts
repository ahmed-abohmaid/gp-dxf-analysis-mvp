/**
 * Backend Configuration
 * Enhanced with more room types and better load factors
 */

export const config = {
  // Server Configuration
  port: parseInt(process.env.PORT || "5000", 10),

  // File Upload Configuration
  upload: {
    directory: process.env.UPLOAD_DIR || "uploads",
    maxFileSize: parseInt(
      process.env.MAX_FILE_SIZE || String(10 * 1024 * 1024),
      10
    ), // 10MB default
    allowedExtensions: [".dxf"],
    timeout: parseInt(process.env.PROCESSING_TIMEOUT || "30000", 10), // 30 seconds
  },

  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",")
      : ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  },

  // DXF Processing - Enhanced Load Factors (Watts/m²) with Keywords
  loadFactors: {
    OFFICE: {
      lighting: 12,
      sockets: 25,
      keywords: ["OFFICE", "STUDY", "WORK"],
    },
    BEDROOM: {
      lighting: 8,
      sockets: 20,
      keywords: ["BEDROOM", "SLEEP", "M.BED", "ROOM", "BED"],
    },
    LIVING: {
      lighting: 10,
      sockets: 25,
      keywords: ["LIVING", "SITTING", "HALL", "RECEPTION"],
    },
    KITCHEN: {
      lighting: 12,
      sockets: 50,
      keywords: ["KITCHEN", "COOK"],
    },
    TOILET: {
      lighting: 7,
      sockets: 10,
      keywords: ["TOILET", "BATH", "WC", "POWDER", "BATHROOM"],
    },
    STAIR: {
      lighting: 5,
      sockets: 5,
      keywords: ["STAIR", "LOBBY", "CORRIDOR", "FIRE LOBBY"],
    },
    STORAGE: {
      lighting: 5,
      sockets: 5,
      keywords: ["STORE", "PANTY", "LAUNDRY", "WIC", "BALCONY"],
    },
    DEFAULT: {
      lighting: 8,
      sockets: 15,
      keywords: [],
    },
  } as const,

  // Unit Detection Settings
  unitDetection: {
    millimeterThreshold: 500000, // If avg area > this, assume millimeters
    millimeterFactor: 1_000_000.0, // Conversion factor for mm² to m²
    minimumRoomArea: 0.2, // Minimum area in m² to be considered a room
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(
      process.env.RATE_LIMIT_WINDOW || String(15 * 60 * 1000),
      10
    ), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
  },
} as const;

export default config;
