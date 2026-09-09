import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Sutragenz.ai — See. Think. Create.",
  description:
    "The AI operating system for students and future builders: tutoring, coding, research, career coaching, and a full creative + learning toolkit in one place.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  authors: [{ name: "N. Varun Sandeep" }],
  creator: "N. Varun Sandeep",
  openGraph: {
    title: "Sutragenz.ai",
    description: "See. Think. Create. — The AI operating system for students.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="bg-space-900 font-body antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
