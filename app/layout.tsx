import type { Metadata } from "next";
import { Playfair_Display, Open_Sans, Outfit } from "next/font/google";
import "./globals.css";
import InitialPageLoader from "@/components/hodu/InitialPageLoader";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["500", "600", "700", "800", "900"],
});

const openSans = Open_Sans({
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
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon.png' },
    ],
    shortcut: ['/favicon.ico'],
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
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${openSans.variable} ${outfit.variable} h-full antialiased font-sans`}
    >
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-brand-bg text-brand-text selection:bg-brand-maroon selection:text-white overflow-x-hidden max-w-full w-full">
        <InitialPageLoader minDuration={2200} />
        {children}
      </body>
    </html>
  );
}
