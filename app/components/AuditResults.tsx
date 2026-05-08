"use client";

import { AuditSummary } from "@/lib/auditEngine";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props {
  summary: AuditSummary;
  onBack: () => void;
}

const PRIORITY_COLORS = {
  high: "text-red-500",
  medium: "text-yellow-500",
  low: "text-blue-500",
  optimal: "text-green-500",
};

const PRIORITY_LABELS = {
  high: "High savings",
  medium: "Some savings",
  low: "Minor suggestion",
  optimal: "Already optimal",
};

export default function AuditResults({ summary, onBack }: Props) {
  const { results, totalMonthlySaving, totalAnnualSaving, totalCurrentSpend } = summary;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Hero savings block */}
      <div className="rounded-xl border p-6 space-y-1">
        <p className="text-sm text-muted-foreground">Your total potential savings</p>
        <p className="text-5xl font-bold">
          ${totalMonthlySaving.toFixed(0)}
          <span className="text-xl font-normal text-muted-foreground">/mo</span>
        </p>
        <p className="text-muted-foreground">
          That is{" "}
          <span className="font-semibold text-foreground">
            ${totalAnnualSaving.toFixed(0)}/year
          </span>{" "}
          you could be saving.
        </p>
        <p className="text-sm text-muted-foreground pt-1">
          Current spend: ${totalCurrentSpend.toFixed(0)}/mo
        </p>
      </div>

      {/* Credex callout for high savings */}
      {totalMonthlySaving > 200 && (
        <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 space-y-2">
          <p className="font-semibold text-blue-900">
            You could save even more with Credex
          </p>
          <p className="text-sm text-blue-800">
            Credex sells discounted AI credits — Cursor, Claude, ChatGPT Enterprise and
            more — at 20–40% below retail. Your audit shows significant overspend.
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Book a free Credex consultation →
          </Button>
        </div>
      )}

      {/* Already optimal message for low savings */}
      {totalMonthlySaving < 100 && (
        <div className="rounded-xl bg-green-50 border border-green-200 p-4">
          <p className="font-semibold text-green-900">You are spending well 👍</p>
          <p className="text-sm text-green-800 mt-1">
            Your AI stack looks fairly optimized. We will notify you when new
            optimizations apply to your tools.
          </p>
        </div>
      )}

      {/* Per tool breakdown */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Per-tool breakdown</h2>
        {results.map((result) => (
          <Card key={result.toolId}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{result.toolName}</CardTitle>
                <span className={`text-sm font-medium ${PRIORITY_COLORS[result.priority]}`}>
                  {PRIORITY_LABELS[result.priority]}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current plan</span>
                <span className="font-medium capitalize">{result.currentPlan}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monthly spend</span>
                <span className="font-medium">${result.currentSpend}/mo</span>
              </div>
              {result.potentialSaving > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Potential saving</span>
                  <span className="font-medium text-green-600">
                    -${result.potentialSaving}/mo
                  </span>
                </div>
              )}
              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">{result.recommendation}</p>
                {result.recommendedAction !== "No action needed" && (
                  <p className="text-sm font-medium mt-1">
                    → {result.recommendedAction}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button variant="outline" onClick={onBack} className="w-full">
        ← Edit my tools
      </Button>
    </div>
  );
}