"use client";

import dynamic from "next/dynamic";
import { Users, MapPin, Building } from "lucide-react";
import { mockAgents } from "@/data/mock-agents";
import { mockBusinesses } from "@/data/mock-businesses";
import { sentimentToColor, formatCurrency } from "@/lib/utils";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const CircleMarker = dynamic(
  () => import("react-leaflet").then((mod) => mod.CircleMarker),
  { ssr: false },
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

export default function MapPage() {
  const center: [number, number] = [30.2672, -97.7431];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-mono font-bold text-white mb-1">
          Market Map
        </h1>
        <p className="text-xs text-white/40 font-mono">
          Geographic view of businesses and customer agents
        </p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mb-4 text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-white" />
          <span className="text-white/50">Businesses</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-white/40" />
          <span className="text-white/50">Agents (by sentiment)</span>
        </div>
      </div>

      <div
        className="border border-white/10 overflow-hidden"
        style={{ height: "calc(100vh - 240px)" }}
      >
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Business markers */}
          {mockBusinesses.map((biz) => (
            <CircleMarker
              key={biz.id}
              center={[biz.location.lat, biz.location.lng]}
              radius={12}
              pathOptions={{
                color: "#ffffff",
                fillColor: "#ffffff",
                fillOpacity: 0.3,
                weight: 2,
              }}
            >
              <Popup>
                <div className="text-xs font-mono">
                  <div className="font-bold text-sm mb-1">{biz.name}</div>
                  <div className="text-white/60">
                    {biz.type} &middot; {biz.priceRange}
                  </div>
                  <div className="text-white/60 mt-1">{biz.address}</div>
                  <div className="text-green-400 mt-1">
                    {formatCurrency(biz.monthlyRevenue)}/mo
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}

          {/* Agent markers */}
          {mockAgents.map((agent) => (
            <CircleMarker
              key={agent.id}
              center={[agent.location.lat, agent.location.lng]}
              radius={6}
              pathOptions={{
                color: sentimentToColor(agent.currentSentiment),
                fillColor: sentimentToColor(agent.currentSentiment),
                fillOpacity: 0.5,
                weight: 1,
              }}
            >
              <Popup>
                <div className="text-xs font-mono">
                  <div className="font-bold">{agent.name}</div>
                  <div className="text-white/60">{agent.personaLabel}</div>
                  <div className="text-white/60">{agent.neighborhood}</div>
                  <div className="mt-1">
                    Sentiment: {(agent.currentSentiment * 100).toFixed(0)}%
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
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
