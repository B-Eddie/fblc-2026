import { GeoLocation } from "./business";

export interface NeighborhoodDemographics {
  population: number;
  medianIncome: number;
  medianAge: number;
  predominantType: string;
  density: "low" | "medium" | "high";
  growthRate: number;
}

export interface Neighborhood {
  id: string;
  name: string;
  bounds: [number, number][];
  center: GeoLocation;
  demographics: NeighborhoodDemographics;
  color: string;
  agentCount: number;
}

export type MapLayer =
  | "demographics"
  | "income"
  | "density"
  | "sentiment"
  | "agents";
