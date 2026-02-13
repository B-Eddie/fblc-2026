import { NextRequest, NextResponse } from "next/server";
import {
  geminiModel,
  buildAgentPersonaPrompt,
  buildBusinessContextPrompt,
  SimulationReactionResponse,
  enqueueRequest,
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
      scenarioType,
      scenarioDescription,
    }: {
      agents: Agent[];
      business: Business;
      scenarioType: string;
      scenarioDescription: string;
    } = body;

    const businessContext = buildBusinessContextPrompt(business);

    const reactionPromises = agents.map(async (agent) => {
      const prompt = `${buildAgentPersonaPrompt(agent)}

${businessContext}

SCENARIO: The business is making the following change: "${scenarioDescription}" (Type: ${scenarioType})

Based on your persona, preferences, income, and relationship with this business, provide your reaction to this change.

You MUST respond with ONLY valid JSON in this exact format (no markdown, no code fences):
{
  "feedback": "Your honest 1-2 sentence reaction as this persona",
  "sentiment": <number between -1 and 1 representing your new overall feeling>,
  "sentimentDelta": <number between -0.5 and 0.5 representing change from your current sentiment of ${agent.currentSentiment}>,
  "emotionalTone": "<one of: excited, positive, neutral, concerned, negative, angry>",
  "reasoning": "Brief 1-sentence explanation of why you feel this way based on your preferences",
  "likelihoodChange": <number between -30 and 30 representing percentage change in visit likelihood>,
  "spendingChange": <number between -20 and 20 representing dollar change in avg spending>,
  "tags": ["tag1", "tag2"]
}

Tags should be relevant keywords like "price-sensitive", "quality-focused", "loyal-customer", "at-risk", "growth-opportunity", etc.`;

      try {
        const result = await enqueueRequest(() =>
          geminiModel.generateContent(prompt),
        );
        const text = result.response.text().trim();
        // Strip markdown code fences if present
        const cleaned = text
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();
        const reaction: SimulationReactionResponse = JSON.parse(cleaned);
        return {
          agentId: agent.id,
          agentName: agent.name,
          agentAvatar: agent.avatar,
          agentPersona: agent.personaLabel,
          ...reaction,
        };
      } catch (parseError) {
        console.error(
          `Failed to parse reaction for ${agent.name}:`,
          parseError,
        );
        return {
          agentId: agent.id,
          agentName: agent.name,
          agentAvatar: agent.avatar,
          agentPersona: agent.personaLabel,
          feedback: "I need more time to think about this change.",
          sentiment: agent.currentSentiment,
          sentimentDelta: 0,
          emotionalTone: "neutral" as const,
          reasoning: "Unable to form a strong opinion yet.",
          likelihoodChange: 0,
          spendingChange: 0,
          tags: ["undecided"],
        };
      }
    });

    const reactions = await Promise.all(reactionPromises);

    // Generate summary
    const avgSentiment =
      reactions.reduce((sum, r) => sum + r.sentiment, 0) / reactions.length;
    const avgSentimentDelta =
      reactions.reduce((sum, r) => sum + r.sentimentDelta, 0) /
      reactions.length;
    const positiveCount = reactions.filter(
      (r) => r.sentimentDelta > 0.05,
    ).length;
    const negativeCount = reactions.filter(
      (r) => r.sentimentDelta < -0.05,
    ).length;
    const neutralCount = reactions.length - positiveCount - negativeCount;

    return NextResponse.json({
      reactions,
      summary: {
        averageSentiment: avgSentiment,
        sentimentDelta: avgSentimentDelta,
        positiveCount,
        negativeCount,
        neutralCount,
        totalAgents: reactions.length,
      },
    });
  } catch (error) {
    console.error("Simulation reaction error:", error);
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
      { error: "Failed to simulate reactions" },
      { status: 500 },
    );
  }
}
