"use client";

import { Sandpack } from "@codesandbox/sandpack-react";

// Renders an AI-generated multi-file React project with a real, live,
// in-browser preview — this is the same class of tool (an in-browser
// bundler) that powers CodeSandbox and several Bolt/v0-style builders.
export function ProjectPreview({ files }: { files: Record<string, string> }) {
  return (
    <Sandpack
      template="react"
      theme="dark"
      files={files}
      options={{
        showConsole: true,
        showConsoleButton: true,
        editorHeight: 480,
      }}
    />
  );
}
