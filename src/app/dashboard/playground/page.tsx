import { CodeEditor } from "@/components/playground/CodeEditor";
import { TerminalSquare } from "lucide-react";

export default function PlaygroundPage() {
  return (
    <div>
      <h1 className="mb-4 flex items-center gap-2 font-display text-xl font-semibold text-white">
        <TerminalSquare className="h-5 w-5 text-electric" /> Coding Playground
      </h1>
      <CodeEditor />
    </div>
  );
}
