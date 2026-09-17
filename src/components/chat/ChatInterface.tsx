"use client";

import { useRef, useState } from "react";
import { Send, Paperclip, Image as ImageIcon, Mic, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

export function ChatInterface({
  feature,
  title,
  placeholder,
}: {
  feature: string;
  title: string;
  placeholder: string;
}) {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feature, chatId, message: text }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
      } else {
        setChatId(data.chatId);
        setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Voice input via the Web Speech API where available. Falls back silently.
  function handleVoiceInput() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Voice input isn't supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.onstart = () => setRecording(true);
    recognition.onend = () => setRecording(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    recognition.start();
  }

  function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // File/image content is described inline; full multimodal ingestion
    // wires into the /api/chat route's message payload in a fuller build.
    setInput((prev) => `${prev}${prev ? "\n" : ""}[Attached: ${file.name}]`);
    e.target.value = "";
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div className="mb-4">
        <h1 className="font-display text-xl font-semibold text-white">{title}</h1>
      </div>

      <div className="card-surface flex flex-1 flex-col overflow-hidden rounded-2xl">
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center text-white/35">
              <Bot className="mb-3 h-8 w-8" />
              <p className="text-sm">{placeholder}</p>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={cn("flex items-start gap-3", m.role === "user" && "flex-row-reverse")}
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                  m.role === "user" ? "bg-electric/20 text-electric" : "bg-cyan/15 text-cyan"
                )}
              >
                {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </span>
              <div
                className={cn(
                  "max-w-[75%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  m.role === "user" ? "bg-electric/10 text-white" : "bg-white/5 text-white/85"
                )}
              >
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-sm text-white/40">
              <Bot className="h-4 w-4 animate-pulse" /> Thinking…
            </div>
          )}
          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>

        <form onSubmit={handleSend} className="flex items-end gap-2 border-t border-white/5 p-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.txt,.md,.docx"
            className="hidden"
            onChange={handleFileSelected}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg p-2.5 text-white/40 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Attach file"
          >
            <Paperclip className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg p-2.5 text-white/40 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Attach image"
          >
            <ImageIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleVoiceInput}
            className={cn(
              "rounded-lg p-2.5 transition-colors hover:bg-white/5",
              recording ? "text-red-400" : "text-white/40 hover:text-white"
            )}
            aria-label="Voice input"
          >
            <Mic className="h-4 w-4" />
          </button>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            rows={1}
            placeholder="Type a message…"
            className="focus-ring max-h-32 flex-1 resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30"
          />

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-cyan to-electric text-space-900 transition-opacity disabled:opacity-30"
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
