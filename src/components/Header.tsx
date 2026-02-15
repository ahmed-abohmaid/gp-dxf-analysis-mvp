import { RotateCcw } from "lucide-react";
import { Button } from "./ui/button";

interface HeaderProps {
  showReset?: boolean;
  onReset?: () => void;
}

export function Header({ showReset = false, onReset }: HeaderProps) {
  return (
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
                AutoCAD DXF analysis and room-by-room electrical load estimation
              </p>
            </div>
          </div>

          <div className="flex-shrink-0 w-full sm:w-auto">
            {showReset && onReset && (
              <div className="flex justify-center sm:justify-end">
                <Button
                  onClick={onReset}
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
  );
}
