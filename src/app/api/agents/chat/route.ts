import { NextRequest, NextResponse } from "next/server";
import {
  geminiModel,
  buildAgentPersonaPrompt,
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
      agent,
      business,
      message,
      history,
    }: {
      agent: Agent;
      business: Business;
      message: string;
      history: { role: string; content: string }[];
    } = body;

    const systemPrompt = `${buildAgentPersonaPrompt(agent)}

${buildBusinessContextPrompt(business)}

INSTRUCTIONS:
- You are having a conversation with a business analyst or owner.
- Answer questions from your perspective as a customer persona.
- Be specific about your preferences, concerns, and what would make you visit or avoid this business.
- Keep responses concise (2-4 sentences per reply) but insightful.
- Reference specific menu items, prices, or business details when relevant.
- Show your personality through your language style and opinions.`;

    const chatHistory = history.map((msg) => ({
      role: msg.role === "agent" ? ("model" as const) : ("user" as const),
      parts: [{ text: msg.content }],
    }));

    const response = await withRetry(async () => {
      const chat = geminiModel.startChat({
        history: [
          { role: "user", parts: [{ text: systemPrompt }] },
          {
            role: "model",
            parts: [
              {
                text: `I understand. I'm ${agent.name}, and I'm ready to share my thoughts as a customer. What would you like to know?`,
              },
            ],
          },
          ...chatHistory,
        ],
      });

      const result = await chat.sendMessage(message);
      return result.response.text();
    });

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Agent chat error:", error);
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
      { error: "Failed to get agent response" },
      { status: 500 },
    );
  }
}
