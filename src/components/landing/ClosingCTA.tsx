import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ClosingCTA() {
  return (
    <section id="constellation" className="relative mx-auto max-w-6xl px-6 py-16">
      <div className="card-surface relative overflow-hidden rounded-3xl bg-gradient-to-br from-electric/15 via-space-800 to-cyan/10 px-8 py-14 sm:px-14">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-cyan/10 blur-[100px]" />
        <h2 className="font-display text-4xl font-semibold text-white sm:text-5xl">
          bigger idea.
        </h2>
        <p className="mt-4 max-w-xl text-white/60">
          Bring the half-formed thought, the impossible brief, the question
          you keep circling. Sutragenz.ai is here to help you see it, think
          it through, and create the first version.
        </p>
        <Button href="/sign-up" variant="primary" className="mt-8 px-8 py-3.5 text-base">
          Start exploring <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
