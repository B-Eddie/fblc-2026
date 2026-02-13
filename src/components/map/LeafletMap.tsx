"use client";

import { useEffect, useRef, useState } from "react";
import { sentimentToColor } from "@/lib/utils";

// Types for leaflet from CDN (on window.L)
declare global {
  interface Window {
    L: typeof import("leaflet");
  }
}

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  type: "business" | "agent";
  radius?: number;
  color?: string;
  fillColor?: string;
  fillOpacity?: number;
  weight?: number;
  popupContent?: string;
}

interface LeafletMapProps {
  center: [number, number];
  zoom: number;
  markers: MapMarker[];
  height?: string;
  className?: string;
  onMarkerClick?: (id: string) => void;
}

export default function LeafletMap({
  center,
  zoom,
  markers,
  height = "100%",
  className = "",
  onMarkerClick,
}: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const [ready, setReady] = useState(false);

  // Wait for Leaflet CDN to load
  useEffect(() => {
    const check = () => {
      if (window.L) {
        setReady(true);
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!ready || !mapRef.current || mapInstanceRef.current) return;

    const L = window.L;

    const map = L.map(mapRef.current, {
      center,
      zoom,
      scrollWheelZoom: true,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    // Fix map size after container renders
    setTimeout(() => map.invalidateSize(), 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersLayerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  // Update markers
  useEffect(() => {
    if (!ready || !markersLayerRef.current) return;

    const L = window.L;
    const layer = markersLayerRef.current;
    layer.clearLayers();

    markers.forEach((m) => {
      const circle = L.circleMarker([m.lat, m.lng], {
        radius: m.radius ?? (m.type === "business" ? 12 : 6),
        color: m.color ?? (m.type === "business" ? "#ffffff" : "#888888"),
        fillColor: m.fillColor ?? (m.type === "business" ? "#ffffff" : "#888888"),
        fillOpacity: m.fillOpacity ?? (m.type === "business" ? 0.3 : 0.5),
        weight: m.weight ?? (m.type === "business" ? 2 : 1),
      });

      if (m.popupContent) {
        circle.bindPopup(m.popupContent, {
          className: "leaflet-dark-popup",
          closeButton: true,
        });
      }

      if (onMarkerClick) {
        circle.on("click", () => onMarkerClick(m.id));
      }

      circle.addTo(layer);
    });
  }, [ready, markers, onMarkerClick]);

  if (!ready) {
    return (
      <div
        className={`flex items-center justify-center bg-black border border-white/10 ${className}`}
        style={{ height }}
      >
        <div className="text-center">
          <div className="w-6 h-6 border border-white/20 border-t-white animate-spin mx-auto mb-3" />
          <p className="text-xs text-white/30 font-mono">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className={className}
      style={{ height, width: "100%" }}
    />
  );
}

// Helper to build markers from app data
export function buildBusinessMarker(biz: {
  id: string;
  name: string;
  type: string;
  priceRange: string;
  address: string;
  monthlyRevenue: number;
  location: { lat: number; lng: number };
}): MapMarker {
  return {
    id: biz.id,
    lat: biz.location.lat,
    lng: biz.location.lng,
    type: "business",
    radius: 12,
    color: "#ffffff",
    fillColor: "#ffffff",
    fillOpacity: 0.3,
    weight: 2,
    popupContent: `
      <div style="font-family: monospace; font-size: 11px; min-width: 160px;">
        <div style="font-weight: bold; font-size: 13px; margin-bottom: 4px;">${biz.name}</div>
        <div style="opacity: 0.6;">${biz.type} · ${biz.priceRange}</div>
        <div style="opacity: 0.6; margin-top: 2px;">${biz.address}</div>
        <div style="color: #10b981; margin-top: 4px;">$${biz.monthlyRevenue.toLocaleString()}/mo</div>
      </div>
    `,
  };
}

export function buildAgentMarker(agent: {
  id: string;
  name: string;
  personaLabel: string;
  neighborhood: string;
  currentSentiment: number;
  likelihoodToVisit: number;
  location: { lat: number; lng: number };
}): MapMarker {
  const color = sentimentToColor(agent.currentSentiment);
  return {
    id: agent.id,
    lat: agent.location.lat,
    lng: agent.location.lng,
    type: "agent",
    radius: 6,
    color,
    fillColor: color,
    fillOpacity: 0.5,
    weight: 1,
    popupContent: `
      <div style="font-family: monospace; font-size: 11px; min-width: 140px;">
        <div style="font-weight: bold; margin-bottom: 2px;">${agent.name}</div>
        <div style="opacity: 0.6;">${agent.personaLabel}</div>
        <div style="opacity: 0.6;">${agent.neighborhood}</div>
        <div style="margin-top: 4px;">
          <span style="opacity: 0.5;">Sentiment:</span>
          <span style="color: ${color}; font-weight: bold;"> ${(agent.currentSentiment * 100).toFixed(0)}%</span>
        </div>
        <div>
          <span style="opacity: 0.5;">Visit likelihood:</span>
          <span style="font-weight: bold;"> ${agent.likelihoodToVisit}%</span>
        </div>
      </div>
    `,
  };
}
