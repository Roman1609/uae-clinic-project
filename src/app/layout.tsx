import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0D0F12",
};

export const metadata: Metadata = {
  title: "DubaiMed Consult | Turnkey Medical Clinic Setup & Licensing in Dubai",
  description:
    "Premier healthcare advisory firm in Dubai, UAE. End-to-end medical clinic establishment, DHA / MOH licensing, health facility engineering, legal structuring, and medical equipment procurement.",
  keywords: [
    "Medical Clinic Setup Dubai",
    "DHA License Dubai",
    "Healthcare Consulting UAE",
    "MOH Approval UAE",
    "Clinic Fitout Compliance",
    "Dubai Healthcare City Registration",
  ],
  authors: [{ name: "DubaiMed Consult Advisory" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${jakarta.variable} scroll-smooth dark`}
    >
      <body className="bg-obsidian text-white font-jakarta antialiased selection:bg-gold-500 selection:text-obsidian">
        {children}
      </body>
    </html>
  );
}
