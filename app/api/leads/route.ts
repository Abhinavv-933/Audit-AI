import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      companyName,
      role,
      teamSize,
      useCase,
      totalMonthlySaving,
      totalCurrentSpend,
    } = body;

    // Basic honeypot check
    if (body.website) {
      return NextResponse.json({ success: true });
    }

    // Basic validation
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email required" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("leads").insert([
      {
        email,
        company_name: companyName,
        role,
        team_size: teamSize,
        use_case: useCase,
        total_monthly_saving: totalMonthlySaving,
        total_current_spend: totalCurrentSpend,
      },
    ]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead capture error:", error);
    return NextResponse.json(
      { error: "Failed to save lead" },
      { status: 500 }
    );
  }
}