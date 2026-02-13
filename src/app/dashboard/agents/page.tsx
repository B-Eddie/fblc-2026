"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Users,
  Search,
  SlidersHorizontal,
  MapPin,
  MessageSquare,
  Brain,
  Sparkles,
} from "lucide-react";
import { mockAgents } from "@/data/mock-agents";
import { mockBusinesses } from "@/data/mock-businesses";
import { Agent } from "@/types/agent";
import {
  cn,
  formatCurrency,
  sentimentToColor,
  sentimentToLabel,
} from "@/lib/utils";
import AgentChat from "@/components/agents/AgentChat";
import AgentInsightPanel from "@/components/agents/AgentInsightPanel";

const personaFilters = [
  "All",
  "budget_student",
  "affluent_professional",
  "young_family",
  "retiree",
  "foodie_explorer",
  "health_conscious",
  "tech_worker",
  "artist_creative",
  "busy_parent",
  "social_butterfly",
  "eco_activist",
  "fitness_enthusiast",
] as const;

const personaLabels: Record<string, string> = {
  budget_student: "Student",
  affluent_professional: "Professional",
  young_family: "Family",
  retiree: "Retiree",
  foodie_explorer: "Foodie",
  health_conscious: "Health",
  tech_worker: "Tech",
  artist_creative: "Artist",
  busy_parent: "Parent",
  social_butterfly: "Social",
  eco_activist: "Eco",
  fitness_enthusiast: "Fitness",
};

type RightPanel = "profile" | "chat" | "insights";

function BlockPreferenceBar({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  const total = 10;
  const filled = Math.round(value * total);
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-white/30 w-28 shrink-0">{label}</span>
      <div className="flex gap-0.5 flex-1">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={cn("w-2 h-3", i < filled ? "bg-white" : "bg-white/10")}
          />
        ))}
      </div>
      <span className="text-xs font-mono text-white/30 w-8 text-right">
        {(value * 100).toFixed(0)}
      </span>
    </div>
  );
}

