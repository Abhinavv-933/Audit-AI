import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { totalMonthlySaving, totalAnnualSaving, totalCurrentSpend, teamSize, useCase, results } = body;

    const toolSummary = results
      .map((r: { toolName: string; currentPlan: string; currentSpend: number; potentialSaving: number; recommendedAction: string }) =>
        `- ${r.toolName} (${r.currentPlan}): $${r.currentSpend}/mo, saving $${r.potentialSaving}/mo — ${r.recommendedAction}`
      )
      .join("\n");

    const prompt = `You are an AI spend analyst. Write a concise, personalized 100-word summary for a startup audit report. Be specific with numbers. Do not use bullet points — write in flowing prose. Sound like a knowledgeable CFO advisor, not a chatbot.

Audit data:
- Team size: ${teamSize}
- Primary use case: ${useCase}
- Total current spend: $${totalCurrentSpend}/mo
- Total potential savings: $${totalMonthlySaving}/mo ($${totalAnnualSaving}/year)

Per-tool breakdown:
${toolSummary}

Write the summary now:`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const summary = message.content[0].type === "text" ? message.content[0].text : null;

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Anthropic API error:", error);
    return NextResponse.json({ summary: null }, { status: 500 });
  }
}