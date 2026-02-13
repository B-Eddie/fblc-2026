"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Users,
  Zap,
  Globe,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-black font-mono selection:bg-white selection:text-black">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 flex items-center py-6 px-8 w-full bg-black/80 backdrop-blur-sm border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 relative shrink-0">
            <Image
              src="/pilot-logo.png"
              alt="Pilot Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-xl text-white font-bold tracking-tighter">Pilot</span>
        </div>
        <div className="ml-auto">
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs text-white/80 font-mono transition-colors cursor-pointer border border-white/10 hover:border-white/30"
          >
            Open Dashboard
            <ArrowUpRight className="inline-block w-3 h-3 ml-2" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-80">
          <HeroScene />
        </div>
        
        <div
          className="absolute inset-0 z-5 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.8) 60%, #000 100%)",
          }}
        />

        <motion.div 
          className="relative z-10 w-full max-w-5xl flex flex-col items-center px-8 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            variants={itemVariants}
            className="inline-block px-3 py-1 bg-white/10 border border-white/20 mb-8 rounded-full backdrop-blur-md"
          >
            <span className="text-xs font-medium text-white/90 tracking-wide uppercase">
              AI-Powered Market Intelligence
            </span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-tighter leading-[0.9]"
          >
            Simulate your market<br />
            <span className="text-white/40">before you commit.</span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg text-white/60 max-w-2xl mb-12 font-light leading-relaxed"
          >
            Understand how customer personas react to your business decisions.
            Get a comprehensive market analysis in minutes, not months.
          </motion.p>

          <motion.div variants={itemVariants}>
            <Link
              href="/onboarding"
              className="group relative px-8 py-4 bg-white text-black font-bold text-sm overflow-hidden transition-all hover:scale-105 inline-flex items-center gap-2"
            >
              <span className="relative z-10">Start Simulation</span>
              <ArrowUpRight className="relative z-10 w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              <div className="absolute inset-0 bg-white/0 group-hover:bg-black/5 transition-colors" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 flex flex-col items-center py-32 px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              De-risk every decision
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto text-lg">
              From customer modeling to revenue projections, Pilot gives you
              the full picture before you make a move.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group border border-white/10 bg-white/5 p-8 hover:bg-white/10 transition-colors duration-300"
              >
                <feature.icon className="w-8 h-8 text-white mb-6 opacity-70 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-xl font-bold text-white mb-4 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-8 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="border border-white/20 bg-gradient-to-b from-white/10 to-black p-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6 tracking-tighter">
              Ready to simulate?
            </h2>
            <p className="text-white/50 mb-10 max-w-lg mx-auto text-lg">
              Explore the dashboard with sample businesses and customer personas
              to see Pilot in action.
            </p>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold text-sm hover:bg-white/90 transition-all hover:scale-105"
            >
              Get Started Now
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 bg-black">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 relative shrink-0">
              <Image
                src="/pilot-logo.png"
                alt="Pilot Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-lg text-white font-bold tracking-tight">Pilot</span>
          </div>
          <span className="text-sm text-white/40">
            AI agents for simulated market research &copy; {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </div>
  );
}
