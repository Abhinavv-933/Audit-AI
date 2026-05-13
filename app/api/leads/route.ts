import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
      auditData,
    } = body;

    // Honeypot check
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

    const { data, error } = await supabase
      .from("leads")
      .insert([
        {
          email,
          company_name: companyName,
          role,
          team_size: teamSize,
          use_case: useCase,
          total_monthly_saving: totalMonthlySaving,
          total_current_spend: totalCurrentSpend,
          audit_data: auditData,
        },
      ])
      .select("audit_id")
      .single();

    if (error) throw error;

    await resend.emails.send({
      from: "Audit AI <onboarding@resend.dev>",
      to: email,
      subject: "Your AI spend audit results",
      html: `
        <h2>Your Audit AI results</h2>
        <p>Thanks for running your audit. Here's what we found:</p>
         <ul>
           <li><strong>Current spend:</strong> $${totalCurrentSpend}/mo</li>
           <li><strong>Potential savings:</strong> $${totalMonthlySaving}/mo</li>
           <li><strong>Annual savings:</strong> $${Math.round(totalMonthlySaving * 12)}/mo</li>
         </ul>
        <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/audit/${data.audit_id}">View your full audit report</a></p>
        <p>If your savings are significant, our team at Credex can help you capture even more through discounted AI credits.</p>
        <p>— The Audit AI team</p>
      `,
    });

    return NextResponse.json({ success: true, auditId: data.audit_id });
  } catch (error) {
    console.error("Lead capture error:", error);
    return NextResponse.json(
      { error: "Failed to save lead" },
      { status: 500 }
    );
  }
}