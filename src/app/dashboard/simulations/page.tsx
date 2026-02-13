"use client";

import { useState } from "react";
import {
  Zap,
  DollarSign,
  ShoppingBag,
  Clock,
  Tag,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Play,
  RotateCcw,
} from "lucide-react";
import { mockBusinesses } from "@/data/mock-businesses";
import { mockAgents } from "@/data/mock-agents";
import { cn, sentimentToColor, sentimentToLabel } from "@/lib/utils";
import { SimulationType } from "@/types/simulation";

const scenarioTypes: {
  type: SimulationType;
  label: string;
  description: string;
  icon: typeof DollarSign;
}[] = [
  {
    type: "price_change",
    label: "Price Change",
    description: "Adjust pricing on one or more items",
    icon: DollarSign,
  },
  {
    type: "new_product",
    label: "New Product",
    description: "Launch a new product or menu item",
    icon: ShoppingBag,
  },
  {
    type: "promotion",
    label: "Run Promotion",
    description: "Create a limited-time offer or discount",
    icon: Tag,
  },
  {
    type: "hours_change",
    label: "Hours Change",
    description: "Modify business operating hours",
    icon: Clock,
  },
  {
    type: "quality_change",
    label: "Quality Change",
    description: "Upgrade or change ingredient quality",
    icon: TrendingUp,
  },
  {
    type: "competitor_opens",
    label: "Competitor Opens",
    description: "Simulate a new competitor entering",
    icon: AlertTriangle,
  },
];

interface SimulationResult {
  agentId: string;
  agentName: string;
  sentiment: number;
  previousSentiment: number;
  feedback: string;
  likelihoodChange: number;
}

function generateMockResults(
  businessId: string,
  scenarioType: SimulationType,
): SimulationResult[] {
  return mockAgents.slice(0, 10).map((agent) => {
    const baseDelta =
      scenarioType === "price_change"
        ? -0.1
        : scenarioType === "new_product"
          ? 0.15
          : 0.05;
    const personalizedDelta =
      baseDelta * (1 - agent.preferences.priceSensitivity) +
      (Math.random() - 0.5) * 0.2;
    const newSentiment = Math.max(
      -1,
      Math.min(1, agent.currentSentiment + personalizedDelta),
    );

    const feedbacks: Record<SimulationType, string[]> = {
      price_change: [
        "The price increase makes it harder to justify frequent visits.",
        "I understand quality comes at a cost. Still worth it.",
        "Might switch to cheaper alternatives if prices keep rising.",
      ],
      new_product: [
        "Excited to try something new! This sounds right up my alley.",
        "Interesting addition but not sure it fits the existing vibe.",
        "Love that they're innovating and keeping the menu fresh.",
      ],
      promotion: [
        "Great deal! Will definitely take advantage of this.",
        "Promotions always draw me in. Smart marketing move.",
        "Nice incentive to visit more often.",
      ],
      hours_change: [
        "Extended hours would be great for my schedule.",
        "Earlier closing might mean I can't make it after work.",
        "Weekend hours change doesn't affect me much.",
      ],
      quality_change: [
        "Premium ingredients are always worth the investment.",
        "Quality upgrade might mean higher prices. Cautiously optimistic.",
        "This is the kind of commitment to quality I respect.",
      ],
      competitor_opens: [
        "I'll check out the competition, but loyalty runs deep.",
        "More options are always welcome. Competition is healthy.",
        "Worried this might affect my favorite spot's quality.",
      ],
      expansion: [
        "A new location closer to me would be amazing!",
        "Hope they can maintain quality with expansion.",
        "This shows the business is thriving.",
      ],
      menu_change: [
        "Love the new menu direction!",
        "Hope my favorites are still available.",
        "Change is good as long as quality stays.",
      ],
    };

    const feedbackOptions = feedbacks[scenarioType] || feedbacks.new_product;

    return {
      agentId: agent.id,
      agentName: agent.name,
      sentiment: newSentiment,
      previousSentiment: agent.currentSentiment,
      feedback:
        feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)],
      likelihoodChange: personalizedDelta * 30,
    };
  });
}

