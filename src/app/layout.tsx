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

const siteUrl = "https://dubaimed.consulting";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "DubaiMed Consult | Turnkey Medical Clinic Setup & Licensing in Dubai",
    template: "%s | DubaiMed Consult",
  },
  description:
    "Premier healthcare advisory firm in Dubai, UAE. End-to-end medical clinic establishment, DHA / MOH licensing, healthcare facility engineering, 100% foreign ownership corporate structuring, and OEM equipment procurement.",
  keywords: [
    "Medical Clinic Setup Dubai",
    "DHA License Dubai",
    "Healthcare Consulting UAE",
    "Open Clinic in Dubai",
    "DHA Facility Approval",
    "MOHAP Licensing UAE",
    "Dubai Healthcare City Registration",
    "Medical Facility Fit-out Dubai",
    "Aesthetic Clinic Setup UAE",
    "Dental Clinic Licensing Dubai",
    "Healthcare Business Investment Dubai",
  ],
  authors: [{ name: "DubaiMed Consult Advisory", url: siteUrl }],
  creator: "DubaiMed Consult",
  publisher: "DubaiMed Consult",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "DubaiMed Consult | Turnkey Medical Clinic Setup & Licensing in Dubai",
    description:
      "Launch your compliant, profitable medical clinic in the UAE. 100% DHA audit pass rate, fast-track licensing, prime location scouting, and turnkey architectural fit-out.",
    siteName: "DubaiMed Consult",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "DubaiMed Consult - Turnkey Medical Clinic Setup & DHA Licensing in Dubai",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DubaiMed Consult | Turnkey Medical Clinic Setup in Dubai",
    description:
      "Premier healthcare corporate advisory and DHA/MOH licensing for doctors and healthcare investors in Dubai.",
    images: ["/og-image.jpg"],
    creator: "@DubaiMedConsult",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "DubaiMed Consult",
  image: "https://dubaimed.consulting/og-image.jpg",
  description:
    "Turnkey Medical Clinic Setup, DHA/MOH Licensing, Architectural Compliance Fit-out & Healthcare Business Advisory in Dubai, UAE.",
  url: "https://dubaimed.consulting",
  telephone: "+971-4-000-0000",
  priceRange: "$$$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dubai",
    addressRegion: "Dubai",
    addressCountry: "AE",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 25.2048,
    longitude: 55.2708,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "18:00",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Healthcare Advisory Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "DHA & MOH Regulatory Licensing",
          description: "Complete medical facility & practitioner approvals with zero rejection risk.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Medical Clinic Fit-out & Architectural Compliance",
          description: "DHA engineering guidelines, cleanroom standards, and Dubai Civil Defence clearances.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "100% Foreign Ownership Healthcare Company Incorporation",
          description: "Mainland and Dubai Healthcare City (DHCC) freezone medical commercial licensing.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Tier-1 Medical Equipment Procurement & Staff Credentialing",
          description: "Direct OEM supply chain and global specialist physician recruitment.",
        },
      },
    ],
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
      className={`${playfair.variable} ${jakarta.variable} scroll-smooth dark`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-obsidian text-white font-jakarta antialiased selection:bg-gold-500 selection:text-obsidian">
        {children}
      </body>
    </html>
  );
}
