import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-signature");

    if (!webhookSecret || !signature) {
      return NextResponse.json(
        { error: "Webhook not configured" },
        { status: 400 }
      );
    }

    const event = JSON.parse(rawBody);
    const eventName = event.meta?.event_name;
    const customData = event.meta?.custom_data || {};

    if (eventName === "subscription_created" || eventName === "subscription_updated") {
      const supabase = await createClient();
      
      const { user_id, tier, status, subscription_id } = customData;

      if (user_id && tier) {
        await supabase.from("subscriptions").upsert({
          user_id,
          lemonsqueezy_subscription_id: event.data?.id,
          tier,
          status: status || "active",
          current_period_end: new Date(event.data?.attributes?.renews_at).toISOString(),
        });
      }
    }

    if (eventName === "subscription_cancelled") {
      const supabase = await createClient();
      const { user_id } = customData;

      if (user_id) {
        await supabase
          .from("subscriptions")
          .update({ status: "cancelled" })
          .eq("user_id", user_id);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}