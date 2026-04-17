export const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `m-${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function formatTime(d) {
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export const SUGGESTIONS = [
  "What's on the menu tonight?",
  "What are your hours and location?",
  "How do I book a table for Saturday?",
];
