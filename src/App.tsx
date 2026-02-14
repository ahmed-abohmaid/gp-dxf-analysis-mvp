import { useState } from "react";
import { Lightbulb, RotateCcw } from "lucide-react";
import { FileUpload } from "./features/upload/FileUpload";
import { ResultsDisplay } from "./features/results/ResultsDisplay";
import { Button } from "./components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import { DXFProcessorService } from "./lib/dxf-processor";
import type { LoadEstimationResult } from "./types";

function App() {
  const [results, setResults] = useState<LoadEstimationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setError(null);

    try {
      const processedResults = await DXFProcessorService.processDXFFile(file);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-lg">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Electrical Load Estimator
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  AutoCAD DXF Analysis Dashboard
                </p>
              </div>
            </div>
            {results && (
              <Button
                onClick={handleReset}
                variant="outline"
                size="lg"
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                New Analysis
              </Button>
            )}
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
                Upload Your DXF File
              </h2>
              <p className="text-gray-600">
                Upload an AutoCAD DXF file to automatically calculate electrical
                load estimation for all rooms
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
            Built for Graduation Project • Fall 2025
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
