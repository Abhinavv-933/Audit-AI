"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  totalMonthlySaving: number;
  totalCurrentSpend: number;
  teamSize: number;
  useCase: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LeadCaptureModal({
  totalMonthlySaving,
  totalCurrentSpend,
  teamSize,
  useCase,
  onClose,
  onSuccess,
}: Props) {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          companyName,
          role,
          teamSize: String(teamSize),
          useCase,
          totalMonthlySaving,
          totalCurrentSpend,
          website: "", // honeypot field
        }),
      });

      if (!response.ok) throw new Error("Failed to submit");

      onSuccess();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Get your full report</CardTitle>
          <p className="text-sm text-muted-foreground">
            We found{" "}
            <span className="font-semibold text-foreground">
              ${totalMonthlySaving}/mo
            </span>{" "}
            in potential savings. Enter your email to save this audit.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Honeypot field — hidden from real users */}
          <input
            type="text"
            name="website"
            style={{ display: "none" }}
            tabIndex={-1}
            autoComplete="off"
          />

          <div className="space-y-2">
            <Label>Email address *</Label>
            <Input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Company name</Label>
            <Input
              type="text"
              placeholder="Acme Inc (optional)"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Your role</Label>
            <Input
              type="text"
              placeholder="e.g. CTO, Engineering Manager (optional)"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Saving..." : "Get my report →"}
          </Button>

          <button
            onClick={onClose}
            className="w-full text-sm text-muted-foreground hover:underline"
          >
            Skip for now
          </button>
        </CardContent>
      </Card>
    </div>
  );
}