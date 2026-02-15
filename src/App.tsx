import { useState } from "react";
import { FileUpload } from "./features/upload/FileUpload";
import { ResultsDisplay } from "./features/results/ResultsDisplay";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import { processDXFFile } from "./lib/dxf-processor";
import type { LoadEstimationResult } from "./types";

function App() {
  const [results, setResults] = useState<LoadEstimationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setError(null);

    try {
      const processedResults = await processDXFFile(file);
      setResults(processedResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <Header showReset={!!results} onReset={handleReset} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!results ? (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Upload Your AutoCAD DXF for Load Estimation
              </h2>
              <p className="text-gray-600">
                Upload a DXF file to run automated room-by-room electrical load
                calculations (lighting & socket loads)
              </p>
            </div>
            <FileUpload
              onFileSelect={handleFileSelect}
              isProcessing={isProcessing}
            />
          </div>
        ) : (
          <ResultsDisplay results={results} />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
