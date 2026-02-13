"use client";

import { useState } from "react";
import Image from "next/image";
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
  Sparkles,
  Loader2,
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

const scenarioDescriptions: Record<SimulationType, string> = {
  price_change:
    "Increase all menu prices by 15% to offset rising ingredient costs.",
  new_product:
    "Launch a new seasonal tasting menu at $55 per person with wine pairings.",
  promotion:
    "Offer 20% off for first-time customers through a limited-time social media campaign.",
  hours_change:
    "Extend weekend hours to midnight and add a late-night happy hour menu.",
  quality_change:
    "Switch to 100% organic, locally-sourced ingredients across the entire menu.",
  competitor_opens:
    "A trendy new farm-to-table restaurant opens 2 blocks away with competitive pricing.",
  expansion: "Open a second location in the South Congress neighborhood.",
  menu_change: "Overhaul the menu to focus on plant-based and vegan options.",
};

interface AIReaction {
  agentId: string;
  agentName: string;
  agentAvatar: string;
  agentPersona: string;
  feedback: string;
  sentiment: number;
  sentimentDelta: number;
  emotionalTone: string;
  reasoning: string;
  likelihoodChange: number;
  spendingChange: number;
  tags: string[];
}

interface SimulationSummary {
  averageSentiment: number;
  sentimentDelta: number;
  positiveCount: number;
  negativeCount: number;
  neutralCount: number;
  totalAgents: number;
}

