import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["500", "600", "700", "800", "900"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Hodu Academy — Premier Coaching Institute for Cambridge, IB, CBSE, JEE & NEET",
  description: "Jaipur's premier academic coaching institute for Cambridge IGCSE, IB DP, CBSE Class 9-12, IIT-JEE, and NEET.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${plusJakarta.variable} ${outfit.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col font-sans bg-brand-bg text-brand-navy selection:bg-brand-maroon selection:text-white">
        {children}
      </body>
    </html>
  );
}
