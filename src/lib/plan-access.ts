// Server-side plan gating — matches the feature lists on the Pricing page
// exactly. This is the part a UI-only check can't replace: without this,
// a Free user could call /api/image-gen directly and it would just work,
// regardless of what the pricing page promises.

export type Plan = "FREE" | "PRO" | "PREMIUM";

// Features every plan tier unlocks, in addition to the tier below it.
const FREE_FEATURES = new Set(["tutor", "coding-assistant", "study-planner", "research"]);
const PRO_ONLY_FEATURES = new Set([
  "career-coach",
  "notes-gen",
  "quiz-gen",
  "resume-builder",
  "prompt-gen",
  "image-gen",
]);
const PREMIUM_ONLY_FEATURES = new Set(["video-gen", "project-builder"]);

// Playground is intentionally NOT in any of these sets — it needs no AI
// provider and no plan check; every signed-in user gets it, per the
// pricing page's "free for everyone" line.

export function canAccessFeature(plan: string, feature: string): boolean {
  if (FREE_FEATURES.has(feature)) return true;
  if (plan === "PREMIUM") return true; // Premium includes everything below it
  if (plan === "PRO") return PRO_ONLY_FEATURES.has(feature);
  return false; // FREE plan, feature not in FREE_FEATURES
}

export function requiredPlanFor(feature: string): Plan {
  if (FREE_FEATURES.has(feature)) return "FREE";
  if (PRO_ONLY_FEATURES.has(feature)) return "PRO";
  return "PREMIUM";
}
