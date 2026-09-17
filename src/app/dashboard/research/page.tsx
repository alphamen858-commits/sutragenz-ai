import { ChatInterface } from "@/components/chat/ChatInterface";

export default function ResearchPage() {
  return (
    <ChatInterface
      feature="research"
      title="Research Assistant"
      placeholder="Ask a research question — get a structured, cited summary."
    />
  );
}
