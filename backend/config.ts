/**
 * Backend Configuration
 * All configuration values with environment variable support
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

  // DXF Processing - Load Factors (Watts/m²)
  loadFactors: {
    OFFICE: { lighting: 10, sockets: 25 },
    BEDROOM: { lighting: 8, sockets: 20 },
    LIVING: { lighting: 9, sockets: 22 },
    KITCHEN: { lighting: 15, sockets: 35 },
    TOILET: { lighting: 8, sockets: 10 },
    DEFAULT: { lighting: 8, sockets: 15 },
  } as const,

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