export default function AgentsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("All");
  const [selected, setSelected] = useState<Agent | null>(null);
  const [rightPanel, setRightPanel] = useState<RightPanel>("profile");

  const business = mockBusinesses[0];

  const filteredAgents = mockAgents
    .filter((a) => {
      if (filter !== "All" && a.persona !== filter) return false;
      if (
        search &&
        !a.name.toLowerCase().includes(search.toLowerCase()) &&
        !a.occupation.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    })
    .sort((a, b) => b.likelihoodToVisit - a.likelihoodToVisit);

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-mono font-bold text-white mb-1 flex items-center gap-3">
            Customer Agents
            <span className="text-xs px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-normal">
              AI-Powered
            </span>
          </h1>
          <p className="text-xs text-white/40 font-mono">
            Chat with AI agents, generate insights, and understand customer
            personas
          </p>
        </div>

        {/* Panel Toggle */}
        <div className="flex gap-1 bg-white/[0.02] border border-white/10 p-0.5">
          <button
            onClick={() => setRightPanel("profile")}
            className={cn(
              "px-3 py-1.5 text-xs font-mono transition-all flex items-center gap-1.5",
              rightPanel === "profile"
                ? "bg-white/10 text-white"
                : "text-white/40 hover:text-white/60",
            )}
          >
            <Users className="w-3 h-3" />
            Profile
          </button>
          <button
            onClick={() => setRightPanel("chat")}
            className={cn(
              "px-3 py-1.5 text-xs font-mono transition-all flex items-center gap-1.5",
              rightPanel === "chat"
                ? "bg-cyan-500/20 text-cyan-400"
                : "text-white/40 hover:text-white/60",
            )}
          >
            <MessageSquare className="w-3 h-3" />
            Chat
          </button>
          <button
            onClick={() => setRightPanel("insights")}
            className={cn(
              "px-3 py-1.5 text-xs font-mono transition-all flex items-center gap-1.5",
              rightPanel === "insights"
                ? "bg-purple-500/20 text-purple-400"
                : "text-white/40 hover:text-white/60",
            )}
          >
            <Brain className="w-3 h-3" />
            Insights
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search agents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-black border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {personaFilters.map((p) => (
            <button
              key={p}
              onClick={() => setFilter(p)}
              className={cn(
                "px-2.5 py-1.5 text-xs font-mono transition-all",
                filter === p
                  ? "bg-white/10 text-white border border-white/20"
                  : "bg-white/[0.02] text-white/40 hover:text-white/60 border border-transparent hover:border-white/10",
              )}
            >
              {p === "All" ? "All" : personaLabels[p]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Agent Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredAgents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => {
                setSelected(agent);
                if (rightPanel === "insights") setRightPanel("profile");
              }}
              className={cn(
                "text-left border bg-black/40 p-4 hover:bg-white/5 transition-all group",
                selected?.id === agent.id
                  ? "border-white/30 bg-white/5"
                  : "border-white/10",
              )}
            >
              <div className="flex items-start gap-3">
                <Image
                  src={agent.avatar}
                  alt={agent.name}
                  width={40}
                  height={40}
                  className="border border-white/10"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate flex items-center gap-1.5">
                    {agent.name}
                    <Sparkles className="w-3 h-3 text-cyan-400/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-xs text-white/30">
                    {agent.occupation}
                  </div>
                </div>
                <div
                  className="w-2 h-2 mt-1"
                  style={{
                    background: sentimentToColor(agent.currentSentiment),
                  }}
                />
              </div>
              <div className="flex items-center gap-2 mt-3 text-xs text-white/40">
                <span className="px-1.5 py-0.5 bg-white/5 border border-white/10">
                  {agent.personaLabel}
                </span>
                <span>{agent.visitFrequency}</span>
              </div>
              <div className="flex items-center justify-between mt-3 text-xs">
                <span className="text-white/30">Visit likelihood</span>
                <span className="font-mono text-white">
                  {agent.likelihoodToVisit}%
                </span>
              </div>
              {/* Block bar */}
              <div className="flex gap-0.5 mt-1.5">
                {Array.from({ length: 20 }, (_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "flex-1 h-1.5",
                      i < Math.round(agent.likelihoodToVisit / 5)
                        ? "bg-white"
                        : "bg-white/10",
                    )}
                  />
                ))}
              </div>
            </button>
          ))}
          {filteredAgents.length === 0 && (
            <div className="col-span-2 border border-white/10 bg-black/40 p-12 text-center">
              <Users className="w-10 h-10 text-white/10 mx-auto mb-3" />
              <p className="text-xs text-white/30 font-mono">
                No agents match your filters
              </p>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div>
          {rightPanel === "insights" ? (
            <AgentInsightPanel agents={mockAgents} business={business} />
          ) : rightPanel === "chat" && selected ? (
            <AgentChat
              key={selected.id}
              agent={selected}
              business={business}
              onClose={() => setRightPanel("profile")}
            />
          ) : rightPanel === "chat" && !selected ? (
            <div className="border border-white/10 bg-black/40 p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
              <MessageSquare className="w-12 h-12 text-cyan-400/20 mb-4" />
              <h3 className="text-sm font-mono text-white/30 mb-2">
                Select an agent to chat
              </h3>
              <p className="text-xs text-white/20 font-mono">
                Click on a persona card, then chat with them using Gemini AI
              </p>
            </div>
          ) : selected ? (
            <div className="border border-white/10 bg-black/40 p-6 sticky top-8">
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src={selected.avatar}
                  alt={selected.name}
                  width={56}
                  height={56}
                  className="border border-white/10"
                />
                <div>
                  <h2 className="text-sm font-mono font-bold">
                    {selected.name}
                  </h2>
                  <div className="text-xs text-white/40">
                    {selected.occupation}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-1.5 py-0.5 bg-white/5 border border-white/10 text-white/60">
                      {selected.personaLabel}
                    </span>
                    <span className="text-xs text-white/30">
                      Age {selected.age}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick chat button */}
              <button
                onClick={() => setRightPanel("chat")}
                className="w-full mb-5 flex items-center justify-center gap-2 py-2.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono hover:bg-cyan-500/20 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Chat with {selected.name.split(" ")[0]}
                <Sparkles className="w-3 h-3" />
              </button>

              <p className="text-xs text-white/50 leading-relaxed mb-6">
                {selected.bio}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                <div className="p-3 bg-white/[0.02] border border-white/5">
                  <div className="text-xs text-white/30 mb-1">Income</div>
                  <div className="text-sm font-mono font-bold text-green-400">
                    {formatCurrency(selected.annualIncome)}/yr
                  </div>
                </div>
                <div className="p-3 bg-white/[0.02] border border-white/5">
                  <div className="text-xs text-white/30 mb-1">Avg Spend</div>
                  <div className="text-sm font-mono font-bold text-white">
                    ${selected.spendingPrediction}
                  </div>
                </div>
                <div className="p-3 bg-white/[0.02] border border-white/5">
                  <div className="text-xs text-white/30 mb-1">Sentiment</div>
                  <div
                    className="text-sm font-mono font-bold"
                    style={{
                      color: sentimentToColor(selected.currentSentiment),
                    }}
                  >
                    {sentimentToLabel(selected.currentSentiment)}
                  </div>
                </div>
                <div className="p-3 bg-white/[0.02] border border-white/5">
                  <div className="text-xs text-white/30 mb-1">Location</div>
                  <div className="text-xs font-mono font-bold flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-white/30" />
                    {selected.neighborhood}
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <h3 className="text-xs uppercase tracking-wider text-white/40 mb-3 flex items-center gap-2">
                <SlidersHorizontal className="w-3 h-3" />
                Preferences
              </h3>
              <div className="space-y-2.5">
                <BlockPreferenceBar
                  label="Price Sensitivity"
                  value={selected.preferences.priceSensitivity}
                />
                <BlockPreferenceBar
                  label="Quality"
                  value={selected.preferences.qualityImportance}
                />
                <BlockPreferenceBar
                  label="Convenience"
                  value={selected.preferences.convenienceImportance}
                />
                <BlockPreferenceBar
                  label="Social Influence"
                  value={selected.preferences.socialInfluence}
                />
                <BlockPreferenceBar
                  label="Health Focus"
                  value={selected.preferences.healthConsciousness}
                />
                <BlockPreferenceBar
                  label="Adventurousness"
                  value={selected.preferences.adventurousness}
                />
                <BlockPreferenceBar
                  label="Brand Loyalty"
                  value={selected.preferences.brandLoyalty}
                />
              </div>

              {/* Categories */}
              <div className="mt-6">
                <div className="text-xs text-white/30 mb-2">
                  Preferred Categories
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selected.preferences.preferredCategories.map((cat) => (
                    <span
                      key={cat}
                      className="text-xs px-2 py-0.5 bg-white/5 border border-white/10 text-white/60"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-white/10 bg-black/40 p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
              <Users className="w-12 h-12 text-white/10 mb-4" />
              <h3 className="text-sm font-mono text-white/30 mb-2">
                Select an agent
              </h3>
              <p className="text-xs text-white/20 font-mono">
                Click on a persona card to view their full profile and chat with
                AI
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
