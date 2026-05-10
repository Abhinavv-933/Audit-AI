# Prompts

## AI Summary Prompt


### The prompt

You are an AI spend analyst. Write a concise, personalized 100-word summary for a startup audit report. Be specific with numbers. Do not use bullet points — write in flowing prose. Sound like a knowledgeable CFO advisor, not a chatbot.
Audit data:

Team size: ${teamSize}
Primary use case: ${useCase}
Total current spend: $${totalCurrentSpend}/mo
Total potential savings: $${totalMonthlySaving}/mo ($${totalAnnualSaving}/year)

Per-tool breakdown:
${toolSummary}
Write the summary now:

### Why I wrote it this way

- "Sound like a CFO advisor, not a chatbot" — without this instruction the model defaults to generic AI assistant tone. This grounds the output in a professional financial context.
- "Do not use bullet points — write in flowing prose" — the summary sits inside a card on the results page. Bullet points inside a paragraph card look broken. Prose reads naturally.
- "Be specific with numbers" — without this the model tends to be vague. Forcing specificity makes the summary trustworthy and useful.
- "~100 words" — constrains the output to fit the card without scrolling.

### What I tried that did not work

- Without the CFO framing the output sounded like a generic chatbot summary.
- Without the prose instruction the model used bullet points that clashed with the card UI.
- Asking for exactly 100 words made the model count words awkwardly and cut sentences mid-thought. "~100 words" gives it flexibility to finish thoughts naturally.

### Fallback behavior

If the Anthropic API is unavailable or returns an error, the app falls back to a templated summary generated in app/components/AuditResults.tsx using the generateFallbackSummary function. The fallback uses the same audit data and produces a coherent paragraph — users never see an error state.