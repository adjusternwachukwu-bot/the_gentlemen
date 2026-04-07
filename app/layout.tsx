import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Bebas_Neue } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const bebasi = Bebas_Neue({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Gents | Built for Men Who Perform",
  description: "Premium men's performance platform. Elite network for men who demand more.",
  keywords: ["men's performance", "mental edge", "focus", "drive"],
  metadataBase: new URL("https://thegents.xyz"),
  openGraph: {
    title: "The Gents | Built for Men Who Perform",
    description: "Premium men's performance platform. Elite network.",
    url: "https://thegents.xyz",
    siteName: "The Gents",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} ${bebasi.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-navy-deep text-white">{children}</body>
    </html>
  );
}