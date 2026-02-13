"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Send, X, Bot, Loader2, MessageSquare, Sparkles } from "lucide-react";
import { Agent } from "@/types/agent";
import { Business } from "@/types/business";
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: "user" | "agent";
  content: string;
  timestamp: string;
}

interface AgentChatProps {
  agent: Agent;
  business: Business;
  onClose: () => void;
}

const suggestedQuestions = [
  "What would make you visit more often?",
  "How do you feel about the prices?",
  "What would you change about the menu?",
  "Would you recommend this place to friends?",
  "What's your ideal dining experience here?",
];

export default function AgentChat({
  agent,
  business,
  onClose,
}: AgentChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/agents/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent,
          business,
          message: text.trim(),
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();

      if (res.status === 429) {
        const retryAfter = data.retryAfter || 60;
        const errorMessage: ChatMessage = {
          role: "agent",
          content: `API rate limit reached. Please wait ~${retryAfter}s before trying again. The free tier has limited requests per minute/day.`,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        return;
      }

      if (data.error) throw new Error(data.error);

      const agentMessage: ChatMessage = {
        role: "agent",
        content: data.response,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, agentMessage]);
    } catch {
      const errorMessage: ChatMessage = {
        role: "agent",
        content:
          "Sorry, I'm having trouble responding right now. Please wait a moment and try again.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="border border-white/10 bg-black/60 backdrop-blur-sm flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Image
              src={agent.avatar}
              alt={agent.name}
              width={36}
              height={36}
              className="border border-white/10"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 border border-black" />
          </div>
          <div>
            <div className="text-xs font-medium flex items-center gap-1.5">
              {agent.name}
              <Sparkles className="w-3 h-3 text-cyan-400" />
            </div>
            <div className="text-xs text-white/30">{agent.personaLabel}</div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-white/10 transition-colors text-white/40 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-12 h-12 border border-white/10 bg-white/[0.02] flex items-center justify-center mb-4">
              <MessageSquare className="w-5 h-5 text-white/20" />
            </div>
            <p className="text-xs text-white/30 mb-1">Chat with {agent.name}</p>
            <p className="text-xs text-white/15 mb-6 max-w-[240px]">
              Ask about their preferences, what they think of {business.name},
              or how to win them over.
            </p>
            <div className="space-y-1.5 w-full max-w-[280px]">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="w-full text-left px-3 py-2 text-xs text-white/40 hover:text-white/70 bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/15 transition-all"
                >
                  &ldquo;{q}&rdquo;
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "flex gap-2.5",
                msg.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              {msg.role === "agent" && (
                <Image
                  src={agent.avatar}
                  alt={agent.name}
                  width={24}
                  height={24}
                  className="border border-white/10 shrink-0 mt-0.5"
                />
              )}
              <div
                className={cn(
                  "max-w-[80%] px-3 py-2 text-xs leading-relaxed",
                  msg.role === "user"
                    ? "bg-white/10 text-white border border-white/20"
                    : "bg-cyan-500/10 text-white/80 border border-cyan-500/20",
                )}
              >
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="w-6 h-6 bg-white/10 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3 h-3 text-white/40" />
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex gap-2.5">
            <Image
              src={agent.avatar}
              alt={agent.name}
              width={24}
              height={24}
              className="border border-white/10 shrink-0 mt-0.5"
            />
            <div className="bg-cyan-500/10 border border-cyan-500/20 px-3 py-2 flex items-center gap-2">
              <Loader2 className="w-3 h-3 text-cyan-400 animate-spin" />
              <span className="text-xs text-white/40">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="p-3 border-t border-white/10 flex gap-2"
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask ${agent.name} something...`}
          disabled={isLoading}
          className="flex-1 bg-white/[0.03] border border-white/10 px-3 py-2 text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className={cn(
            "p-2 transition-all",
            input.trim() && !isLoading
              ? "bg-white text-black hover:bg-white/90"
              : "bg-white/5 text-white/20 cursor-not-allowed",
          )}
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
