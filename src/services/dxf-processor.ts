import type { LoadEstimationResult, ProcessingError } from "@/types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function uploadDxfFile(file: File): Promise<LoadEstimationResult> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${API_URL}/api/process-dxf`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: `Server error: ${response.status}`,
      }));
      throw new Error(errorData.error || "Failed to process file");
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Processing failed");
    }

    return result;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        `Cannot connect to backend server. Make sure the backend is running at ${API_URL}`
      );
    }
    throw error;
  }
}

export async function processDXFFile(
  file: File
): Promise<LoadEstimationResult> {
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
