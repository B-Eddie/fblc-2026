import { GeoLocation } from "./business";

export type PersonaType =
  | "budget_student"
  | "affluent_professional"
  | "young_family"
  | "retiree"
  | "foodie_explorer"
  | "health_conscious"
  | "tech_worker"
  | "artist_creative"
  | "busy_parent"
  | "social_butterfly"
  | "eco_activist"
  | "fitness_enthusiast";

export type IncomeCategory =
  | "low"
  | "lower_middle"
  | "middle"
  | "upper_middle"
  | "high";

export type EmotionalTone =
  | "excited"
  | "positive"
  | "neutral"
  | "concerned"
  | "negative"
  | "angry";

export interface AgentPreferences {
  priceSensitivity: number;
  qualityImportance: number;
  convenienceImportance: number;
  socialInfluence: number;
  healthConsciousness: number;
  adventurousness: number;
  brandLoyalty: number;
  preferredCategories: string[];
}

export interface Agent {
  id: string;
  name: string;
  avatar: string;
  age: number;
  persona: PersonaType;
  personaLabel: string;
  occupation: string;
  bio: string;
  incomeCategory: IncomeCategory;
  annualIncome: number;
  location: GeoLocation;
  neighborhood: string;
  distanceToBusinessKm: number;
  preferences: AgentPreferences;
  currentSentiment: number;
  spendingPrediction: number;
  likelihoodToVisit: number;
  visitFrequency: string;
}

export interface AgentReaction {
  id: string;
  agentId: string;
  simulationId: string;
  feedback: string;
  sentiment: number;
  previousSentiment: number;
  likelihoodChange: number;
  spendingChange: number;
  reasoning: string;
  emotionalTone: EmotionalTone;
  timestamp: string;
  tags: string[];
}
