import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter, Outfit } from "next/font/google";
import { Footer } from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const starFont = localFont({
  src: "../../public/StarFont_Sans.ttf",
  variable: "--font-star",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Daily Horoscope — Powered by FreeAstroAPI",
  description:
    "A clean, modern daily horoscope reading. Pick your zodiac sign, choose a date, and get your personalized forecast powered by FreeAstroAPI.",
  openGraph: {
    title: "Daily Horoscope",
    description:
      "A clean, modern daily horoscope reading powered by FreeAstroAPI.",
    type: "website",
    siteName: "Daily Horoscope",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daily Horoscope",
    description:
      "A clean, modern daily horoscope reading powered by FreeAstroAPI.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${outfit.variable} ${starFont.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
