import { z } from "zod";

export const chatMessageSchema = z.object({
  feature: z.enum([
    "tutor",
    "coding-assistant",
    "research",
    "career-coach",
    "study-planner",
    "notes-gen",
    "quiz-gen",
    "resume-builder",
    "prompt-gen",
  ]),
  chatId: z.string().cuid().optional(),
  message: z.string().min(1).max(8000),
});

export const signUpSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(72),
});
