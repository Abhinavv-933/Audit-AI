export interface ToolEntry {
  toolId: string;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditResult {
  toolId: string;
  toolName: string;
  currentPlan: string;
  currentSpend: number;
  recommendation: string;
  recommendedAction: string;
  potentialSaving: number;
  priority: "high" | "medium" | "low" | "optimal";
}

export interface AuditSummary {
  results: AuditResult[];
  totalMonthlySaving: number;
  totalAnnualSaving: number;
  totalCurrentSpend: number;
  teamSize: number;
  useCase: string;
}

// Official pricing as of May 2026 — see PRICING_DATA.md
const PRICING = {
  cursor: {
    hobby: 0,
    pro: 20,
    business: 40,
    enterprise: null, // custom
  },
  github_copilot: {
    individual: 10,
    business: 19,
    enterprise: 39,
  },
  claude: {
    free: 0,
    pro: 20,
    max: 100,
    team: 30, // per seat
    enterprise: null,
    "api direct": null,
  },
  chatgpt: {
    plus: 20,
    team: 30, // per seat
    enterprise: null,
    "api direct": null,
  },
  anthropic_api: {
    "pay as you go": null,
  },
  openai_api: {
    "pay as you go": null,
  },
  gemini: {
    pro: 19.99,
    ultra: 249.99,
    api: null,
  },
  windsurf: {
    free: 0,
    pro: 15,
    teams: 35,
  },
};

const TOOL_NAMES: Record<string, string> = {
  cursor: "Cursor",
  github_copilot: "GitHub Copilot",
  claude: "Claude",
  chatgpt: "ChatGPT",
  anthropic_api: "Anthropic API Direct",
  openai_api: "OpenAI API Direct",
  gemini: "Gemini",
  windsurf: "Windsurf",
};

function auditCursor(entry: ToolEntry): AuditResult {
  const { plan, monthlySpend, seats } = entry;
  const expectedSpend = plan === "pro" ? 20 * seats : plan === "business" ? 40 * seats : 0;
  const base: Omit<AuditResult, "recommendation" | "recommendedAction" | "potentialSaving" | "priority"> = {
    toolId: "cursor",
    toolName: "Cursor",
    currentPlan: plan,
    currentSpend: monthlySpend,
  };

  if (plan === "hobby") {
    return { ...base, recommendation: "You're on the free plan — no spend here.", recommendedAction: "No action needed", potentialSaving: 0, priority: "optimal" };
  }

  if (plan === "pro" && seats <= 1) {
    if (monthlySpend > 20) {
      return { ...base, recommendation: `You're overpaying. Cursor Pro is $20/seat — you have ${seats} seat.`, recommendedAction: "Check your billing for extra charges", potentialSaving: monthlySpend - 20, priority: "high" };
    }
    return { ...base, recommendation: "Cursor Pro at $20/seat is correctly priced for a solo user.", recommendedAction: "No action needed", potentialSaving: 0, priority: "optimal" };
  }

  if (plan === "business" && seats <= 2) {
    return { ...base, recommendation: `Business plan ($40/seat) for ${seats} seats is overkill. Pro ($20/seat) covers small teams.`, recommendedAction: "Downgrade to Pro", potentialSaving: (40 - 20) * seats, priority: "high" };
  }

  if (monthlySpend > expectedSpend) {
    return { ...base, recommendation: `You're spending $${monthlySpend} but expected is $${expectedSpend} for ${seats} seats on ${plan}.`, recommendedAction: "Review your billing", potentialSaving: monthlySpend - expectedSpend, priority: "medium" };
  }

  return { ...base, recommendation: `Cursor ${plan} at $${monthlySpend}/mo for ${seats} seats is correctly priced.`, recommendedAction: "No action needed", potentialSaving: 0, priority: "optimal" };
}

function auditGithubCopilot(entry: ToolEntry): AuditResult {
  const { plan, monthlySpend, seats } = entry;
  const base: Omit<AuditResult, "recommendation" | "recommendedAction" | "potentialSaving" | "priority"> = {
    toolId: "github_copilot",
    toolName: "GitHub Copilot",
    currentPlan: plan,
    currentSpend: monthlySpend,
  };

  if (plan === "enterprise" && seats <= 5) {
    return { ...base, recommendation: `Enterprise ($39/seat) for ${seats} seats is unnecessary. Business ($19/seat) covers teams under 50.`, recommendedAction: "Downgrade to Business", potentialSaving: (39 - 19) * seats, priority: "high" };
  }

  if (plan === "business" && seats === 1) {
    return { ...base, recommendation: "Business plan for 1 user — Individual ($10/mo) is sufficient and saves $9/mo.", recommendedAction: "Downgrade to Individual", potentialSaving: 9, priority: "medium" };
  }

  return { ...base, recommendation: `GitHub Copilot ${plan} is appropriately sized for your team.`, recommendedAction: "No action needed", potentialSaving: 0, priority: "optimal" };
}

function auditClaude(entry: ToolEntry, useCase: string): AuditResult {
  const { plan, monthlySpend, seats } = entry;
  const base: Omit<AuditResult, "recommendation" | "recommendedAction" | "potentialSaving" | "priority"> = {
    toolId: "claude",
    toolName: "Claude",
    currentPlan: plan,
    currentSpend: monthlySpend,
  };

  if (plan === "max" && useCase !== "research" && useCase !== "mixed") {
    return { ...base, recommendation: `Claude Max ($100/mo) is designed for heavy research/mixed use. For ${useCase}, Claude Pro ($20/mo) is likely sufficient.`, recommendedAction: "Downgrade to Pro", potentialSaving: 80, priority: "high" };
  }

  if (plan === "team" && seats <= 2) {
    return { ...base, recommendation: `Claude Team ($30/seat) for ${seats} people — Pro ($20/seat) works for teams under 5 with no admin overhead.`, recommendedAction: "Switch to individual Pro plans", potentialSaving: (30 - 20) * seats, priority: "medium" };
  }

  return { ...base, recommendation: `Claude ${plan} is a reasonable fit for your use case.`, recommendedAction: "No action needed", potentialSaving: 0, priority: "optimal" };
}

function auditChatGPT(entry: ToolEntry, useCase: string): AuditResult {
  const { plan, monthlySpend, seats } = entry;
  const base: Omit<AuditResult, "recommendation" | "recommendedAction" | "potentialSaving" | "priority"> = {
    toolId: "chatgpt",
    toolName: "ChatGPT",
    currentPlan: plan,
    currentSpend: monthlySpend,
  };

  if (plan === "team" && seats <= 2) {
    return { ...base, recommendation: `ChatGPT Team ($30/seat) for ${seats} users — Plus ($20/seat) is sufficient for small teams.`, recommendedAction: "Switch to Plus", potentialSaving: (30 - 20) * seats, priority: "medium" };
  }

  return { ...base, recommendation: `ChatGPT ${plan} is appropriately sized.`, recommendedAction: "No action needed", potentialSaving: 0, priority: "optimal" };
}

function auditWindsurf(entry: ToolEntry, useCase: string): AuditResult {
  const { plan, monthlySpend, seats } = entry;
  const base: Omit<AuditResult, "recommendation" | "recommendedAction" | "potentialSaving" | "priority"> = {
    toolId: "windsurf",
    toolName: "Windsurf",
    currentPlan: plan,
    currentSpend: monthlySpend,
  };

  if (useCase === "coding" && plan === "pro") {
    return { ...base, recommendation: "For coding use, Cursor Pro ($20/seat) has more features and a larger plugin ecosystem than Windsurf Pro ($15/seat). Consider switching.", recommendedAction: "Evaluate Cursor Pro", potentialSaving: 0, priority: "low" };
  }

  return { ...base, recommendation: `Windsurf ${plan} is reasonably priced for your use case.`, recommendedAction: "No action needed", potentialSaving: 0, priority: "optimal" };
}

function auditGemini(entry: ToolEntry): AuditResult {
  const { plan, monthlySpend, seats } = entry;
  const base: Omit<AuditResult, "recommendation" | "recommendedAction" | "potentialSaving" | "priority"> = {
    toolId: "gemini",
    toolName: "Gemini",
    currentPlan: plan,
    currentSpend: monthlySpend,
  };

  if (plan === "ultra") {
    return { ...base, recommendation: `Gemini Ultra at $249.99/mo is only justified for very heavy multimodal workloads. Claude Pro ($20) or ChatGPT Plus ($20) cover most use cases at 88% less cost.`, recommendedAction: "Downgrade to Gemini Pro or switch to Claude Pro", potentialSaving: monthlySpend - 20, priority: "high" };
  }

  return { ...base, recommendation: `Gemini ${plan} is reasonably priced.`, recommendedAction: "No action needed", potentialSaving: 0, priority: "optimal" };
}

function auditApiDirect(entry: ToolEntry): AuditResult {
  const toolName = entry.toolId === "anthropic_api" ? "Anthropic API" : "OpenAI API";
  return {
    toolId: entry.toolId,
    toolName,
    currentPlan: "Pay as you go",
    currentSpend: entry.monthlySpend,
    recommendation: `You're spending $${entry.monthlySpend}/mo on ${toolName} directly. If this is for internal tooling, Credex credits can reduce this cost by 20–40%.`,
    recommendedAction: "Explore Credex credits",
    potentialSaving: Math.round(entry.monthlySpend * 0.3),
    priority: entry.monthlySpend > 100 ? "high" : "medium",
  };
}

export function runAudit(
  tools: { toolId: string; plan: string; monthlySpend: string; seats: string }[],
  teamSize: string,
  useCase: string
): AuditSummary {
  const results: AuditResult[] = tools
    .filter((t) => t.toolId && t.plan)
    .map((t) => {
      const entry: ToolEntry = {
        toolId: t.toolId,
        plan: t.plan,
        monthlySpend: parseFloat(t.monthlySpend) || 0,
        seats: parseInt(t.seats) || 1,
      };

      switch (t.toolId) {
        case "cursor": return auditCursor(entry);
        case "github_copilot": return auditGithubCopilot(entry);
        case "claude": return auditClaude(entry, useCase);
        case "chatgpt": return auditChatGPT(entry, useCase);
        case "windsurf": return auditWindsurf(entry, useCase);
        case "gemini": return auditGemini(entry);
        case "anthropic_api":
        case "openai_api": return auditApiDirect(entry);
        default: return {
          toolId: t.toolId,
          toolName: TOOL_NAMES[t.toolId] || t.toolId,
          currentPlan: t.plan,
          currentSpend: entry.monthlySpend,
          recommendation: "No specific audit rule for this tool yet.",
          recommendedAction: "Manual review recommended",
          potentialSaving: 0,
          priority: "low" as const,
        };
      }
    });

  const totalMonthlySaving = results.reduce((sum, r) => sum + r.potentialSaving, 0);
  const totalCurrentSpend = results.reduce((sum, r) => sum + r.currentSpend, 0);

  return {
    results,
    totalMonthlySaving,
    totalAnnualSaving: totalMonthlySaving * 12,
    totalCurrentSpend,
    teamSize: parseInt(teamSize) || 1,
    useCase,
  };
}