import type { Metadata } from "next";
import { Anton, Poppins, Space_Mono } from "next/font/google";
import "./globals.css";

// Font set matches the Google Fonts link present on every FEROZ source page
// (Anton, Poppins, Space Mono), self-hosted here via next/font instead of a
// per-page <link> tag.
const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-poppins",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: "FEROZ",
  description: "Solid Gear. Tested In Nature.",
};

// Structural root layout only — no page content lives here. Route pages
// (Home, Men, Product Detail, etc.) are intentionally not implemented yet.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${poppins.variable} ${spaceMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
