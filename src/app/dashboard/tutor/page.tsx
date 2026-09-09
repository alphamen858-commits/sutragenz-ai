import { ChatInterface } from "@/components/chat/ChatInterface";

export default function TutorPage() {
  return (
    <ChatInterface
      feature="tutor"
      title="AI Tutor"
      placeholder="Ask about anything you're studying — the tutor breaks it down step by step."
    />
  );
}
