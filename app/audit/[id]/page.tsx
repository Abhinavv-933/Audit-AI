import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { AuditSummary } from "@/lib/auditEngine";
import { Metadata } from "next";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

async function getAudit(id: string) {
  const { data, error } = await supabase
    .from("leads")
    .select("audit_data, total_monthly_saving, total_current_spend, use_case, team_size")
    .eq("audit_id", id)
    .single();

  if (error || !data) return null;
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const audit = await getAudit(id);

  if (!audit) {
    return { title: "Audit not found — Audit AI" };
  }

  const saving = audit.total_monthly_saving;
  const spend = audit.total_current_spend;

  return {
    title: `I found $${saving}/mo in AI tool savings — Audit AI`,
    description: `This team was spending $${spend}/mo on AI tools. Audit AI found $${saving}/mo in potential savings. Run your free audit now.`,
    openGraph: {
      title: `I found $${saving}/mo in AI tool savings — Audit AI`,
      description: `This team was spending $${spend}/mo on AI tools. Audit AI found $${saving}/mo in potential savings. Run your free audit now.`,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `I found $${saving}/mo in AI tool savings — Audit AI`,
      description: `This team was spending $${spend}/mo on AI tools. Audit AI found $${saving}/mo in potential savings. Run your free audit now.`,
    },
  };
}

const PRIORITY_COLORS: Record<string, string> = {
  high: "text-red-500",
  medium: "text-yellow-500",
  low: "text-blue-500",
  optimal: "text-green-500",
};

const PRIORITY_LABELS: Record<string, string> = {
  high: "High savings",
  medium: "Some savings",
  low: "Minor suggestion",
  optimal: "Already optimal",
};

export default async function AuditPage({ params }: Props) {
  const { id } = await params;
  const audit = await getAudit(id);

  if (!audit || !audit.audit_data) {
    notFound();
  }

  const summary = audit.audit_data as AuditSummary;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Banner */}
      <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 text-center">
        <p className="text-sm text-blue-800">
          This is a shared audit result.{" "}
          <Link href="/" className="font-semibold underline">
             Run your own free audit
          </Link>
        </p>
      </div>

      {/* Hero savings block */}
      <div className="rounded-xl border p-6 space-y-1">
        <p className="text-sm text-muted-foreground">Total potential savings found</p>
        <p className="text-5xl font-bold">
          ${summary.totalMonthlySaving}
          <span className="text-xl font-normal text-muted-foreground">/mo</span>
        </p>
        <p className="text-muted-foreground">
          That is{" "}
          <span className="font-semibold text-foreground">
            ${summary.totalAnnualSaving}/year
          </span>{" "}
          in potential savings.
        </p>
        <p className="text-sm text-muted-foreground pt-1">
          Current spend: ${summary.totalCurrentSpend}/mo
        </p>
      </div>

      {/* Fallback summary on shared page */}
      <div className="rounded-xl border p-6 space-y-2">
         <p className="text-sm font-medium">Audit summary</p>
         <p className="text-sm text-muted-foreground leading-relaxed">
          {summary.totalMonthlySaving > 0
          ? `This team of ${summary.teamSize} was spending $${summary.totalCurrentSpend}/month on AI tools for ${summary.useCase} use. The audit identified $${summary.totalMonthlySaving}/month ($${summary.totalAnnualSaving}/year) in potential savings by optimizing their tool selection and plans.`
          : `This team of ${summary.teamSize} is spending $${summary.totalCurrentSpend}/month on AI tools for ${summary.useCase} use. Their stack is well optimized with no significant savings identified.`
          }
         </p>
      </div>

      {/* Credex callout */}
      {summary.totalMonthlySaving > 200 && (
        <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 space-y-2">
          <p className="font-semibold text-blue-900">
            Save even more with Credex
          </p>
          <p className="text-sm text-blue-800">
            Credex sells discounted AI credits at 20-40% below retail.
          </p>
          <Link
            href="https://credex.rocks"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
          >
            Learn about Credex 
          </Link>
        </div>
      )}

      {/* Per tool breakdown */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Per-tool breakdown</h2>
        {summary.results.map((result) => (
          <div key={result.toolId} className="rounded-xl border p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="font-medium">{result.toolName}</p>
              <span className={`text-sm font-medium ${PRIORITY_COLORS[result.priority]}`}>
                {PRIORITY_LABELS[result.priority]}
              </span>
            </div>
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
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="rounded-xl border p-6 text-center space-y-3">
        <p className="font-semibold">Want to know how much your team could save?</p>
        <p className="text-sm text-muted-foreground">
          Run your free AI spend audit in 60 seconds.
        </p>
        <Link
          href="/"
          className="inline-block bg-black text-white text-sm font-medium px-6 py-3 rounded-lg hover:bg-gray-800"
        >
          Run my free audit
        </Link>
      </div>
    </div>
  );
}