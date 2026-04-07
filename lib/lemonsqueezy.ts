const LEMONSQUEEZY_API_URL = process.env.NEXT_PUBLIC_LEMONSQUEEZY_URL || 'https://store.lemonsqueezy.com';

interface LemonSqueezyVariant {
  id: string;
  name: string;
  price: number;
}

export interface LemonSqueezyProduct {
  id: string;
  name: string;
  variants: LemonSqueezyVariant[];
}

export async function getProducts(): Promise<LemonSqueezyProduct[]> {
  const response = await fetch(`${LEMONSQUEEZY_API_URL}/api/v1/products`, {
    headers: {
      'Authorization': `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
      'Accept': 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  const data = await response.json();
  return data.data;
}

export async function createCheckoutUrl(variantId: string, userEmail: string): Promise<string> {
  const response = await fetch(`${LEMONSQUEEZY_API_URL}/api/v1/checkouts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
      'Accept': 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    },
    body: JSON.stringify({
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: {
            email: userEmail,
          },
        },
        relationships: {
          store: {
            data: {
              type: 'stores',
              id: process.env.LEMONSQUEEZY_STORE_ID!,
            },
          },
          variant: {
            data: {
              type: 'variants',
              id: variantId,
            },
          },
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create checkout');
  }

  const data = await response.json();
  return data.data.attributes.url;
}

export async function getSubscriptions(customerId: string) {
  const response = await fetch(
    `${LEMONSQUEEZY_API_URL}/api/v1/subscriptions?filter[customer_id]=${customerId}`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
        'Accept': 'application/vnd.api+json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch subscriptions');
  }

  const data = await response.json();
  return data.data;
}