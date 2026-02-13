"use client";

import { useState } from "react";
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  Target,
  Lightbulb,
  Loader2,
  RefreshCw,
  DollarSign,
  Sparkles,
} from "lucide-react";
import { Agent } from "@/types/agent";
import { Business } from "@/types/business";
import { cn } from "@/lib/utils";

interface SegmentInsight {
  segment: string;
  size: number;
  avgSentiment: number;
  insight: string;
}

interface InsightData {
  summary: string;
  keyDrivers: string[];
  risks: string[];
  opportunities: string[];
  recommendedActions: string[];
  segmentInsights: SegmentInsight[];
  revenueAtRisk: number;
  growthPotential: number;
}

interface AgentInsightPanelProps {
  agents: Agent[];
  business: Business;
}

export default function AgentInsightPanel({
  agents,
  business,
}: AgentInsightPanelProps) {
  const [insights, setInsights] = useState<InsightData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateInsights = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/agents/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agents, business }),
      });

      const data = await res.json();

      if (res.status === 429) {
        const retryAfter = data.retryAfter || 60;
        setError(`Rate limited. Please wait ~${retryAfter}s and try again.`);
        return;
      }

      if (data.error) throw new Error(data.error);
      setInsights(data);
    } catch {
      setError(
        "Failed to generate insights. Please wait a moment and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!insights && !isLoading) {
    return (
      <div className="border border-white/10 bg-black/40 p-8 flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 border border-white/10 bg-white/[0.02] flex items-center justify-center mb-4">
          <Brain className="w-6 h-6 text-white/20" />
        </div>
        <h3 className="text-sm font-mono text-white/40 mb-2">
          AI Customer Insights
        </h3>
        <p className="text-xs text-white/20 mb-6 max-w-sm">
          Use Gemini AI to analyze your customer base and generate strategic
          recommendations based on agent behavior patterns.
        </p>
        <button
          onClick={generateInsights}
          className="flex items-center gap-2 px-4 py-2.5 bg-white text-black text-xs font-mono font-medium hover:bg-white/90 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Generate AI Insights
        </button>
        {error && <p className="text-xs text-red-400 mt-3">{error}</p>}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="border border-white/10 bg-black/40 p-12 flex flex-col items-center justify-center text-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-4" />
        <h3 className="text-sm font-mono text-white mb-2">
          Analyzing Personas
        </h3>
        <p className="text-xs text-white/40">
          Gemini is analyzing {agents.length} customer agents...
        </p>
        <div className="flex gap-0.5 mt-6">
          {Array.from({ length: 16 }, (_, i) => (
            <span
              key={i}
              className="w-2 h-3 bg-cyan-400/60 animate-pulse"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!insights) return null;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="border border-cyan-500/20 bg-cyan-500/5 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs uppercase tracking-wider text-cyan-400/80 flex items-center gap-2">
            <Brain className="w-3 h-3" />
            AI Analysis
          </h3>
          <button
            onClick={generateInsights}
            className="p-1.5 hover:bg-white/10 transition-colors text-white/30 hover:text-white"
            title="Regenerate insights"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
        <p className="text-xs text-white/60 leading-relaxed">
          {insights.summary}
        </p>
      </div>

      {/* Revenue Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="border border-red-500/20 bg-red-500/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-3 h-3 text-red-400" />
            <span className="text-xs text-red-400/60 uppercase tracking-wider">
              Revenue at Risk
            </span>
          </div>
          <div className="text-xl font-mono font-bold text-red-400">
            ${insights.revenueAtRisk.toLocaleString()}
          </div>
          <div className="text-xs text-red-400/40 mt-0.5">per month</div>
        </div>
        <div className="border border-green-500/20 bg-green-500/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-3 h-3 text-green-400" />
            <span className="text-xs text-green-400/60 uppercase tracking-wider">
              Growth Potential
            </span>
          </div>
          <div className="text-xl font-mono font-bold text-green-400">
            ${insights.growthPotential.toLocaleString()}
          </div>
          <div className="text-xs text-green-400/40 mt-0.5">per month</div>
        </div>
      </div>

      {/* Key Drivers */}
      <div className="border border-white/10 bg-black/40 p-5">
        <h3 className="text-xs uppercase tracking-wider text-white/40 mb-3 flex items-center gap-2">
          <TrendingUp className="w-3 h-3" />
          Key Drivers
        </h3>
        <div className="space-y-1.5">
          {insights.keyDrivers.map((driver, i) => (
            <div
              key={i}
              className="flex items-start gap-2 text-xs text-white/50"
            >
              <span className="text-white/20 font-mono mt-0.5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{driver}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Risks & Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="border border-white/10 bg-black/40 p-5">
          <h3 className="text-xs uppercase tracking-wider text-red-400/60 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-3 h-3" />
            Risks
          </h3>
          <div className="space-y-1.5">
            {insights.risks.map((risk, i) => (
              <div
                key={i}
                className="text-xs text-white/40 flex items-start gap-2"
              >
                <span className="text-red-400/40 mt-0.5">&#x25A0;</span>
                <span>{risk}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="border border-white/10 bg-black/40 p-5">
          <h3 className="text-xs uppercase tracking-wider text-green-400/60 mb-3 flex items-center gap-2">
            <Target className="w-3 h-3" />
            Opportunities
          </h3>
          <div className="space-y-1.5">
            {insights.opportunities.map((opp, i) => (
              <div
                key={i}
                className="text-xs text-white/40 flex items-start gap-2"
              >
                <span className="text-green-400/40 mt-0.5">&#x25A0;</span>
                <span>{opp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Actions */}
      <div className="border border-white/10 bg-black/40 p-5">
        <h3 className="text-xs uppercase tracking-wider text-white/40 mb-3 flex items-center gap-2">
          <Lightbulb className="w-3 h-3" />
          Recommended Actions
        </h3>
        <div className="space-y-2">
          {insights.recommendedActions.map((action, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-2.5 bg-white/[0.02] border border-white/5"
            >
              <span className="text-xs font-mono text-white/20 mt-0.5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-xs text-white/60">{action}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Segment Insights */}
      {insights.segmentInsights && insights.segmentInsights.length > 0 && (
        <div className="border border-white/10 bg-black/40 p-5">
          <h3 className="text-xs uppercase tracking-wider text-white/40 mb-3">
            Customer Segments
          </h3>
          <div className="space-y-2">
            {insights.segmentInsights.map((seg, i) => (
              <div
                key={i}
                className="p-3 bg-white/[0.02] border border-white/5"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-white/70">
                    {seg.segment}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/30">
                      {seg.size} agents
                    </span>
                    <div
                      className={cn(
                        "w-2 h-2",
                        seg.avgSentiment > 0.3
                          ? "bg-green-400"
                          : seg.avgSentiment > 0
                            ? "bg-cyan-400"
                            : seg.avgSentiment > -0.3
                              ? "bg-amber-400"
                              : "bg-red-400",
                      )}
                    />
                  </div>
                </div>
                <p className="text-xs text-white/40">{seg.insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
