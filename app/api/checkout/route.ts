import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { variantId, email, tier } = await request.json();

    if (!variantId || !email) {
      return NextResponse.json(
        { error: "Missing variantId or email" },
        { status: 400 }
      );
    }

    const lemonsqueezyUrl = process.env.NEXT_PUBLIC_LEMONSQUEEZY_URL || "https://store.lemonsqueezy.com";
    const apiKey = process.env.LEMONSQUEEZY_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Lemon Squeezy not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(`${lemonsqueezyUrl}/api/v1/checkouts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Accept": "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            checkout_data: {
              email,
              custom: {
                tier,
              },
            },
          },
          relationships: {
            store: {
              data: {
                type: "stores",
                id: process.env.LEMONSQUEEZY_STORE_ID!,
              },
            },
            variant: {
              data: {
                type: "variants",
                id: variantId,
              },
            },
          },
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || "Failed to create checkout" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ checkoutUrl: data.data.attributes.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}