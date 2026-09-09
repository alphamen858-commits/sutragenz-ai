"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Save } from "lucide-react";

const Monaco = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const PYODIDE_VERSION = "0.26.4";
const PYODIDE_SCRIPT_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/pyodide.js`;

declare global {
  interface Window {
    loadPyodide?: (config?: { indexURL: string }) => Promise<any>;
  }
}

// Pyodide (~10MB) is only fetched the first time a Python/AI-ML run happens
// in a session, then cached on `window` for the rest of the session.
let pyodideLoadPromise: Promise<any> | null = null;

async function getPyodide(onStatus: (msg: string) => void) {
  if (pyodideLoadPromise) return pyodideLoadPromise;

  pyodideLoadPromise = (async () => {
    if (!window.loadPyodide) {
      onStatus("Loading Python runtime (first run only, ~10MB)…");
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = PYODIDE_SCRIPT_URL;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load the Python runtime script."));
        document.head.appendChild(script);
      });
    }
    onStatus("Starting Python interpreter…");
    return window.loadPyodide!({ indexURL: `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/` });
  })();

  return pyodideLoadPromise;
}

const LANGUAGES = [
  { key: "html", label: "HTML", monaco: "html" },
  { key: "css", label: "CSS", monaco: "css" },
  { key: "javascript", label: "JavaScript", monaco: "javascript" },
  { key: "python", label: "Python", monaco: "python" },
  { key: "ai-ml", label: "AI / ML (Python)", monaco: "python" },
] as const;

const STARTERS: Record<string, string> = {
  html: "<h1>Hello, Sutragenz!</h1>\n<p>Edit this HTML and see it render on the right.</p>",
  css: "body {\n  font-family: sans-serif;\n  color: #05050A;\n  padding: 2rem;\n}\nh1 { color: #2E6BFF; }",
  javascript: "// Runs in your browser console via the Run button\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\nconsole.log(greet('Sutragenz'));",
  python: "name = 'Sutragenz'\nfor i in range(3):\n    print(f'Hello, {name}! ({i + 1})')",
  "ai-ml": "# Starter: a tiny linear regression from scratch — runs fully in-browser via Pyodide\ndef predict(x, w, b):\n    return w * x + b\n\nfor x in range(5):\n    print(x, '->', round(predict(x, 1.5, 0.2), 2))",
};

export function CodeEditor({ initialLanguage = "html" }: { initialLanguage?: string }) {
  const [language, setLanguage] = useState(initialLanguage);
  const [code, setCode] = useState(STARTERS[initialLanguage]);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [pyBusy, setPyBusy] = useState(false);
  const pyodideRef = useRef<any>(null);

  useEffect(() => {
    if (pyodideLoadPromise) pyodideLoadPromise.then((p) => (pyodideRef.current = p));
  }, []);

  const monacoLang = useMemo(
    () => LANGUAGES.find((l) => l.key === language)?.monaco ?? "plaintext",
    [language]
  );

  async function runCode() {
    if (language === "javascript") {
      const logs: string[] = [];
      const originalLog = console.log;
      console.log = (...args) => logs.push(args.map(String).join(" "));
      try {
        // eslint-disable-next-line no-new-func
        new Function(code)();
      } catch (err) {
        logs.push(String(err));
      }
      console.log = originalLog;
      setConsoleOutput(logs);
      return;
    }

    if (language === "python" || language === "ai-ml") {
      setPyBusy(true);
      setConsoleOutput(["Preparing Python runtime…"]);
      try {
        const pyodide = await getPyodide((msg) => setConsoleOutput([msg]));
        pyodideRef.current = pyodide;

        const logs: string[] = [];
        pyodide.setStdout({ batched: (msg: string) => logs.push(msg) });
        pyodide.setStderr({ batched: (msg: string) => logs.push(msg) });

        await pyodide.runPythonAsync(code);
        setConsoleOutput(logs.length ? logs : ["(No output — nothing was printed.)"]);
      } catch (err) {
        setConsoleOutput([String(err)]);
      } finally {
        setPyBusy(false);
      }
      return;
    }

    setConsoleOutput(["Preview updates automatically for HTML/CSS."]);
  }

  async function saveProject() {
    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: `${language} sketch`,
        techStack: language,
        description: code.slice(0, 300),
      }),
    });
  }

  const isWeb = language === "html" || language === "css";

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-2">
          {LANGUAGES.map((l) => (
            <button
              key={l.key}
              onClick={() => {
                setLanguage(l.key);
                setCode(STARTERS[l.key]);
                setConsoleOutput([]);
              }}
              className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${
                language === l.key
                  ? "bg-cyan/15 text-cyan border border-cyan/30"
                  : "text-white/50 border border-white/10 hover:text-white"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={runCode}
            disabled={pyBusy}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan to-electric px-4 py-1.5 text-xs font-medium text-space-900 disabled:opacity-50"
          >
            <Play className="h-3.5 w-3.5" /> {pyBusy ? "Running…" : "Run"}
          </button>
          <button
            onClick={saveProject}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 px-4 py-1.5 text-xs text-white/70 hover:text-white"
          >
            <Save className="h-3.5 w-3.5" /> Save
          </button>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-4 overflow-hidden lg:grid-cols-2">
        <div className="card-surface overflow-hidden rounded-2xl">
          <Monaco
            height="100%"
            language={monacoLang}
            theme="vs-dark"
            value={code}
            onChange={(v) => setCode(v ?? "")}
            options={{ minimap: { enabled: false }, fontSize: 13, padding: { top: 16 } }}
          />
        </div>

        <div className="card-surface flex flex-col overflow-hidden rounded-2xl">
          {isWeb ? (
            <iframe
              title="preview"
              className="h-full w-full bg-white"
              sandbox="allow-scripts"
              srcDoc={language === "html" ? code : `<style>${code}</style><h1>Hello, Sutragenz!</h1>`}
            />
          ) : (
            <div className="flex-1 space-y-1 overflow-y-auto bg-space-900 p-4 font-mono text-xs text-white/70">
              {consoleOutput.length === 0 ? (
                <p className="text-white/30">Run your code to see output here.</p>
              ) : (
                consoleOutput.map((line, i) => <p key={i}>{line}</p>)
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
