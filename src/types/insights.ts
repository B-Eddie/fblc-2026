export interface TimeSeriesPoint {
  date: string;
  value: number;
}

export interface DemographicSlice {
  label: string;
  value: number;
  color: string;
}

export interface InsightMetric {
  label: string;
  value: number;
  previousValue: number;
  unit: string;
  trend: "up" | "down" | "stable";
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  category: string;
  confidence: number;
}

export interface InsightsData {
  sentimentOverTime: TimeSeriesPoint[];
  revenueOverTime: TimeSeriesPoint[];
  footTrafficOverTime: TimeSeriesPoint[];
  demographicBreakdown: DemographicSlice[];
  incomeBreakdown: DemographicSlice[];
  topMetrics: InsightMetric[];
  recommendations: Recommendation[];
}