export default function SimulationsPage() {
  const [selectedBusiness, setSelectedBusiness] = useState(
    mockBusinesses[0].id,
  );
  const [selectedScenario, setSelectedScenario] =
    useState<SimulationType | null>(null);
  const [customDescription, setCustomDescription] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [reactions, setReactions] = useState<AIReaction[] | null>(null);
  const [summary, setSummary] = useState<SimulationSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const business = mockBusinesses.find((b) => b.id === selectedBusiness)!;

  const handleRun = async () => {
    if (!selectedScenario) return;
    setIsRunning(true);
    setReactions(null);
    setSummary(null);
    setError(null);
    setProgress(0);

    const description =
      customDescription.trim() || scenarioDescriptions[selectedScenario];

    // Animate progress
    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 8, 90));
    }, 500);

    try {
      const res = await fetch("/api/agents/react", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agents: mockAgents.slice(0, 10),
          business,
          scenarioType: selectedScenario,
          scenarioDescription: description,
        }),
      });

      const data = await res.json();

      if (res.status === 429) {
        const retryAfter = data.retryAfter || 60;
        setError(
          `API rate limit reached. Please wait ~${retryAfter}s before trying again. The free tier has limited requests per minute.`,
        );
        return;
      }

      if (data.error) throw new Error(data.error);

      setProgress(100);
      setReactions(data.reactions);
      setSummary(data.summary);
    } catch {
      setError("Failed to run simulation. Please try again in a moment.");
    } finally {
      clearInterval(progressInterval);
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setReactions(null);
    setSummary(null);
    setSelectedScenario(null);
    setCustomDescription("");
    setProgress(0);
    setError(null);
  };

  const toneToEmoji = (tone: string) => {
    const map: Record<string, string> = {
      excited: "&#x1F929;",
      positive: "&#x1F60A;",
      neutral: "&#x1F610;",
      concerned: "&#x1F914;",
      negative: "&#x1F61F;",
      angry: "&#x1F621;",
    };
    return map[tone] || "&#x1F610;";
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-mono font-bold text-white mb-1 flex items-center gap-3">
          Simulations
          <span className="text-xs px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-normal flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Gemini AI
          </span>
        </h1>
        <p className="text-xs text-white/40 font-mono">
          Test business decisions with AI-powered customer reactions
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
                  onClick={() => {
                    setSelectedScenario(s.type);
                    setCustomDescription("");
                  }}
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

          {/* Custom Description */}
          {selectedScenario && (
            <div className="border border-white/10 bg-black/40 p-5">
              <h3 className="text-xs uppercase tracking-wider text-white/40 mb-3">
                Scenario Details
              </h3>
              <textarea
                value={
                  customDescription || scenarioDescriptions[selectedScenario]
                }
                onChange={(e) => setCustomDescription(e.target.value)}
                rows={3}
                className="w-full bg-white/[0.03] border border-white/10 px-3 py-2 text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors resize-none"
                placeholder="Describe the scenario in detail..."
              />
              <p className="text-xs text-white/20 mt-2">
                Edit to customize what the AI agents will react to
              </p>
            </div>
          )}

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
                  <Loader2 className="w-3 h-3 animate-spin" />
                  AI Processing...
                </>
              ) : (
                <>
                  <Play className="w-3 h-3" />
                  Run AI Simulation
                </>
              )}
            </button>
            {reactions && (
              <button
                onClick={handleReset}
                className="p-3 bg-white/5 text-white/40 hover:text-white/60 transition-colors border border-white/10"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>

          {error && (
            <div className="border border-red-500/30 bg-red-500/5 p-3 text-xs text-red-400">
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          {reactions && summary ? (
            <div className="space-y-4">
              {/* Summary */}
              <div className="border border-white/10 bg-black/40 p-6">
                <h3 className="text-xs uppercase tracking-wider text-white/40 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  AI Simulation Complete
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  <div className="p-4 bg-white/[0.02] border border-white/5 text-center">
                    <div className="text-xs text-white/30 mb-1">
                      Avg Sentiment
                    </div>
                    <div
                      className="text-2xl font-mono font-bold"
                      style={{
                        color:
                          summary.sentimentDelta >= 0 ? "#22c55e" : "#ef4444",
                      }}
                    >
                      {summary.sentimentDelta >= 0 ? "+" : ""}
                      {(summary.sentimentDelta * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="p-4 bg-green-900/20 border border-green-600/30 text-center">
                    <div className="text-xs text-green-400/60 mb-1">
                      Positive
                    </div>
                    <div className="text-2xl font-mono font-bold text-green-400">
                      {summary.positiveCount}
                    </div>
                  </div>
                  <div className="p-4 bg-amber-900/20 border border-amber-500/30 text-center">
                    <div className="text-xs text-amber-400/60 mb-1">
                      Neutral
                    </div>
                    <div className="text-2xl font-mono font-bold text-amber-400">
                      {summary.neutralCount}
                    </div>
                  </div>
                  <div className="p-4 bg-red-900/20 border border-red-500/30 text-center">
                    <div className="text-xs text-red-400/60 mb-1">Negative</div>
                    <div className="text-2xl font-mono font-bold text-red-400">
                      {summary.negativeCount}
                    </div>
                  </div>
                </div>
              </div>

              {/* Individual AI Reactions */}
              <div className="border border-white/10 bg-black/40 p-6">
                <h3 className="text-xs uppercase tracking-wider text-white/40 mb-4 flex items-center gap-2">
                  AI Agent Reactions
                  <span className="text-white/20">
                    ({reactions.length} agents)
                  </span>
                </h3>
                <div className="space-y-3">
                  {reactions.map((r) => {
                    const borderColor =
                      r.sentimentDelta > 0.05
                        ? "border-l-green-400"
                        : r.sentimentDelta < -0.05
                          ? "border-l-red-400"
                          : "border-l-amber-400";
                    return (
                      <div
                        key={r.agentId}
                        className={cn(
                          "p-4 bg-white/[0.02] border border-white/5 border-l-2 hover:bg-white/[0.04] transition-colors",
                          borderColor,
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Image
                              src={r.agentAvatar}
                              alt={r.agentName}
                              width={24}
                              height={24}
                              className="border border-white/10"
                            />
                            <div>
                              <span className="text-xs font-medium">
                                {r.agentName}
                              </span>
                              <span className="text-xs text-white/30 ml-2">
                                {r.agentPersona}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className="text-xs"
                              dangerouslySetInnerHTML={{
                                __html: toneToEmoji(r.emotionalTone),
                              }}
                            />
                            <div
                              className="w-2 h-2"
                              style={{
                                background: sentimentToColor(r.sentiment),
                              }}
                            />
                            <span
                              className="text-xs font-mono"
                              style={{
                                color:
                                  r.sentimentDelta >= 0 ? "#22c55e" : "#ef4444",
                              }}
                            >
                              {r.sentimentDelta >= 0 ? "+" : ""}
                              {(r.sentimentDelta * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-white/60 mb-2">
                          &ldquo;{r.feedback}&rdquo;
                        </p>
                        <p className="text-xs text-white/30 italic mb-2">
                          {r.reasoning}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-1.5 flex-wrap">
                            {r.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-xs px-1.5 py-0.5 bg-white/5 border border-white/10 text-white/30"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-white/30">
                            <span>
                              Visit:{" "}
                              <span
                                className={cn(
                                  "font-mono",
                                  r.likelihoodChange >= 0
                                    ? "text-green-400"
                                    : "text-red-400",
                                )}
                              >
                                {r.likelihoodChange >= 0 ? "+" : ""}
                                {r.likelihoodChange.toFixed(0)}%
                              </span>
                            </span>
                            <span>
                              Spend:{" "}
                              <span
                                className={cn(
                                  "font-mono",
                                  r.spendingChange >= 0
                                    ? "text-green-400"
                                    : "text-red-400",
                                )}
                              >
                                {r.spendingChange >= 0 ? "+$" : "-$"}
                                {Math.abs(r.spendingChange).toFixed(0)}
                              </span>
                            </span>
                          </div>
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
                  <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-6" />
                  <h3 className="text-sm font-mono text-white mb-2">
                    Gemini AI Processing
                  </h3>
                  <p className="text-xs text-white/40 font-mono mb-6">
                    Each agent is analyzing the scenario through their unique
                    persona...
                  </p>
                  {/* Progress bar */}
                  <div className="w-full max-w-xs">
                    <div className="flex justify-between text-xs text-white/30 mb-1">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-1 bg-white/10 w-full">
                      <div
                        className="h-full bg-cyan-400 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  {/* Loading blocks */}
                  <div className="flex gap-0.5 mt-6">
                    {Array.from({ length: 20 }, (_, i) => (
                      <span
                        key={i}
                        className="w-2 h-3 bg-cyan-400/40 animate-pulse"
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
                    Select a business and scenario, then click &ldquo;Run AI
                    Simulation&rdquo; to see how customer personas would react.
                    Powered by Gemini AI for realistic, personalized reactions.
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
