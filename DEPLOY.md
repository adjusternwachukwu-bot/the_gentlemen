# Vercel Deployment Guide for The Gentlemen

## 1. Push to GitHub
```bash
cd /Users/milleon/Projects/the-gentlemen
git init
git add .
git commit -m "Initial build - The Gentlemen"
```

Create a new repo on GitHub, then:
```bash
git remote add origin https://github.com/YOUR_USERNAME/the-gentlemen.git
git push -u origin main
```

## 2. Connect to Vercel
1. Go to https://vercel.com
2. Click "Add New..." → Project
3. Import your GitHub repo
4. Add environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://mlxehkizccexcwsbhppy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=your-service-key
LEMONSQUEEZY_API_KEY=eyJxxx
LEMONSQUEEZY_STORE_ID=your-store-id
LEMONSQUEEZY_WEBHOOK_SECRET=your-webhook-secret
NEXT_PUBLIC_LEMONSQUEEZY_URL=https://store.lemonsqueezy.com
NEXT_PUBLIC_LEMONSQUEEZY_STARTER_VARIANT_ID=xxx
NEXT_PUBLIC_LEMONSQUEEZY_MEMBER_VARIANT_ID=xxx
NEXT_PUBLIC_LEMONSQUEEZY_GENTLEMAN_VARIANT_ID=xxx
TELEHEALTH_API_KEY=your-key
TELEHEALTH_API_BASE_URL=https://api.partner.com
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

5. Click Deploy

## 3. Add Domain
After deploying:
1. Go to Vercel → Settings → Domains
2. Add your domain (thegentlemen.co)
3. Update DNS records as shown

## 4. Update Webhooks
After getting domain, update Lemon Squeezy webhook:
- URL: `https://your-domain.com/api/webhooks/lemonsqueezy`