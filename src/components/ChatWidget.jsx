import { useState, useRef, useEffect, useCallback } from "react";
import { api } from "../api/client";
import {
  newId,
  formatTime,
  SUGGESTIONS,
  CHAT_PANEL_ACTIONS,
} from "../utils/chat";
import {
  ChatBookTableForm,
  ChatOrderForm,
  ChatMenuPanel,
} from "./ChatGuestPanels";
import { ChatBubbleIcon, PaperPlaneIcon } from "./Icons";

const PANEL_TITLES = {
  book: "Book a table",
  order: "Send an order",
  menu: "Menu",
};

function absUrl(url) {
  const u = (url || "").trim();
  if (!u) return null;
  return u.startsWith("http") ? u : `https://${u}`;
}

/**
 * Reveals fullText in chunks (words + whitespace) for a typewriter-style reply.
 */
function TypewriterBotReply({ fullText, onComplete, onTick }) {
  const onCompleteRef = useRef(onComplete);
  const onTickRef = useRef(onTick);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);
  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);

  const [shown, setShown] = useState("");

  useEffect(() => {
    if (fullText == null || fullText === "") {
      setShown(fullText ?? "");
      onCompleteRef.current?.();
      return;
    }
    setShown("");
    const parts = fullText.split(/(\s+)/);
    let i = 0;
    let timer;

    const step = () => {
      if (i >= parts.length) {
        onCompleteRef.current?.();
        return;
      }
      const piece = parts[i];
      i += 1;
      setShown((s) => s + piece);
      onTickRef.current?.();
      if (i >= parts.length) {
        onCompleteRef.current?.();
        return;
      }
      const next = parts[i];
      const delay = next && /^\s+$/.test(next) ? 14 : 40;
      timer = window.setTimeout(step, delay);
    };

    timer = window.setTimeout(step, 55);
    return () => clearTimeout(timer);
  }, [fullText]);

  return <span className="whitespace-pre-wrap break-words">{shown}</span>;
}

