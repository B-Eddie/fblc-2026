"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  Users,
  Zap,
  TrendingUp,
  Globe,
  FileText,
} from "lucide-react";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[55vh] flex items-center justify-center">
      <div className="w-4 h-4 border border-white/40 border-t-white animate-spin" />
    </div>
  ),
});

const features = [
  {
    icon: Globe,
    title: "Market Simulation",
    description:
      "Test business decisions with diverse AI customer personas. See real-time reactions and sentiment shifts across your target market.",
  },
  {
    icon: Users,
    title: "AI Customer Agents",
    description:
      "20+ realistic customer archetypes with unique preferences, budgets, and behavioral patterns that react to your changes.",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description:
      "Get projected revenue impact, foot traffic changes, and sentiment analysis. Compress months of research into minutes.",
  },
  {
    icon: FileText,
    title: "Actionable Insights",
    description:
      "Receive data-driven recommendations to optimize your business strategy and identify market gaps before competitors.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-black font-mono">
      {/* Navigation */}
      <nav className="relative z-10 flex items-center py-6 px-8 w-full bg-black/50">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-white" />
          <span className="text-lg text-white font-mono">Marketify</span>
        </div>
        <div className="ml-auto">
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-white/5 hover:bg-white/20 text-xs text-white font-mono transition cursor-pointer border border-white/10"
          >
            Open Dashboard
            <ArrowUpRight className="inline-block w-3 h-3 ml-1" />
          </Link>
        </div>
      </nav>

      <div
        style={{ height: "1px", backgroundColor: "white", opacity: 0.1 }}
        className="w-full"
      />

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-[calc(100vh-100px)] -mt-8">
        <div className="absolute inset-0 z-0">
          <HeroScene />
        </div>
        <div
          className="absolute inset-0 z-5"
          style={{
            background:
              "radial-gradient(circle at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.2) 70%, transparent 100%)",
          }}
        />

        <div className="relative z-10 w-full flex flex-col items-center px-8">
          <div className="inline-block px-4 py-2 bg-white/5 border border-white/10 mb-8">
            <span className="text-xs font-mono text-white/80">
              AI-Powered Market Intelligence
            </span>
          </div>

          <h1 className="text-5xl font-mono text-center text-white mb-6 max-w-2xl mx-auto leading-tight">
            Simulate your market before you commit
          </h1>
          <p className="text-sm text-white/50 text-center max-w-xl mb-8 font-mono">
            Understand how customer personas react to your business decisions.
            Get a market analysis in minutes, not months.
          </p>

          <Link
            href="/dashboard"
            className="px-8 py-3 bg-white text-black font-mono text-sm hover:bg-white/90 transition-all transform hover:scale-105 inline-flex items-center gap-2"
          >
            Explore Marketify
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Gradient fade */}
      <div
        className="h-32 -mt-32 relative z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,1) 100%)",
        }}
      />

      {/* Divider */}
      <div className="max-w-7xl h-[1px] bg-white/10 mx-auto mb-20" />

      {/* Features */}
      <section className="relative z-10 flex flex-col items-center py-20 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block px-4 py-2 bg-white/5 border border-white/10 mb-8">
            <span className="text-xs font-mono text-white">
              Product Overview
            </span>
          </div>

          <h2 className="text-3xl font-mono text-white mb-4 max-w-4xl mx-auto">
            Everything you need to de-risk business decisions
          </h2>
          <p className="text-sm font-mono text-white/50 mb-16 max-w-2xl mx-auto">
            From customer modeling to revenue projections, Marketify gives you
            the full picture before you make a move.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="border border-white/10 bg-black/40 p-6 hover:bg-white/5 hover:border-white/20 transition-all text-left group"
              >
                <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-mono text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-xs font-mono text-white/60 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-8 pb-32">
        <div className="border border-white/20 bg-black/40 p-12 text-center">
          <h2 className="text-2xl font-mono text-white mb-4">
            Ready to simulate your market?
          </h2>
          <p className="text-sm text-white/50 mb-8 max-w-lg mx-auto font-mono">
            Explore the dashboard with sample businesses and customer personas
            to see Marketify in action.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black font-mono text-sm hover:bg-white/90 transition-colors"
          >
            Get Started
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 bg-black/90">
        <div className="max-w-6xl mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-white" />
            <span className="text-sm text-white font-mono">Marketify</span>
          </div>
          <span className="text-xs text-white/40 font-mono">
            AI agents for simulated market research
          </span>
        </div>
      </footer>
    </div>
  );
}
