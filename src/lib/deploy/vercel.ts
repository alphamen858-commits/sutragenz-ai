// Deploys an AI-generated React project as a REAL, live Vercel deployment,
// using the requesting user's OWN Vercel API token — we deploy on their
// account, not ours. Uses Vercel's v13 deployments endpoint with small
// files inlined directly in the request (fine for the size of AI-generated
// starter projects; large projects would need the separate file-upload
// endpoint instead).
//
// The generated files (from Sandpack's "react" template shape, e.g.
// "/App.js", "/styles.css") are wrapped in a minimal Create React App
// scaffold so Vercel's build step has something real to build.

interface DeployFile {
  file: string;
  data: string;
}

function wrapAsCRA(aiFiles: Record<string, string>, projectName: string): DeployFile[] {
  const files: DeployFile[] = [];

  files.push({
    file: "package.json",
    data: JSON.stringify(
      {
        name: projectName,
        version: "0.1.0",
        private: true,
        dependencies: { react: "^18.3.1", "react-dom": "^18.3.1", "react-scripts": "5.0.1" },
        scripts: { build: "react-scripts build", start: "react-scripts start" },
        eslintConfig: { extends: ["react-app"] },
        browserslist: { production: [">0.2%", "not dead", "not op_mini all"], development: ["last 1 chrome version"] },
      },
      null,
      2
    ),
  });

  files.push({
    file: "public/index.html",
    data: `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${projectName}</title></head><body><div id="root"></div></body></html>`,
  });

  files.push({
    file: "src/index.js",
    data: `import React from "react";\nimport ReactDOM from "react-dom/client";\nimport App from "./App";\nconst root = ReactDOM.createRoot(document.getElementById("root"));\nroot.render(<React.StrictMode><App /></React.StrictMode>);`,
  });

  // Map the AI's flat "/App.js" style paths into src/*
  for (const [path, content] of Object.entries(aiFiles)) {
    const cleanPath = path.replace(/^\//, "");
    files.push({ file: `src/${cleanPath}`, data: content });
  }

  return files;
}

export async function deployToVercel(
  aiFiles: Record<string, string>,
  projectName: string,
  apiToken: string
): Promise<{ url: string; id: string }> {
  const files = wrapAsCRA(aiFiles, projectName);

  const res = await fetch("https://api.vercel.com/v13/deployments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: projectName,
      files,
      projectSettings: { framework: "create-react-app" },
      target: "production",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Vercel deployment failed: ${res.status} ${err}`);
  }

  const data = await res.json();
  return { url: `https://${data.url}`, id: data.id };
}