export default function ChatWidget({
  restaurantName = "Restaurant",
  websiteUrl,
  mapsUrl,
  phone,
  instagramUrl,
  facebookUrl,
  menu = { categories: [], uncategorized: [] },
  menuError = null,
  /** When true (iframe /embed): fill the frame, open chat by default, easier to see. */
  embed = false,
}) {
  const [isOpen, setIsOpen] = useState(() => Boolean(embed));
  const [guestPanel, setGuestPanel] = useState(null);
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const listEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollChatToBottom = useCallback(() => {
    listEndRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading, isOpen]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const send = async () => {
    const text = msg.trim();
    if (!text || loading) return;

    setGuestPanel(null);
    const id = newId();
    const createdAt = new Date();

    setApiError("");
    setLoading(true);
    setChat((prev) => [...prev, { id, user: text, bot: null, createdAt }]);
    setMsg("");
    try {
      const res = await api.post("/chat", { message: text });

      setChat((prev) =>
        prev.map((m) =>
          m.id === id
            ? {
                ...m,
                bot: res.data,
                repliedAt: new Date(),
                botRevealDone: false,
              }
            : m
        )
      );
      inputRef.current?.focus();
    } catch (e) {
      setChat((prev) => prev.filter((m) => m.id !== id));
      const body = e.response?.data;
      const serverMsg =
        typeof body?.error === "string"
          ? body.error
          : body?.error?.message ?? null;
      const detail =
        serverMsg ??
        (e.response?.status === 429
          ? "Too many requests. Please wait and try again."
          : e.message);
      setApiError(detail);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const pickSuggestion = (s) => {
    setMsg(s);
    inputRef.current?.focus();
  };

  const toggleOpen = () => {
    setIsOpen((o) => !o);
    if (isOpen) {
      setApiError("");
      setGuestPanel(null);
    }
  };

  const openChat = useCallback((panel) => {
    setIsOpen(true);
    setApiError("");
    if (panel === "book" || panel === "order" || panel === "menu") {
      setGuestPanel(panel);
    } else {
      setGuestPanel(null);
    }
  }, []);

  const markBotRevealDone = useCallback((messageId) => {
    setChat((prev) =>
      prev.map((m) =>
        m.id === messageId ? { ...m, botRevealDone: true } : m
      )
    );
  }, []);

  const web = absUrl(websiteUrl);
  const map = absUrl(mapsUrl);
  const ig = absUrl(instagramUrl);
  const fb = absUrl(facebookUrl);
  const tel = (phone || "").trim();
  const hasQuickLinks = Boolean(web || map || tel || ig || fb);

  const shellClass = embed
    ? "pointer-events-auto fixed inset-0 z-50 flex flex-col bg-slate-100 p-2 sm:p-3"
    : "pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 sm:bottom-8 sm:right-8";

  /* No enter animation in embed mode — avoids rare stuck opacity:0 in iframes. */
  const panelClass = embed
    ? "pointer-events-auto flex h-full min-h-[300px] w-full max-w-lg flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/10 sm:mx-auto sm:max-h-[min(44rem,calc(100vh-1.5rem))]"
    : "pointer-events-auto flex max-h-[min(42rem,calc(100vh-5rem))] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/10 sm:w-96 animate-fade-up";

  return (
    <div className={shellClass}>
      {isOpen ? (
        <div
          className={panelClass}
          role="dialog"
          aria-label={`Chat with ${restaurantName}`}
        >
          <div className="flex shrink-0 items-start justify-between gap-2 rounded-t-3xl bg-slate-900 px-4 py-3.5 text-white">
            <div className="min-w-0">
              <h2 className="text-base font-semibold tracking-tight">
                {restaurantName}
              </h2>
              <p className="text-xs text-slate-400">AI Assistant</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
              aria-label={embed ? "Minimize chat" : "Close chat"}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {hasQuickLinks ? (
            <div className="flex shrink-0 flex-wrap gap-x-3 gap-y-1 border-b border-slate-800 bg-slate-900 px-4 py-2 text-[11px] font-medium text-slate-400">
              {web ? (
                <a
                  href={web}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline"
                >
                  Website
                </a>
              ) : null}
              {map ? (
                <a
                  href={map}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline"
                >
                  Map
                </a>
              ) : null}
              {tel ? (
                <a
                  href={`tel:${tel.replace(/\s/g, "")}`}
                  className="hover:text-white hover:underline"
                >
                  Call
                </a>
              ) : null}
              {ig ? (
                <a
                  href={ig}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline"
                >
                  Instagram
                </a>
              ) : null}
              {fb ? (
                <a
                  href={fb}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline"
                >
                  Facebook
                </a>
              ) : null}
              <div className="ml-auto flex flex-wrap items-center justify-end gap-x-2 gap-y-1">
                <button
                  type="button"
                  onClick={() => setGuestPanel("menu")}
                  className="text-violet-300 hover:text-violet-100 hover:underline"
                >
                  Menu
                </button>
                <span className="text-slate-600" aria-hidden>
                  ·
                </span>
                <button
                  type="button"
                  onClick={() => setGuestPanel("book")}
                  className="text-violet-300 hover:text-violet-100 hover:underline"
                >
                  Book
                </button>
                <span className="text-slate-600" aria-hidden>
                  ·
                </span>
                <button
                  type="button"
                  onClick={() => setGuestPanel("order")}
                  className="text-violet-300 hover:text-violet-100 hover:underline"
                >
                  Order
                </button>
              </div>
            </div>
          ) : (
            <div className="shrink-0 flex flex-wrap items-center justify-end gap-2 border-b border-slate-800 bg-slate-900 px-4 py-2 text-[11px]">
              <button
                type="button"
                onClick={() => setGuestPanel("menu")}
                className="font-medium text-violet-300 hover:text-violet-100 hover:underline"
              >
                Menu
              </button>
              <button
                type="button"
                onClick={() => setGuestPanel("book")}
                className="font-medium text-violet-300 hover:text-violet-100 hover:underline"
              >
                Book a table
              </button>
              <button
                type="button"
                onClick={() => setGuestPanel("order")}
                className="font-medium text-violet-300 hover:text-violet-100 hover:underline"
              >
                Order
              </button>
            </div>
          )}

          <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50/90 px-3 py-3">
            {guestPanel ? (
              <div className="flex min-h-0 flex-col gap-2">
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setGuestPanel(null)}
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                  >
                    ← Chat
                  </button>
                  <span className="text-sm font-semibold text-slate-800">
                    {PANEL_TITLES[guestPanel]}
                  </span>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto pr-0.5">
                  {guestPanel === "book" ? <ChatBookTableForm /> : null}
                  {guestPanel === "order" ? <ChatOrderForm /> : null}
                  {guestPanel === "menu" ? (
                    <ChatMenuPanel menu={menu} menuError={menuError} />
                  ) : null}
                </div>
              </div>
            ) : null}

            {!guestPanel && chat.length === 0 && !loading ? (
              <div className="rounded-2xl bg-white p-6 text-center shadow-lg shadow-slate-200/50 ring-1 ring-slate-100">
                <div
                  className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-blue-500 bg-blue-50 text-3xl"
                  aria-hidden
                >
                  👋
                </div>
                <p className="text-base font-bold leading-snug text-slate-800">
                  Hi there! 👋 Menu, reservations, and orders live here.
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Pick an option below or ask the AI anything.
                </p>
                <div className="mt-5 flex flex-col gap-2">
                  {CHAT_PANEL_ACTIONS.map(({ label, panel }) => (
                    <button
                      key={panel}
                      type="button"
                      onClick={() => setGuestPanel(panel)}
                      className="rounded-full border border-violet-200 bg-violet-50 px-3 py-2 text-left text-xs font-semibold text-violet-900 transition hover:border-violet-300 hover:bg-violet-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                    >
                      {label}
                    </button>
                  ))}
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => pickSuggestion(s)}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs font-medium text-slate-700 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {!guestPanel ? (
              <div className="space-y-4 pt-1">
                {chat.map((c) => (
                  <div key={c.id} className="space-y-3">
                    <div className="flex flex-col items-end gap-1">
                      <time className="text-[10px] text-slate-400">
                        {c.createdAt ? formatTime(c.createdAt) : ""}
                      </time>
                      <div className="max-w-[90%] rounded-2xl rounded-tr-md bg-violet-600 px-3.5 py-2.5 text-sm leading-relaxed text-white shadow-sm">
                        {c.user}
                      </div>
                    </div>

                    <div className="flex flex-col items-start gap-1">
                      <time className="text-[10px] text-slate-400">
                        {c.repliedAt ? formatTime(c.repliedAt) : ""}
                      </time>
                      {c.bot != null ? (
                        <div className="max-w-[95%] rounded-2xl rounded-tl-md bg-gray-100 px-3.5 py-2.5 text-sm leading-relaxed text-slate-700">
                          <div className="break-words">
                            {c.botRevealDone ? (
                              <span className="whitespace-pre-wrap">{c.bot}</span>
                            ) : (
                              <TypewriterBotReply
                                fullText={c.bot}
                                onComplete={() => markBotRevealDone(c.id)}
                                onTick={scrollChatToBottom}
                              />
                            )}
                          </div>
                          {!c.botRevealDone ? (
                            <span
                              className="ml-0.5 inline-block h-3 w-0.5 animate-pulse bg-violet-500/80 align-middle"
                              aria-hidden
                            />
                          ) : null}
                        </div>
                      ) : loading ? (
                        <div
                          className="inline-flex items-center gap-1 rounded-2xl rounded-tl-md bg-gray-100 px-4 py-3"
                          aria-live="polite"
                          aria-label="Assistant is typing"
                        >
                          <span className="h-2 w-2 animate-typing rounded-full bg-slate-400" />
                          <span className="h-2 w-2 animate-typing rounded-full bg-slate-400 animation-delay-150" />
                          <span className="h-2 w-2 animate-typing rounded-full bg-slate-400 animation-delay-300" />
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            <div ref={listEndRef} className="h-1" />
          </div>

          {apiError ? (
            <div
              className="shrink-0 border-t border-red-100 bg-red-50 px-3 py-2 text-xs text-red-800"
              role="alert"
            >
              {apiError}
            </div>
          ) : null}

          <div className="shrink-0 border-t border-slate-100 bg-white p-3">
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-4 pr-1 shadow-sm">
              <input
                ref={inputRef}
                type="text"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Write your message..."
                disabled={loading}
                autoComplete="off"
                aria-label="Message"
                className="min-w-0 flex-1 border-0 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={send}
                disabled={loading || !msg.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-violet-600 shadow-md ring-1 ring-slate-100 transition hover:bg-violet-50 hover:text-violet-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-35"
                aria-label="Send message"
              >
                <PaperPlaneIcon className="h-5 w-5 -ml-0.5 mt-0.5" />
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {!isOpen ? (
        <div
          className={
            embed
              ? "pointer-events-auto flex flex-1 flex-col items-center justify-center gap-4 py-8"
              : "pointer-events-auto flex items-center gap-3"
          }
        >
          <button
            type="button"
            onClick={toggleOpen}
            className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-lg shadow-slate-900/10 ring-1 ring-slate-200/80 transition hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
          >
            Chat with us
          </button>
          <button
            type="button"
            onClick={toggleOpen}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 text-white shadow-xl shadow-violet-600/30 transition hover:bg-violet-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
            aria-label="Open chat"
          >
            <ChatBubbleIcon className="h-7 w-7" />
          </button>
        </div>
      ) : null}

      {/* Allow parent landing buttons to open chat */}
      <OpenChatBridge onOpen={openChat} />
    </div>
  );
}

/** Dispatches `open-restaurant-chat` with optional `detail.panel`: book | order | menu */
function OpenChatBridge({ onOpen }) {
  useEffect(() => {
    const h = (e) => onOpen(e.detail?.panel);
    window.addEventListener("open-restaurant-chat", h);
    return () => window.removeEventListener("open-restaurant-chat", h);
  }, [onOpen]);
  return null;
}
