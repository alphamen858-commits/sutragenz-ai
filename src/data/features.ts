import {
  GraduationCap, Code2, Search, Compass, ImageIcon, Video, CalendarClock,
  NotebookPen, ListChecks, FileText, Sparkles, TerminalSquare, Blocks,
} from "lucide-react";

export interface FeatureDef {
  key: string;
  name: string;
  href: string;
  tagline: string; // short — used in nav-style lists
  description: string;
  longDescription: string;
  icon: typeof GraduationCap;
  accent: "cyan" | "electric" | "violet";
  chatFeature?: string; // maps to FEATURE_PROVIDER / FEATURE_SYSTEM_PROMPTS key
}

export const FEATURES: FeatureDef[] = [
  {
    key: "tutor",
    name: "AI Tutor",
    href: "/dashboard/tutor",
    tagline: "Learn with clarity.",
    description: "Break down difficult ideas, practice with examples, and build confidence one question at a time.",
    longDescription: "Ask anything from a school topic to a first-year engineering concept. The tutor breaks it down step by step and checks your understanding as you go.",
    icon: GraduationCap,
    accent: "cyan",
    chatFeature: "tutor",
  },
  {
    key: "coding-assistant",
    name: "Coding Assistant",
    href: "/dashboard/coding-assistant",
    tagline: "Ship clean code, faster.",
    description: "Paste an error, describe a feature, or ask why your code isn't working, and get working code with a plain explanation.",
    longDescription: "Paste an error, describe a feature, or ask why your code isn't working. Get working code plus a plain-language explanation.",
    icon: Code2,
    accent: "violet",
    chatFeature: "coding-assistant",
  },
  {
    key: "research",
    name: "Research Assistant",
    href: "/dashboard/research",
    tagline: "Turn noise into signal.",
    description: "Turn a broad question into a structured brief with cited sources and a summary you can actually use.",
    longDescription: "Turn a broad question into a structured brief with cited sources and a clear summary you can actually use in an assignment.",
    icon: Search,
    accent: "electric",
    chatFeature: "research",
  },
  {
    key: "career-coach",
    name: "Career Coach",
    href: "/dashboard/career-coach",
    tagline: "Make your next move.",
    description: "Tell it where you are and where you want to go, and get a concrete roadmap and honest resume feedback.",
    longDescription: "Tell it where you are and where you want to go. Get a concrete roadmap, skills to prioritize, and honest resume feedback.",
    icon: Compass,
    accent: "cyan",
    chatFeature: "career-coach",
  },
  {
    key: "image-gen",
    name: "Image Generator",
    href: "/dashboard/image-gen",
    tagline: "Make the vision visible.",
    description: "Describe what you need and generate an image for your project, poster, or presentation.",
    longDescription: "Describe what you need — a diagram, a mockup, a poster — and generate an image to use in your project or presentation.",
    icon: ImageIcon,
    accent: "violet",
  },
  {
    key: "video-gen",
    name: "Video Generator",
    href: "/dashboard/video-gen",
    tagline: "Direct the next frame.",
    description: "Turn a short script into a generated video clip for projects and presentations.",
    longDescription: "Early access tool for turning a short script into a generated video clip for projects and presentations.",
    icon: Video,
    accent: "electric",
  },
  {
    key: "study-planner",
    name: "Study Planner",
    href: "/dashboard/study-planner",
    tagline: "Turn deadlines into a plan.",
    description: "Give it your subjects and exam date and get a realistic day-by-day plan that adapts as it gets closer.",
    longDescription: "Give it your subjects and exam date. Get a realistic day-by-day plan that adapts as your deadline gets closer.",
    icon: CalendarClock,
    accent: "cyan",
  },
  {
    key: "notes-gen",
    name: "Notes Generator",
    href: "/dashboard/notes",
    tagline: "Worth keeping, not just taking.",
    description: "Generate organized, exam-ready notes on a topic, or condense your own material into a tighter summary.",
    longDescription: "Generate organized, exam-ready notes on a topic, or condense your own material into a tighter summary.",
    icon: NotebookPen,
    accent: "violet",
  },
  {
    key: "quiz-gen",
    name: "Quiz Generator",
    href: "/dashboard/quiz",
    tagline: "Find out what you actually know.",
    description: "Turn any topic or your own notes into a quiz, take it in the app, and see where you need to review.",
    longDescription: "Turn any topic or your own notes into a quiz, take it right in the app, and see where you actually need to review.",
    icon: ListChecks,
    accent: "electric",
  },
  {
    key: "resume-builder",
    name: "Resume Builder",
    href: "/dashboard/resume",
    tagline: "Say more with less.",
    description: "Fill in your experience and get a formatted resume plus specific, section-by-section feedback.",
    longDescription: "Fill in your experience and get a formatted resume plus specific, section-by-section feedback.",
    icon: FileText,
    accent: "cyan",
  },
  {
    key: "prompt-gen",
    name: "Prompt Generator",
    href: "/dashboard/prompt-gen",
    tagline: "Ask better questions.",
    description: "Describe what you're trying to get an AI to do, and get back a sharper, more specific prompt.",
    longDescription: "Describe what you're trying to get an AI to do, and get back a sharper, more specific prompt that gets better results.",
    icon: Sparkles,
    accent: "violet",
    chatFeature: "prompt-gen",
  },
  {
    key: "playground",
    name: "Coding Playground",
    href: "/dashboard/playground",
    tagline: "Learn by building, not reading.",
    description: "A built-in code editor with instant preview across five learning tracks: HTML, CSS, JS, Python, AI/ML.",
    longDescription: "A built-in code editor with instant preview — write, run, and learn by doing across five learning tracks.",
    icon: TerminalSquare,
    accent: "electric",
  },
  {
    key: "project-builder",
    name: "AI Project Builder",
    href: "/dashboard/project-builder",
    tagline: "From thought to prototype.",
    description: "Describe a project idea and get a starting file structure and code you can keep building on.",
    longDescription: "Describe a project idea and get a starting file structure and code you can keep building on in the Playground.",
    icon: Blocks,
    accent: "cyan",
  },
];
