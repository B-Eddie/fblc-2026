import { NextRequest, NextResponse } from "next/server";
import {
  geminiModel,
  buildBusinessContextPrompt,
  withRetry,
  isRateLimitError,
  getRetryDelay,
} from "@/lib/gemini";
import { Agent } from "@/types/agent";
import { Business } from "@/types/business";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      agents,
      business,
    }: {
      agents: Agent[];
      business: Business;
    } = body;

    const agentSummaries = agents
      .map(
        (a) =>
          `- ${a.name} (${a.personaLabel}, Age ${a.age}, Income $${a.annualIncome.toLocaleString()}, Sentiment: ${a.currentSentiment.toFixed(2)}, Visit Likelihood: ${a.likelihoodToVisit}%, Avg Spend: $${a.spendingPrediction})`,
      )
      .join("\n");

    const prompt = `You are a senior marketing analytics AI. Analyze the following customer personas for this business and provide strategic insights.

${buildBusinessContextPrompt(business)}

CUSTOMER PERSONAS:
${agentSummaries}

Provide your analysis as ONLY valid JSON (no markdown, no code fences) in this exact format:
{
  "summary": "A 2-3 sentence executive summary of the customer base analysis",
  "keyDrivers": ["driver1", "driver2", "driver3"],
  "risks": ["risk1", "risk2", "risk3"],
  "opportunities": ["opportunity1", "opportunity2", "opportunity3"],
  "recommendedActions": ["action1", "action2", "action3"],
  "segmentInsights": [
    {
      "segment": "Segment name",
      "size": <number of agents in this segment>,
      "avgSentiment": <number>,
      "insight": "One sentence about this segment"
    }
  ],
  "revenueAtRisk": <estimated monthly revenue at risk from negative/churning customers as number>,
  "growthPotential": <estimated monthly revenue growth potential from converting prospects as number>
}`;

    const result = await withRetry(() => geminiModel.generateContent(prompt));
    const text = result.response.text().trim();
    const cleaned = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    const insights = JSON.parse(cleaned);

    return NextResponse.json(insights);
  } catch (error) {
    console.error("Agent insight error:", error);
    if (isRateLimitError(error)) {
      const retryAfter = getRetryDelay(error);
      return NextResponse.json(
        {
          error: `Rate limited. Please wait ${retryAfter}s and try again.`,
          retryAfter,
        },
        { status: 429 },
      );
    }
    return NextResponse.json(
      { error: "Failed to generate insights" },
      { status: 500 },
    );
  }
}
