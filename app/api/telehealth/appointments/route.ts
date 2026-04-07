import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import * as telehealth from "@/lib/telehealth";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: appointments } = await supabase
      .from("appointments")
      .select("*")
      .eq("user_id", user.id)
      .order("scheduled_at", { ascending: true });

    return NextResponse.json({ appointments: appointments || [] });
  } catch (error) {
    console.error("Appointments fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { provider_id, slot_id } = await request.json();

    if (!provider_id || !slot_id) {
      return NextResponse.json(
        { error: "Missing provider_id or slot_id" },
        { status: 400 }
      );
    }

    const appointment = await telehealth.bookAppointment(
      user.id,
      provider_id,
      slot_id
    );

    await supabase.from("appointments").insert({
      user_id: user.id,
      provider_id: appointment.provider_id,
      provider_name: appointment.provider_name,
      scheduled_at: appointment.scheduled_at,
      status: "confirmed",
      video_link: appointment.video_link,
    });

    return NextResponse.json({ success: true, appointment });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: "Failed to book appointment" },
      { status: 500 }
    );
  }
}