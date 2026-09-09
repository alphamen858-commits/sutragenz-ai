import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { StatsStrip } from "@/components/landing/StatsStrip";
import { ToolSwitcher } from "@/components/landing/ToolSwitcher";
import { PointOfView } from "@/components/landing/PointOfView";
import { Pricing } from "@/components/landing/Pricing";
import { ClosingCTA } from "@/components/landing/ClosingCTA";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-space-900">
      <Navbar />
      <Hero />
      <StatsStrip />
      <ToolSwitcher />
      <PointOfView />
      <Pricing />
      <ClosingCTA />
      <Footer />
    </main>
  );
}
