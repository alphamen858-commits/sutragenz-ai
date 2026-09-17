import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Get started with the essentials.",
    features: [
      "Coding Playground — free for everyone, no limits",
      "20 AI requests / hour",
      "AI Tutor, Coding Assistant & Research Assistant",
      "Study Planner",
    ],
    cta: "Start free",
    href: "/sign-up",
    featured: false,
  },
  {
    name: "Pro",
    price: "₹299",
    period: "/ month",
    description: "For students who use it daily.",
    features: [
      "Everything in Free",
      "200 AI requests / hour",
      "Career Coach, Notes, Quiz, Resume Builder, Prompt Generator & Image Generator",
      "Priority AI models",
      "Unlimited projects & notes",
    ],
    cta: "Go Pro",
    href: "/sign-up?plan=pro",
    featured: true,
  },
  {
    name: "Premium",
    price: "₹499",
    period: "/ month",
    description: "For power users who want no limits.",
    features: [
      "Everything in Pro",
      "Unlimited AI requests",
      "AI Project Builder & Video Generator",
      "Priority support",
    ],
    cta: "Go Premium",
    href: "/sign-up?plan=premium",
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative mx-auto max-w-6xl px-6 py-28">
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
          Pricing that grows with you
        </h2>
        <p className="mt-4 text-white/55">Start free. Upgrade when the free tier stops being enough.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.name}
            className={cn(
              "card-surface flex flex-col rounded-2xl p-8",
              p.featured && "border-cyan/40 shadow-glow"
            )}
          >
            {p.featured && (
              <span className="mb-4 w-fit rounded-full bg-cyan/10 px-3 py-1 text-xs font-medium text-cyan">
                Most popular
              </span>
            )}
            <h3 className="font-display text-lg font-medium text-white">{p.name}</h3>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="font-display text-3xl font-semibold text-white">{p.price}</span>
              <span className="text-sm text-white/40">{p.period}</span>
            </div>
            <p className="mt-2 text-sm text-white/50">{p.description}</p>

            <ul className="mt-6 flex-1 space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-white/70">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan" />
                  {f}
                </li>
              ))}
            </ul>

            <Button
              href={p.href}
              variant={p.featured ? "primary" : "outline"}
              className="mt-8 w-full"
            >
              {p.cta}
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
