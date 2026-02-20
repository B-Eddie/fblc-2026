"use client";

import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  Globe,
  Users,
  Zap,
  FileText,
  BarChart3,
  CheckCircle2,
  Workflow
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";

// Shadcn Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navigation = () => (
  <nav className="fixed top-0 z-50 flex items-center justify-between py-4 px-6 sm:px-10 w-full bg-black/60 backdrop-blur-xl border-b border-white/[0.05]">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-bold tracking-tighter text-lg">
        P
      </div>
      <span className="text-xl font-medium tracking-tight text-white">Pilot</span>
    </div>
    <div className="flex items-center gap-6">
      <Link href="/login" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
        Sign In
      </Link>
      <Link href="/dashboard">
        <Button variant="secondary" className="rounded-full group h-9 px-5">
          Open Dashboard
          <ChevronRight className="w-4 h-4 ml-1 text-black/50 group-hover:text-black transition-colors" />
        </Button>
      </Link>
    </div>
  </nav>
);

// Futuristic Moving Grid Background
const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black pointer-events-none perspective-[1000px]">
      {/* Moving vertical lines */}
      <div className="absolute inset-0 flex justify-between px-[5%] opacity-20">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`v-${i}`}
            className="w-px h-full bg-gradient-to-b from-transparent via-white to-transparent"
            initial={{ y: "-100%" }}
            animate={{ y: "100%" }}
            transition={{
              repeat: Infinity,
              duration: 5 + Math.random() * 5,
              ease: "linear",
              delay: Math.random() * 5,
            }}
            style={{
              opacity: 0.1 + Math.random() * 0.5,
              filter: `blur(${Math.random() * 2}px)`
            }}
          />
        ))}
      </div>

      {/* Perspective Grid Floor */}
      <div className="absolute bottom-0 left-[-50%] right-[-50%] h-[60vh] transform-origin-bottom"
        style={{ transform: "rotateX(75deg) translateY(200px) translateZ(-200px)" }}>

        {/* Horizontal moving grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={`h-${i}`}
              className="w-full h-px bg-white/20"
              initial={{ y: "-100%", opacity: 0 }}
              animate={{ y: "100%", opacity: [0, 0.5, 0] }}
              transition={{
                repeat: Infinity,
                duration: 4,
                ease: "linear",
                delay: (i * 4) / 30,
              }}
            />
          ))}
        </div>

        {/* Perspective Vertical Lines */}
        <div className="absolute inset-0 flex justify-between">
          {[...Array(40)].map((_, i) => (
            <div key={`p-${i}`} className="w-px h-full bg-white/10" />
          ))}
        </div>
      </div>

      {/* Radial fade to hide edges */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_70%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
    </div>
  );
};

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20 selection:text-white" ref={containerRef}>
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6 sm:px-12 lg:px-24 overflow-hidden border-b border-white/[0.05]">
        <AnimatedBackground />

        <div className="max-w-4xl mx-auto w-full flex flex-col items-center text-center relative z-10 mt-10">
          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="flex flex-col items-center gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Badge variant="outline" className="px-4 py-1.5 bg-black/40 backdrop-blur-md text-neutral-300 gap-2 border-white/10 rounded-full text-xs font-normal shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Pilot Engine v2.0 Live
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="text-6xl sm:text-7xl lg:text-[7rem] font-medium tracking-tighter leading-[0.95] drop-shadow-2xl"
            >
              Simulate <span className="text-neutral-500">reality.</span><br />
              Decide with <span className="italic font-light">certainty.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-lg md:text-xl text-neutral-400 max-w-2xl font-light leading-relaxed tracking-wide drop-shadow-md"
            >
              Deploy autonomous AI persona swarms to test your business hypotheses.
              Visualize market reactions before you spend a single dollar.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-center gap-6 pt-4"
            >
              <Link href="/onboarding">
                <Button size="lg" className="rounded-full px-10 h-14 bg-white text-black hover:bg-neutral-200 gap-2 text-base font-medium transition-transform hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.15)]">
                  Start Simulation
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="#features" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
                Explore capabilities
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Soft bottom glow to blend into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />
      </section>

      {/* Logos Section */}
      <section className="py-16 px-6 bg-neutral-950 border-b border-white/[0.02]">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
          <p className="text-sm font-medium text-neutral-500 uppercase tracking-widest text-center">
            Trusted by forward-thinking teams
          </p>
          <div className="flex flex-wrap justify-center gap-12 sm:gap-24 opacity-40 grayscale">
            {/* Fake abstract logos */}
            <div className="flex items-center gap-2 font-bold text-xl tracking-tighter"><div className="w-4 h-4 bg-white rounded-sm" /> Vertex</div>
            <div className="flex items-center gap-2 font-bold text-xl tracking-tighter"><div className="w-4 h-4 rounded-full border-2 border-white" /> Nexus</div>
            <div className="flex items-center gap-2 font-bold text-xl tracking-tighter"><div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[14px] border-b-white" /> Chronos</div>
            <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">AURA</div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-32 px-6 sm:px-12 lg:px-24 bg-black relative border-b border-neutral-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
            <h2 className="text-4xl md:text-5xl font-medium tracking-tighter text-white">
              Stop guessing.
            </h2>
            <p className="text-neutral-400 text-lg md:text-xl font-light leading-relaxed">
              We've modeled thousands of consumer profiles with distinct psychological triggers, income brackets, and spending habits to react natively to your changes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-neutral-950/50 border-neutral-800/50 backdrop-blur">
              <CardHeader>
                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mb-4">
                  <Users className="w-5 h-5 text-neutral-300" />
                </div>
                <CardTitle className="text-xl font-medium text-white">Generate Swarm</CardTitle>
                <CardDescription className="text-neutral-400 text-base">We compile a localized database of AI personas representing your exact target demographic.</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center mb-4 shadow-lg">
                  <Workflow className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-xl font-medium text-white">Run Decisions</CardTitle>
                <CardDescription className="text-neutral-300 text-base">Introduce your pricing changes, location shifts, or product adjustments into the system.</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-neutral-950/50 border-neutral-800/50 backdrop-blur">
              <CardHeader>
                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mb-4">
                  <BarChart3 className="w-5 h-5 text-neutral-300" />
                </div>
                <CardTitle className="text-xl font-medium text-white">Measure Impact</CardTitle>
                <CardDescription className="text-neutral-400 text-base">Watch as agents navigate your scenario, generating quantifiable qualitative feedback instantly.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Detail Section */}
      <section className="py-32 px-6 sm:px-12 lg:px-24 bg-neutral-950 relative border-b border-neutral-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,_var(--tw-gradient-stops))] from-neutral-900/50 to-transparent" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="space-y-12">
            <div>
              <Badge variant="outline" className="mb-6 hover:bg-transparent border-neutral-700 text-neutral-400 px-3 py-1">Engine Capabilities</Badge>
              <h2 className="text-4xl md:text-5xl font-medium tracking-tighter text-white mb-6">
                Multivariate market <br className="hidden md:block" /> environments.
              </h2>
              <p className="text-neutral-400 text-lg font-light leading-relaxed">
                Pilot doesn't just calculate probabilities. It simulates human behavior through emergent interactions.
              </p>
            </div>

            <div className="space-y-6">
              {[
                { title: "Psychological Modeling", desc: "Agents react emotionally, not just logically, to price and scarcity." },
                { title: "Network Effects", desc: "Simulate word-of-mouth spread and viral local adoption." },
                { title: "Competitor Resilience", desc: "Introduce rival AI businesses to test market saturation." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1"><CheckCircle2 className="w-5 h-5 text-neutral-500" /></div>
                  <div>
                    <h4 className="font-medium text-lg text-white mb-1">{item.title}</h4>
                    <p className="text-neutral-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative aspect-square lg:aspect-[4/5] rounded-[2rem] border border-neutral-800 bg-black overflow-hidden shadow-2xl flex items-center justify-center p-8">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-xl shadow-2xl p-6 relative z-10">
              <div className="flex items-center gap-4 mb-6 border-b border-neutral-800 pb-4">
                <Avatar className="h-10 w-10 border border-neutral-800">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-neutral-900 text-xs">P#41</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-white">Agent Persona 41</p>
                  <p className="text-xs text-neutral-500">Price sensitive • Urban • High loyalty</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-2 w-full bg-neutral-900 rounded-full overflow-hidden">
                  <div className="h-full bg-neutral-500 w-[70%]" />
                </div>
                <div className="h-2 w-[80%] bg-neutral-900 rounded-full overflow-hidden">
                  <div className="h-full bg-neutral-600 w-[40%]" />
                </div>
                <div className="h-2 w-[90%] bg-neutral-900 rounded-full overflow-hidden">
                  <div className="h-full bg-neutral-400 w-[60%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-32 px-6 sm:px-12 lg:px-24 bg-black relative border-b border-neutral-900">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <Badge variant="outline" className="mb-6 hover:bg-transparent border-neutral-800 text-neutral-500 px-3 py-1">FAQ</Badge>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tighter text-white mb-16 text-center">
            Common questions
          </h2>

          <Accordion type="single" collapsible className="w-full text-left">
            <AccordionItem value="item-1" className="border-neutral-800 py-2">
              <AccordionTrigger className="text-lg font-medium hover:text-neutral-300 hover:no-underline text-left">How accurate are the agent personas?</AccordionTrigger>
              <AccordionContent className="text-neutral-400 text-base leading-relaxed">
                Our models are trained on extensive real-world psychographic and demographic datasets. While no simulation perfectly predicts the future, our emergent behaviors identify high-risk friction points with over 80% real-world correlation.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-neutral-800 py-2">
              <AccordionTrigger className="text-lg font-medium hover:text-neutral-300 hover:no-underline text-left">What industries does Pilot support?</AccordionTrigger>
              <AccordionContent className="text-neutral-400 text-base leading-relaxed">
                Currently, Pilot is optimized for brick-and-mortar retail, D2C e-commerce, and hospitality. Our parameter spaces are specifically tuned for consumer purchasing decisions.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-neutral-800 py-2">
              <AccordionTrigger className="text-lg font-medium hover:text-neutral-300 hover:no-underline text-left">How long does a simulation take to run?</AccordionTrigger>
              <AccordionContent className="text-neutral-400 text-base leading-relaxed">
                A standard swarm of 50,000 agents testing a 12-month scenario completes in under 4 minutes.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Custom CTA */}
      <section className="py-32 px-6 sm:px-12 lg:px-24 bg-neutral-950 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-neutral-800/30 via-black to-black z-0 pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <Card className="bg-transparent border-0 shadow-none">
            <CardHeader className="p-0">
              <CardTitle className="text-4xl md:text-6xl font-medium text-white mb-6 tracking-tighter">
                Ready to take flight?
              </CardTitle>
              <CardDescription className="text-neutral-400 mb-10 max-w-xl mx-auto text-lg md:text-xl font-light leading-relaxed">
                Experience the power of simulated decision making. Create your first market scenario today.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex justify-center pb-8 border-none shadow-none">
              <Link href="/onboarding">
                <Button size="lg" className="rounded-full px-10 py-6 text-base shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:scale-105 transition-transform">
                  Start Simulation
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 sm:px-10 bg-black border-t border-neutral-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-neutral-800 text-white flex items-center justify-center font-bold tracking-tighter text-xs">
              P
            </div>
            <span className="text-sm font-medium tracking-tight text-neutral-400">Pilot</span>
          </div>

          <div className="flex gap-8">
            <Link href="#" className="text-sm font-medium text-neutral-500 hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="text-sm font-medium text-neutral-500 hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="text-sm font-medium text-neutral-500 hover:text-white transition-colors">X</Link>
          </div>

          <span className="text-sm text-neutral-600 font-light tracking-wide">
            &copy; {new Date().getFullYear()} Pilot Inc.
          </span>
        </div>
      </footer>
    </div>
  );
}
