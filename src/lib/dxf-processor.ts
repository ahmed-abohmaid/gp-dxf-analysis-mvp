import type { LoadEstimationResult, ProcessingError } from "@/types";

// Get API URL from environment variable or default to local backend
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Upload DXF file to backend for processing
 */
async function uploadDxfFile(file: File): Promise<LoadEstimationResult> {
  // Create FormData and append the file
  const formData = new FormData();
  formData.append("file", file);

  try {
    // Send file to backend API
    const response = await fetch(`${API_URL}/api/process-dxf`, {
      method: "POST",
      body: formData,
    });

    // Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: `Server error: ${response.status}`,
      }));
      throw new Error(errorData.error || "Failed to process file");
    }

    // Parse and return the result
    const result = await response.json();

    // Check if processing was successful
    if (!result.success) {
      throw new Error(result.error || "Processing failed");
    }

    return result;
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Cannot connect to backend server. Make sure the backend is running at " +
          API_URL
      );
    }
    throw error;
  }
}

/**
 * Process a DXF file and return load estimation results
 */
export async function processDXFFile(
  file: File
): Promise<LoadEstimationResult> {
  // Validate file type
  if (!file.name.endsWith(".dxf")) {
    throw new Error("Invalid file type. Please upload a DXF file.");
  }

  try {
    return await uploadDxfFile(file);
  } catch (error) {
    const err = error as ProcessingError;
    throw new Error(err.message || "Failed to process DXF file");
  }
}
