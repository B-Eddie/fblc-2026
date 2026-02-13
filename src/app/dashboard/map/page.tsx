"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Users, MapPin, Building, Eye, EyeOff } from "lucide-react";
import { mockAgents } from "@/data/mock-agents";
import { mockBusinesses } from "@/data/mock-businesses";
import { cn } from "@/lib/utils";
import {
  buildBusinessMarker,
  buildAgentMarker,
} from "@/components/map/LeafletMap";

// Dynamic import to prevent SSR issues with window.L reference
const LeafletMap = dynamic(() => import("@/components/map/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center bg-black border border-white/10 h-full">
      <div className="text-center">
        <div className="w-6 h-6 border border-white/20 border-t-white animate-spin mx-auto mb-3" />
        <p className="text-xs text-white/30 font-mono">Loading map...</p>
      </div>
    </div>
  ),
});

export default function MapPage() {
  const center: [number, number] = [30.2672, -97.7431];
  const [showBusinesses, setShowBusinesses] = useState(true);
  const [showAgents, setShowAgents] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const markers = useMemo(() => {
    const result = [];
    if (showBusinesses) {
      result.push(...mockBusinesses.map(buildBusinessMarker));
    }
    if (showAgents) {
      result.push(...mockAgents.map(buildAgentMarker));
    }
    return result;
  }, [showBusinesses, showAgents]);

  const selectedAgent = mockAgents.find((a) => a.id === selectedId);
  const selectedBiz = mockBusinesses.find((b) => b.id === selectedId);

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-mono font-bold text-white mb-1">
          Market Map
        </h1>
        <p className="text-xs text-white/40 font-mono">
          Geographic view of businesses and customer agents
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-3 text-xs font-mono">
          <button
            onClick={() => setShowBusinesses((v) => !v)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 border transition-all",
              showBusinesses
                ? "bg-white/10 border-white/20 text-white"
                : "bg-white/[0.02] border-white/5 text-white/30"
            )}
          >
            {showBusinesses ? (
              <Eye className="w-3 h-3" />
            ) : (
              <EyeOff className="w-3 h-3" />
            )}
            <div className="w-2.5 h-2.5 bg-white border border-white/30" />
            Businesses ({mockBusinesses.length})
          </button>
          <button
            onClick={() => setShowAgents((v) => !v)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 border transition-all",
              showAgents
                ? "bg-white/10 border-white/20 text-white"
                : "bg-white/[0.02] border-white/5 text-white/30"
            )}
          >
            {showAgents ? (
              <Eye className="w-3 h-3" />
            ) : (
              <EyeOff className="w-3 h-3" />
            )}
            <div className="w-2.5 h-2.5 bg-cyan-400/60 border border-cyan-400/30" />
            Agents ({mockAgents.length})
          </button>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-4 text-xs text-white/40 font-mono">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-green-400" />
            Positive
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-cyan-400" />
            Neutral+
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-amber-400" />
            Neutral-
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-red-400" />
            Negative
          </div>
        </div>
      </div>

      {/* Map */}
      <div
        className="border border-white/10 overflow-hidden flex-1 min-h-0"
        style={{ height: "calc(100vh - 320px)" }}
      >
        <LeafletMap
          center={center}
          zoom={13}
          markers={markers}
          height="100%"
          onMarkerClick={(id) => setSelectedId(id === selectedId ? null : id)}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
        <div className="border border-white/10 bg-black/40 p-4 flex items-center gap-3">
          <Building className="w-6 h-6 text-white/60" />
          <div>
            <div className="text-xl font-mono font-bold">
              {mockBusinesses.length}
            </div>
            <div className="text-xs text-white/30">Businesses tracked</div>
          </div>
        </div>
        <div className="border border-white/10 bg-black/40 p-4 flex items-center gap-3">
          <Users className="w-6 h-6 text-white/60" />
          <div>
            <div className="text-xl font-mono font-bold">
              {mockAgents.length}
            </div>
            <div className="text-xs text-white/30">Customer agents</div>
          </div>
        </div>
        <div className="border border-white/10 bg-black/40 p-4 flex items-center gap-3">
          <MapPin className="w-6 h-6 text-white/60" />
          <div>
            <div className="text-xl font-mono font-bold">
              {new Set(mockAgents.map((a) => a.neighborhood)).size}
            </div>
            <div className="text-xs text-white/30">Neighborhoods</div>
          </div>
        </div>
      </div>
    </div>
  );
}