export default function SimulationsPage() {
  const [selectedBusiness, setSelectedBusiness] = useState(
    mockBusinesses[0].id,
  );
  const [selectedScenario, setSelectedScenario] =
    useState<SimulationType | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<SimulationResult[] | null>(null);

  const handleRun = () => {
    if (!selectedScenario) return;
    setIsRunning(true);
    setResults(null);
    setTimeout(() => {
      setResults(generateMockResults(selectedBusiness, selectedScenario));
      setIsRunning(false);
    }, 2000);
  };

  const handleReset = () => {
    setResults(null);
    setSelectedScenario(null);
  };

  const avgSentimentDelta = results
    ? results.reduce((sum, r) => sum + (r.sentiment - r.previousSentiment), 0) /
      results.length
    : 0;

  const positiveCount = results
    ? results.filter((r) => r.sentiment > r.previousSentiment).length
    : 0;
  const negativeCount = results
    ? results.filter((r) => r.sentiment < r.previousSentiment).length
    : 0;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-mono font-bold text-white mb-1">
          Simulations
        </h1>
        <p className="text-xs text-white/40 font-mono">
          Test business decisions against customer personas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Config Panel */}
        <div className="space-y-4">
          {/* Business Selector */}
          <div className="border border-white/10 bg-black/40 p-5">
            <h3 className="text-xs uppercase tracking-wider text-white/40 mb-3">
              Select Business
            </h3>
            <div className="space-y-2">
              {mockBusinesses.map((biz) => (
                <button
                  key={biz.id}
                  onClick={() => setSelectedBusiness(biz.id)}
                  className={cn(
                    "w-full text-left p-3 text-xs transition-all",
                    selectedBusiness === biz.id
                      ? "bg-white/10 text-white border border-white/20"
                      : "bg-white/[0.02] text-white/60 hover:bg-white/[0.05] border border-transparent",
                  )}
                >
                  <div className="font-medium">{biz.name}</div>
                  <div className="text-white/30 mt-0.5">
                    {biz.type} &middot; {biz.priceRange}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Scenario Picker */}
          <div className="border border-white/10 bg-black/40 p-5">
            <h3 className="text-xs uppercase tracking-wider text-white/40 mb-3">
              Choose Scenario
            </h3>
            <div className="space-y-2">
              {scenarioTypes.map((s) => (
                <button
                  key={s.type}
                  onClick={() => setSelectedScenario(s.type)}
                  className={cn(
                    "w-full text-left p-3 transition-all",
                    selectedScenario === s.type
                      ? "bg-white/10 border border-white/20"
                      : "bg-white/[0.02] hover:bg-white/[0.05] border border-transparent",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <s.icon className="w-3 h-3 text-white/60" />
                    <span className="text-xs font-medium">{s.label}</span>
                  </div>
                  <p className="text-xs text-white/30 mt-1 ml-5">
                    {s.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Run Button */}
          <div className="flex gap-2">
            <button
              onClick={handleRun}
              disabled={!selectedScenario || isRunning}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 text-xs font-mono font-medium transition-all",
                selectedScenario && !isRunning
                  ? "bg-white text-black hover:bg-white/90"
                  : "bg-white/5 text-white/20 cursor-not-allowed border border-white/5",
              )}
            >
              {isRunning ? (
                <>
                  <div className="w-3 h-3 border border-black/30 border-t-black animate-spin" />
                  Simulating...
                </>
              ) : (
                <>
                  <Play className="w-3 h-3" />
                  Run Simulation
                </>
              )}
            </button>
            {results && (
              <button
                onClick={handleReset}
                className="p-3 bg-white/5 text-white/40 hover:text-white/60 transition-colors border border-white/10"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          {results ? (
            <div className="space-y-4">
              {/* Summary */}
              <div className="border border-white/10 bg-black/40 p-6">
                <h3 className="text-xs uppercase tracking-wider text-white/40 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  Simulation Complete
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 bg-white/[0.02] border border-white/5 text-center">
                    <div className="text-xs text-white/30 mb-1">
                      Avg Sentiment
                    </div>
                    <div
                      className="text-2xl font-mono font-bold"
                      style={{
                        color: avgSentimentDelta >= 0 ? "#22c55e" : "#ef4444",
                      }}
                    >
                      {avgSentimentDelta >= 0 ? "+" : ""}
                      {(avgSentimentDelta * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="p-4 bg-green-900/20 border border-green-600/30 text-center">
                    <div className="text-xs text-green-400/60 mb-1">
                      Positive
                    </div>
                    <div className="text-2xl font-mono font-bold text-green-400">
                      {positiveCount}
                    </div>
                  </div>
                  <div className="p-4 bg-red-900/20 border border-red-500/30 text-center">
                    <div className="text-xs text-red-400/60 mb-1">Negative</div>
                    <div className="text-2xl font-mono font-bold text-red-400">
                      {negativeCount}
                    </div>
                  </div>
                </div>
              </div>

              {/* Individual Reactions */}
              <div className="border border-white/10 bg-black/40 p-6">
                <h3 className="text-xs uppercase tracking-wider text-white/40 mb-4">
                  Agent Reactions
                </h3>
                <div className="space-y-2">
                  {results.map((r) => {
                    const delta = r.sentiment - r.previousSentiment;
                    const borderColor =
                      delta >= 0 ? "border-l-green-400" : "border-l-red-400";
                    return (
                      <div
                        key={r.agentId}
                        className={cn(
                          "p-4 bg-white/[0.02] border border-white/5 border-l-2 hover:bg-white/[0.04] transition-colors",
                          borderColor,
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium">
                            {r.agentName}
                          </span>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2 h-2"
                              style={{
                                background: sentimentToColor(r.sentiment),
                              }}
                            />
                            <span
                              className="text-xs font-mono"
                              style={{
                                color: delta >= 0 ? "#22c55e" : "#ef4444",
                              }}
                            >
                              {delta >= 0 ? "+" : ""}
                              {(delta * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-white/50">
                          &ldquo;{r.feedback}&rdquo;
                        </p>
                        <div className="mt-2 text-xs text-white/20">
                          {sentimentToLabel(r.previousSentiment)} →{" "}
                          {sentimentToLabel(r.sentiment)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-white/10 bg-black/40 p-16 flex flex-col items-center justify-center text-center min-h-[500px]">
              {isRunning ? (
                <>
                  <div className="w-8 h-8 border border-white/20 border-t-white animate-spin mb-6" />
                  <h3 className="text-sm font-mono text-white mb-2">
                    Running Simulation
                  </h3>
                  <p className="text-xs text-white/40 font-mono">
                    Processing agent reactions to your scenario...
                  </p>
                  {/* Loading blocks */}
                  <div className="flex gap-0.5 mt-6">
                    {Array.from({ length: 20 }, (_, i) => (
                      <span
                        key={i}
                        className="w-2 h-3 bg-white animate-pulse-glow"
                        style={{ animationDelay: `${i * 100}ms` }}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <Zap className="w-12 h-12 text-white/10 mb-4" />
                  <h3 className="text-sm font-mono text-white/30 mb-2">
                    No simulation results yet
                  </h3>
                  <p className="text-xs text-white/20 max-w-md font-mono">
                    Select a business and scenario, then click &ldquo;Run
                    Simulation&rdquo; to see how customer personas would react
                    to your business decision.
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
