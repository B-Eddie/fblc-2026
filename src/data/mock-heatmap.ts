import { Agent } from "@/types/agent";

/**
 * Generates heatmap data points for active and inactive population regions.
 *
 * "Active" = agents with high likelihoodToVisit / sentiment (engaged population)
 * "Inactive" = agents with low likelihoodToVisit / sentiment (disengaged population)
 *
 * Each agent radiates synthetic nearby points to fill out the heatmap.
 */

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateCluster(
  lat: number,
  lng: number,
  intensity: number,
  count: number,
  spread: number,
  rng: () => number,
): [number, number, number][] {
  const points: [number, number, number][] = [];
  // Add the center point
  points.push([lat, lng, intensity]);
  // Add surrounding points to fill the region
  for (let i = 0; i < count; i++) {
    const angle = rng() * Math.PI * 2;
    const dist = rng() * spread;
    const pLat = lat + Math.cos(angle) * dist;
    const pLng = lng + Math.sin(angle) * dist * 1.2; // stretch for lng
    const pIntensity = intensity * (0.3 + rng() * 0.7);
    points.push([pLat, pLng, pIntensity]);
  }
  return points;
}

export function buildHeatmapLayers(agents: Agent[]) {
  const rngActive = seededRandom(42);
  const rngInactive = seededRandom(137);

  const activePoints: [number, number, number][] = [];
  const inactivePoints: [number, number, number][] = [];

  agents.forEach((agent) => {
    // Activity score: combine likelihood and sentiment
    const activity =
      (agent.likelihoodToVisit / 100) * 0.6 +
      agent.currentSentiment * 0.4;

    // Agents go to ONE layer only based on threshold
    if (activity >= 0.5) {
      // Active / engaged agent
      const cluster = generateCluster(
        agent.location.lat,
        agent.location.lng,
        activity,
        Math.round(8 + activity * 12),
        0.008 + activity * 0.006,
        rngActive,
      );
      activePoints.push(...cluster);
    } else {
      // Inactive / disengaged agent
      const inactivity = 1 - activity;
      const cluster = generateCluster(
        agent.location.lat,
        agent.location.lng,
        inactivity,
        Math.round(8 + inactivity * 12),
        0.008 + inactivity * 0.006,
        rngInactive,
      );
      inactivePoints.push(...cluster);
    }
  });

  // Synthetic zones — each zone is EITHER active or inactive, at distinct locations
  const activeZones = [
    { lat: 30.25, lng: -97.75, intensity: 0.7 },
    { lat: 30.28, lng: -97.78, intensity: 0.8 },
    { lat: 30.27, lng: -97.69, intensity: 0.6 },
    { lat: 30.30, lng: -97.76, intensity: 0.9 },
    { lat: 30.295, lng: -97.705, intensity: 0.7 },
  ];

  const inactiveZones = [
    { lat: 30.31, lng: -97.71, intensity: 0.6 },
    { lat: 30.24, lng: -97.72, intensity: 0.7 },
    { lat: 30.22, lng: -97.77, intensity: 0.8 },
    { lat: 30.335, lng: -97.74, intensity: 0.5 },
    { lat: 30.26, lng: -97.685, intensity: 0.6 },
  ];

  activeZones.forEach((zone) => {
    activePoints.push(
      ...generateCluster(zone.lat, zone.lng, zone.intensity, 14, 0.012, rngActive),
    );
  });

  inactiveZones.forEach((zone) => {
    inactivePoints.push(
      ...generateCluster(zone.lat, zone.lng, zone.intensity, 14, 0.012, rngInactive),
    );
  });

  return {
    active: {
      id: "heatmap-active",
      label: "Active Population",
      points: activePoints,
      gradient: {
        0.0: "transparent",
        0.2: "rgba(16, 185, 129, 0.05)",
        0.4: "rgba(6, 182, 212, 0.3)",
        0.6: "rgba(34, 211, 238, 0.5)",
        0.8: "rgba(16, 185, 129, 0.7)",
        1.0: "rgba(52, 211, 153, 0.9)",
      },
      radius: 35,
      blur: 25,
      maxZoom: 17,
      max: 1.0,
      minOpacity: 0.15,
    },
    inactive: {
      id: "heatmap-inactive",
      label: "Inactive Population",
      points: inactivePoints,
      gradient: {
        0.0: "transparent",
        0.2: "rgba(239, 68, 68, 0.05)",
        0.4: "rgba(245, 158, 11, 0.3)",
        0.6: "rgba(251, 146, 60, 0.5)",
        0.8: "rgba(239, 68, 68, 0.7)",
        1.0: "rgba(220, 38, 38, 0.9)",
      },
      radius: 35,
      blur: 25,
      maxZoom: 17,
      max: 1.0,
      minOpacity: 0.15,
    },
  };
}
