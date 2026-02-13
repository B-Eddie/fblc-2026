import { AgentReaction } from "./agent";

export type SimulationType =
  | "price_change"
  | "new_product"
  | "expansion"
  | "menu_change"
  | "promotion"
  | "hours_change"
  | "quality_change"
  | "competitor_opens";

export interface SimulationChange {
  type: string;
  target: string;
  before: string | number;
  after: string | number;
  description: string;
}

export interface SimulationConfig {
  type: SimulationType;
  label: string;
  description: string;
  icon: string;
  changes: SimulationChange[];
}

export interface SimulationSummary {
  averageSentiment: number;
  sentimentDelta: number;
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  projectedRevenueImpact: number;
  projectedFootTrafficChange: number;
  projectedMonthlyRevenueChange: number;
  topConcerns: string[];
  topPositives: string[];
  recommendations: string[];
  riskLevel: "low" | "medium" | "high";
}

export interface Simulation {
  id: string;
  businessId: string;
  type: SimulationType;
  config: SimulationConfig;
  reactions: AgentReaction[];
  summary: SimulationSummary;
  timestamp: string;
  status: "pending" | "running" | "complete";
}
