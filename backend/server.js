import express from "express";
import multer from "multer";
import fs from "fs/promises";
import cors from "cors";
import { processDxfFile } from "./dxf-processor.ts";
import config from "./config.ts";

const app = express();

// Create uploads directory if it doesn't exist
await fs.mkdir(config.upload.directory, { recursive: true });

// Configure multer with security limits
const upload = multer({
  dest: config.upload.directory,
  limits: {
    fileSize: config.upload.maxFileSize,
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    const ext = file.originalname
      .toLowerCase()
      .substring(file.originalname.lastIndexOf("."));
    if (config.upload.allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Only ${config.upload.allowedExtensions.join(", ")} files are allowed`
        )
      );
    }
  },
});

// Enable CORS with proper configuration
app.use(cors(config.cors));
app.options("*", cors(config.cors)); // Handle preflight requests
app.use(express.json());

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    message: "DXF Processing API is running",
  });
});

// DXF processing endpoint
app.post("/api/process-dxf", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: "No file uploaded",
    });
  }

  console.log(`Processing file: ${req.file.originalname}`);

  try {
    // Process DXF file using TypeScript processor
    const result = await processDxfFile(req.file.path);

    if (result.success) {
      console.log(
        `Successfully processed: ${result.rooms?.length || 0} rooms found`
      );
    } else {
      console.error("Processing failed:", result.error);
    }

    res.json(result);
  } catch (error) {
    console.error("DXF processing error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process DXF file",
      details: error instanceof Error ? error.message : String(error),
    });
  } finally {
    // Always cleanup uploaded file
    try {
      await fs.unlink(req.file.path);
    } catch (err) {
      console.error("Failed to cleanup file:", err);
    }
  }
});

// Handle multer errors
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: `File too large. Maximum size is ${config.upload.maxFileSize / (1024 * 1024)}MB`,
      });
    }
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }
  next(err);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Not Found",
    message: `Cannot ${req.method} ${req.path}`,
  });
});

// Global error handler
app.use((err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const isOperational =
    err.isOperational !== undefined ? err.isOperational : false;

  // Log error
  if (!isOperational || statusCode >= 500) {
    console.error("Error:", err);
  }

  // Don't leak error details in production
  const message = isOperational ? err.message : "Internal Server Error";
  const isDev =
    typeof process !== "undefined" && process.env.NODE_ENV !== "production";

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(isDev && { stack: err.stack }),
  });
});

app.listen(config.port, () => {
  console.log(`🚀 Backend API server running on port ${config.port}`);
  console.log(`📊 Health check: http://localhost:${config.port}/api/health`);
  console.log(
    `📁 DXF endpoint: http://localhost:${config.port}/api/process-dxf`
  );
});
