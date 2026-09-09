import { ChatInterface } from "@/components/chat/ChatInterface";

export default function CodingAssistantPage() {
  return (
    <ChatInterface
      feature="coding-assistant"
      title="Coding Assistant"
      placeholder="Paste an error, describe a feature, or ask why your code isn't working."
    />
  );
}
