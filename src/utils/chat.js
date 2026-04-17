export const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `m-${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function formatTime(d) {
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

/** Opens a panel inside the chat widget (menu, book, order). */
export const CHAT_PANEL_ACTIONS = [
  { label: "View our menu", panel: "menu" },
  { label: "Book a table", panel: "book" },
  { label: "Send an order request", panel: "order" },
];

/** Fills the composer — sent to the AI as a normal message. */
export const SUGGESTIONS = [
  "What are your hours and location?",
  "What do you recommend for a celebration?",
];
