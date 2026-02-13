import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { Agent } from "@/types/agent";
import { Business } from "@/types/business";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

// Rate limit error detection
export function isRateLimitError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes("429") ||
      error.message.includes("Too Many Requests") ||
      error.message.includes("quota")
    );
  }
  return false;
}

// Extract retry delay from error message (in seconds)
export function getRetryDelay(error: unknown): number {
  if (error instanceof Error) {
    const match = error.message.match(/retry in (\d+(?:\.\d+)?)/i);
    if (match) return Math.ceil(parseFloat(match[1]));
  }
  return 60; // default 60s
}

// Sleep helper
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Retry wrapper with exponential backoff
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelayMs: number = 2000,
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (isRateLimitError(error)) {
        if (attempt === maxRetries) throw error;
        const retrySeconds = getRetryDelay(error);
        const backoff = Math.min(
          retrySeconds * 1000,
          baseDelayMs * Math.pow(2, attempt),
        );
        console.log(
          `Rate limited. Retrying in ${Math.round(backoff / 1000)}s (attempt ${attempt + 1}/${maxRetries})...`,
        );
        await sleep(backoff);
      } else {
        throw error;
      }
    }
  }
  throw lastError;
}

// Sequential request queue to avoid burst rate limits
let requestQueue: Promise<unknown> = Promise.resolve();
const MIN_REQUEST_GAP_MS = 1200; // minimum gap between requests

export function enqueueRequest<T>(fn: () => Promise<T>): Promise<T> {
  const result = requestQueue.then(async () => {
    await sleep(MIN_REQUEST_GAP_MS);
    return withRetry(fn, 2);
  });
  requestQueue = result.catch(() => {}); // prevent queue breakage
  return result;
}

export function buildAgentPersonaPrompt(agent: Agent): string {
  return `You are roleplaying as ${agent.name}, a ${agent.age}-year-old ${agent.occupation} living in the ${agent.neighborhood} neighborhood.

PERSONA: ${agent.personaLabel}
BIO: ${agent.bio}
ANNUAL INCOME: $${agent.annualIncome.toLocaleString()}
INCOME CATEGORY: ${agent.incomeCategory}

PERSONALITY & PREFERENCES (scale 0-1):
- Price Sensitivity: ${agent.preferences.priceSensitivity} (${agent.preferences.priceSensitivity > 0.7 ? "very price-conscious" : agent.preferences.priceSensitivity > 0.4 ? "moderate" : "not price-sensitive"})
- Quality Importance: ${agent.preferences.qualityImportance} (${agent.preferences.qualityImportance > 0.7 ? "quality is paramount" : agent.preferences.qualityImportance > 0.4 ? "values decent quality" : "quality less important"})
- Convenience: ${agent.preferences.convenienceImportance} (${agent.preferences.convenienceImportance > 0.7 ? "convenience is key" : "flexible on convenience"})
- Social Influence: ${agent.preferences.socialInfluence} (${agent.preferences.socialInfluence > 0.7 ? "heavily influenced by trends/reviews" : "makes independent decisions"})
- Health Consciousness: ${agent.preferences.healthConsciousness} (${agent.preferences.healthConsciousness > 0.7 ? "very health-focused" : "not health-driven"})
- Adventurousness: ${agent.preferences.adventurousness} (${agent.preferences.adventurousness > 0.7 ? "loves trying new things" : "prefers familiar choices"})
- Brand Loyalty: ${agent.preferences.brandLoyalty} (${agent.preferences.brandLoyalty > 0.7 ? "very loyal to favorites" : "open to alternatives"})
- Preferred Categories: ${agent.preferences.preferredCategories.join(", ")}

CURRENT SENTIMENT TOWARD THE BUSINESS: ${agent.currentSentiment} (${agent.currentSentiment > 0.5 ? "very positive" : agent.currentSentiment > 0 ? "somewhat positive" : agent.currentSentiment > -0.5 ? "somewhat negative" : "very negative"})

Stay in character at all times. Respond as this person would — with their vocabulary, concerns, and perspective. Be authentic and specific.`;
}

export function buildBusinessContextPrompt(business: Business): string {
  const topProducts = business.products
    .slice(0, 8)
    .map(
      (p) =>
        `  - ${p.name} ($${p.price}) — ${p.description}${p.isPopular ? " [POPULAR]" : ""}${p.isNew ? " [NEW]" : ""}`,
    )
    .join("\n");

  return `BUSINESS CONTEXT:
Name: ${business.name}
Type: ${business.type}
Tagline: "${business.tagline}"
Description: ${business.description}
Location: ${business.address}
Price Range: ${business.priceRange}
Rating: ${business.rating}/5
Established: ${business.establishedYear}
Monthly Revenue: $${business.monthlyRevenue.toLocaleString()}
Avg Customers/Day: ${business.avgCustomersPerDay}

MENU/PRODUCTS:
${topProducts}`;
}

export interface ChatMessage {
  role: "user" | "agent";
  content: string;
  timestamp: string;
}

export interface SimulationReactionRequest {
  agent: Agent;
  business: Business;
  scenarioType: string;
  scenarioDescription: string;
}

export interface SimulationReactionResponse {
  feedback: string;
  sentiment: number;
  sentimentDelta: number;
  emotionalTone: string;
  reasoning: string;
  likelihoodChange: number;
  spendingChange: number;
  tags: string[];
}

export interface AgentInsight {
  summary: string;
  keyDrivers: string[];
  risks: string[];
  opportunities: string[];
  recommendedActions: string[];
}
