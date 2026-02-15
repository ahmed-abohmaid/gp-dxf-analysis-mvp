import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { FileUpload } from "./features/upload/FileUpload";
import { ResultsDisplay } from "./features/results/ResultsDisplay";
import { Button } from "./components/ui/button";
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
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-center sm:text-left">
              <div className="p-2 bg-white rounded-lg shadow-lg ring-1 ring-gray-200 mx-auto sm:mx-0">
                <img
                  src="/asu-logo.webp"
                  alt="Ain Shams University logo — Electrical Load Estimation Dashboard"
                  className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                  Ain Shams University Electrical Load Estimator MVP
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 hidden sm:block">
                  Ain Shams University Electrical Engineering senior design:
                  AutoCAD DXF analysis and room-by-room electrical load
                  estimation
                </p>
              </div>
            </div>

            <div className="flex-shrink-0 w-full sm:w-auto">
              {results && (
                <div className="flex justify-center sm:justify-end">
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    size="lg"
                    className="gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    New Analysis
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
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

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/50 backdrop-blur-sm mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            Built for Ain Shams University — GP (Spring 2026)
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
