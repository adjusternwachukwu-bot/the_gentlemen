import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import * as telehealth from "@/lib/telehealth";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const intakeData = await request.json();
    const insuranceProvider = intakeData.insurance_provider;
    const insuranceId = intakeData.insurance_id;

    let insuranceCovered = false;
    if (insuranceProvider && insuranceId) {
      try {
        const insurance = await telehealth.checkInsuranceEligibility(
          insuranceProvider,
          insuranceId
        );
        insuranceCovered = insurance.covered;
      } catch {
        insuranceCovered = false;
      }
    }

    const referral = await telehealth.createReferral(user.id, {
      ...intakeData,
      insurance_covered: insuranceCovered,
    });

    if (referral.provider_id) {
      await supabase.from("profiles").update({
        insurance_provider: insuranceProvider,
        insurance_id: insuranceId,
      }).eq("id", user.id);
    }

    return NextResponse.json({
      success: true,
      provider_id: referral.provider_id,
      provider_name: referral.provider_name,
      insurance_covered: insuranceCovered,
    });
  } catch (error) {
    console.error("Referral error:", error);
    return NextResponse.json(
      { error: "Failed to create referral" },
      { status: 500 }
    );
  }
}