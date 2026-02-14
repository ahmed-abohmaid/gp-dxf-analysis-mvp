import React from "react";
import { FileText, Zap } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { LoadEstimationResult } from "@/types";
import { formatNumber, formatKVA } from "@/lib/utils";

interface ResultsDisplayProps {
  results: LoadEstimationResult;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  return (
    <div className="space-y-6 results-display">
      {/* Summary Card */}
      <Card className="summary-card border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Total Building Load</CardTitle>
              <CardDescription>
                Calculated from {results.rooms.length} rooms
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-5xl font-bold text-blue-600">
            {formatKVA(results.totalLoad)} kVA
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {formatNumber(results.totalLoad, 0)} Watts
          </p>
        </CardContent>
      </Card>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-gray-600" />
            <CardTitle>Room Load Breakdown</CardTitle>
          </div>
          <CardDescription>
            Detailed electrical load estimation by room
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">#</TableHead>
                <TableHead className="font-semibold">Room Name</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="text-right font-semibold">
                  Area (m²)
                </TableHead>
                <TableHead className="text-right font-semibold">
                  Lighting (W)
                </TableHead>
                <TableHead className="text-right font-semibold">
                  Sockets (W)
                </TableHead>
                <TableHead className="text-right font-semibold">
                  Total Load (W)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.rooms.map((room) => (
                <TableRow key={room.id} className="hover:bg-blue-50/50">
                  <TableCell className="font-medium">{room.id}</TableCell>
                  <TableCell className="font-medium">{room.name}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {room.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatNumber(room.area)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatNumber(room.lightingLoad, 0)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatNumber(room.socketsLoad, 0)}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatNumber(room.totalLoad, 0)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-gray-50 font-semibold">
                <TableCell colSpan={6} className="text-right">
                  Total Building Load:
                </TableCell>
                <TableCell className="text-right text-blue-600">
                  {formatNumber(results.totalLoad, 0)} W
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
