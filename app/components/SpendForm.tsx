"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { runAudit } from "@/lib/auditEngine";
import type { AuditSummary } from "@/lib/auditEngine";
import AuditResults from "./AuditResults";

const AI_TOOLS = [
  {
    id: "cursor",
    name: "Cursor",
    plans: ["Hobby", "Pro", "Business", "Enterprise"],
  },
  {
    id: "github_copilot",
    name: "GitHub Copilot",
    plans: ["Individual", "Business", "Enterprise"],
  },
  {
    id: "claude",
    name: "Claude",
    plans: ["Free", "Pro", "Max", "Team", "Enterprise", "API Direct"],
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    plans: ["Plus", "Team", "Enterprise", "API Direct"],
  },
  {
    id: "anthropic_api",
    name: "Anthropic API Direct",
    plans: ["Pay as you go"],
  },
  {
    id: "openai_api",
    name: "OpenAI API Direct",
    plans: ["Pay as you go"],
  },
  {
    id: "gemini",
    name: "Gemini",
    plans: ["Pro", "Ultra", "API"],
  },
  {
    id: "windsurf",
    name: "Windsurf",
    plans: ["Free", "Pro", "Teams"],
  },
];

const USE_CASES = ["Coding", "Writing", "Data", "Research", "Mixed"];

interface ToolEntry {
  toolId: string;
  plan: string;
  monthlySpend: string;
  seats: string;
}

interface FormData {
  tools: ToolEntry[];
  teamSize: string;
  useCase: string;
}

const DEFAULT_FORM: FormData = {
  tools: [{ toolId: "", plan: "", monthlySpend: "", seats: "1" }],
  teamSize: "",
  useCase: "",
};

export default function SpendForm() {
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM);
  const [auditSummary, setAuditSummary] = useState<AuditSummary | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
  const saved = localStorage.getItem("auditai_form");
  if (saved) {
    setFormData(JSON.parse(saved)); // eslint-disable-line react-hooks/set-state-in-effect
  }
}, []);

  // Save to localStorage on every change
  useEffect(() => {
    localStorage.setItem("auditai_form", JSON.stringify(formData));
  }, [formData]);

  const addTool = () => {
    setFormData((prev) => ({
      ...prev,
      tools: [...prev.tools, { toolId: "", plan: "", monthlySpend: "", seats: "1" }],
    }));
  };

  const removeTool = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tools: prev.tools.filter((_, i) => i !== index),
    }));
  };

  const updateTool = (index: number, field: keyof ToolEntry, value: string) => {
    setFormData((prev) => {
      const updatedTools = [...prev.tools];
      updatedTools[index] = { ...updatedTools[index], [field]: value };
      if (field === "toolId") updatedTools[index].plan = "";
      return { ...prev, tools: updatedTools };
    });
  };

  const getPlansForTool = (toolId: string) => {
    return AI_TOOLS.find((t) => t.id === toolId)?.plans || [];
  };

  const handleSubmit = () => {
    const summary = runAudit(formData.tools, formData.teamSize, formData.useCase);
    setAuditSummary(summary);
  };

  const isFormValid =
    formData.teamSize &&
    formData.useCase &&
    formData.tools.every((t) => t.toolId && t.plan && t.monthlySpend);

  if (auditSummary) {
    return <AuditResults summary={auditSummary} onBack={() => setAuditSummary(null)} />;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Audit AI</h1>
        <p className="text-muted-foreground">
         Find out where you are overspending on AI tools — in 60 seconds.
        </p>
      </div>

      {/* Team info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your team</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Team size</Label>
            <Input
              type="number"
              min="1"
              placeholder="e.g. 5"
              value={formData.teamSize}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, teamSize: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Primary use case</Label>
            <Select
              value={formData.useCase}
              onValueChange={(val) =>
                setFormData((prev) => ({ ...prev, useCase: val }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select use case" />
              </SelectTrigger>
              <SelectContent>
                {USE_CASES.map((uc) => (
                  <SelectItem key={uc} value={uc.toLowerCase()}>
                    {uc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tools */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Your AI tools</h2>
        {formData.tools.map((tool, index) => (
          <Card key={index}>
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tool</Label>
                  <Select
                    value={tool.toolId}
                    onValueChange={(val) => updateTool(index, "toolId", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tool" />
                    </SelectTrigger>
                    <SelectContent>
                      {AI_TOOLS.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Plan</Label>
                  <Select
                    value={tool.plan}
                    onValueChange={(val) => updateTool(index, "plan", val)}
                    disabled={!tool.toolId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {getPlansForTool(tool.toolId).map((p) => (
                        <SelectItem key={p} value={p.toLowerCase()}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Monthly spend ($)</Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="e.g. 40"
                    value={tool.monthlySpend}
                    onChange={(e) =>
                      updateTool(index, "monthlySpend", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Number of seats</Label>
                  <Input
                    type="number"
                    min="1"
                    placeholder="e.g. 3"
                    value={tool.seats}
                    onChange={(e) =>
                      updateTool(index, "seats", e.target.value)
                    }
                  />
                </div>
              </div>
              {formData.tools.length > 1 && (
                <button
                  onClick={() => removeTool(index)}
                  className="text-sm text-red-500 hover:underline"
                >
                  Remove this tool
                </button>
              )}
            </CardContent>
          </Card>
        ))}

        <Button variant="outline" onClick={addTool} className="w-full">
          + Add another tool
        </Button>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!isFormValid}
        className="w-full"
        size="lg"
      >
        Run my audit →
      </Button>
    </div>
  );
}