// Multi-model routing: try the feature's preferred provider first, then
// fall back through whichever OTHER providers actually have a key
// configured. This means a Gemini-only setup (the free option — see
// README) still answers every feature, not just the ones mapped to it.
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI } from "@google/genai";

export type AIProvider = "openai" | "anthropic" | "gemini";

export interface ChatTurn {
  role: "user" | "assistant" | "system";
  content: string;
}

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const gemini = process.env.GOOGLE_GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY })
  : null;

// Default provider per feature — tune based on cost/quality tradeoffs once
// you have paid keys. With only a free Gemini key, this mapping is
// irrelevant anyway — runChat's fallback chain routes everything to Gemini.
export const FEATURE_PROVIDER: Record<string, AIProvider> = {
  tutor: "anthropic",
  "coding-assistant": "anthropic",
  research: "openai",
  "career-coach": "openai",
  "study-planner": "openai",
  "notes-gen": "anthropic",
  "quiz-gen": "openai",
  "resume-builder": "openai",
  "prompt-gen": "anthropic",
};

async function callProvider(provider: AIProvider, system: string, messages: ChatTurn[]): Promise<string> {
  if (provider === "anthropic") {
    if (!anthropic) throw new Error("Anthropic isn't configured.");
    const res = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      system,
      messages: messages.map((m) => ({ role: m.role === "system" ? "user" : m.role, content: m.content })),
    });
    const block = res.content.find((c) => c.type === "text");
    return block && "text" in block ? block.text : "";
  }

  if (provider === "gemini") {
    if (!gemini) throw new Error("Gemini isn't configured.");
    // Gemini 2.5 Flash — the model currently granted on the free tier.
    // Uses the current @google/genai SDK (the old @google/generative-ai
    // package was deprecated by Google and its models are being retired).
    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));
    const res = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: { systemInstruction: system },
    });
    return res.text ?? "";
  }

  if (provider === "openai") {
    if (!openai) throw new Error("OpenAI isn't configured.");
    const res = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: system }, ...messages],
    });
    return res.choices[0]?.message?.content ?? "";
  }

  throw new Error(`Unknown provider: ${provider}`);
}

export async function runChat(opts: {
  provider: AIProvider;
  system: string;
  messages: ChatTurn[];
}): Promise<string> {
  const { provider, system, messages } = opts;

  // Try the requested provider first, then every other configured provider,
  // in a fixed order (gemini first since it's the free option most people
  // will actually have configured).
  const order: AIProvider[] = Array.from(new Set([provider, "gemini", "openai", "anthropic"]));

  let lastError: unknown;
  for (const p of order) {
    try {
      return await callProvider(p, system, messages);
    } catch (err) {
      console.error(`AI PROVIDER FAILED [${p}]:`, err instanceof Error ? err.message : err);
      lastError = err;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("No AI provider is configured — add at least one API key.");
}

export const FEATURE_SYSTEM_PROMPTS: Record<string, string> = {
  tutor:
    "You are the Sutragenz AI Tutor. Explain concepts step by step, at the level of the student you're speaking with, and check understanding before moving on. Prefer worked examples over abstract definitions.",
  "coding-assistant":
    "You are the Sutragenz Coding Assistant. Write correct, well-commented code, explain your reasoning briefly, and point out bugs precisely when debugging.",
  research:
    "You are the Sutragenz Research Assistant. Produce structured, well-cited summaries. Distinguish established facts from open questions.",
  "career-coach":
    "You are the Sutragenz Career Coach. Give concrete, actionable roadmaps and skill recommendations tailored to the student's stated goals.",
  "prompt-gen":
    "You are the Sutragenz Prompt Generator. Take a rough description of what someone wants an AI to do and rewrite it as a sharper, more specific prompt — clear task, relevant context, output format, and constraints. Return the improved prompt first, then a one-line note on what you changed and why.",
};
