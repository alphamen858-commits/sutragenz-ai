import { ChatInterface } from "@/components/chat/ChatInterface";

export default function PromptGenPage() {
  return (
    <ChatInterface
      feature="prompt-gen"
      title="Prompt Generator"
      placeholder="Describe what you're trying to get an AI to do."
    />
  );
}
