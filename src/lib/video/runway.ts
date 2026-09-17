// Runway's video generation API (verified against current docs — this is a
// fast-moving API, so re-check https://docs.dev.runwayml.com if this breaks).
// Base: https://api.dev.runwayml.com/v1
// Auth: Authorization: Bearer <RUNWAY_API_KEY>
// Required on every request: X-Runway-Version: 2024-11-06
// Flow: POST /text_to_video -> { id } -> poll GET /tasks/{id} until
// status is SUCCEEDED or FAILED.

const RUNWAY_BASE = "https://api.dev.runwayml.com/v1";
const RUNWAY_VERSION = "2024-11-06";

function headers() {
  return {
    Authorization: `Bearer ${process.env.RUNWAY_API_KEY}`,
    "X-Runway-Version": RUNWAY_VERSION,
    "Content-Type": "application/json",
  };
}

export async function createVideoTask(prompt: string) {
  const res = await fetch(`${RUNWAY_BASE}/text_to_video`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      model: "gen4.5",
      promptText: prompt,
      ratio: "1280:720",
      duration: 5,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Runway task creation failed: ${res.status} ${err}`);
  }

  const data = await res.json();
  return data.id as string;
}

export interface RunwayTaskStatus {
  id: string;
  status: "PENDING" | "THROTTLED" | "RUNNING" | "SUCCEEDED" | "FAILED" | "CANCELLED";
  output?: string[];
  failure?: string;
}

export async function getVideoTask(taskId: string): Promise<RunwayTaskStatus> {
  const res = await fetch(`${RUNWAY_BASE}/tasks/${taskId}`, {
    headers: headers(),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Runway task lookup failed: ${res.status} ${err}`);
  }
  return res.json();
}
