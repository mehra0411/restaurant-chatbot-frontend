import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { ChatBubbleIcon } from "./Icons";

const IMG_HERO =
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2000&q=80";
const MENU_FALLBACK_IMG =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80";

function withHttp(url) {
  const u = (url || "").trim();
  if (!u) return "";
  return u.startsWith("http") ? u : `https://${u}`;
}

function BookTableSection() {
  const today = useMemo(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  }, []);
  const [form, setForm] = useState({
    guest_name: "",
    guest_email: "",
    guest_phone: "",
    party_size: 2,
    reservation_date: today,
    reservation_time: "19:00",
    occasion: "",
    dietary_notes: "",
    special_requests: "",
  });
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setSending(true);
    try {
      await api.post("/api/public/reservations", {
        ...form,
        party_size: Number(form.party_size) || 2,
        occasion: form.occasion || null,
        dietary_notes: form.dietary_notes || null,
        special_requests: form.special_requests || null,
        guest_email: form.guest_email || null,
      });
      setMsg(
        "Request received. Our host team will confirm your table by phone or email."
      );
      setForm((f) => ({
        ...f,
        guest_name: "",
        guest_email: "",
        guest_phone: "",
        party_size: 2,
        reservation_date: today,
        reservation_time: "19:00",
        occasion: "",
        dietary_notes: "",
        special_requests: "",
      }));
    } catch (e2) {
      setErr(
        e2.response?.data?.error ||
          e2.message ||
          "Could not submit. Try again or call us."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="reserve"
      className="border-y border-slate-200 bg-gradient-to-b from-slate-50 to-white py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-600">
            Reservations
          </p>
          <h2 className="mt-2 font-serif text-3xl font-medium tracking-tight text-slate-900 sm:text-4xl">
            Book a table
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Share your party details and preferences. For same-day large groups
            or private dining, we may follow up by phone.
          </p>
        </div>
        <form
          onSubmit={submit}
          className="mx-auto mt-10 max-w-2xl space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 sm:p-10"
        >
          {msg ? (
            <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900 ring-1 ring-emerald-200">
              {msg}
            </p>
          ) : null}
          {err ? (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 ring-1 ring-red-200">
              {err}
            </p>
          ) : null}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Full name *
              </label>
              <input
                required
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                value={form.guest_name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, guest_name: e.target.value }))
                }
                autoComplete="name"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Phone *
              </label>
              <input
                required
                type="tel"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                value={form.guest_phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, guest_phone: e.target.value }))
                }
                autoComplete="tel"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Email * <span className="font-normal normal-case text-slate-400">(confirmations)</span>
              </label>
              <input
                required
                type="email"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                value={form.guest_email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, guest_email: e.target.value }))
                }
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Party size *
              </label>
              <input
                required
                type="number"
                min={1}
                max={50}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                value={form.party_size}
                onChange={(e) =>
                  setForm((f) => ({ ...f, party_size: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Occasion
              </label>
              <select
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                value={form.occasion}
                onChange={(e) =>
                  setForm((f) => ({ ...f, occasion: e.target.value }))
                }
              >
                <option value="">Casual dining</option>
                <option value="Birthday">Birthday</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Business">Business meal</option>
                <option value="Celebration">Celebration</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Preferred date *
              </label>
              <input
                required
                type="date"
                min={today}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                value={form.reservation_date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, reservation_date: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Preferred time *
              </label>
              <input
                required
                type="time"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                value={form.reservation_time}
                onChange={(e) =>
                  setForm((f) => ({ ...f, reservation_time: e.target.value }))
                }
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Dietary needs &amp; allergies
              </label>
              <textarea
                rows={2}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                placeholder="Vegetarian, gluten-free, nut allergy…"
                value={form.dietary_notes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, dietary_notes: e.target.value }))
                }
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Special requests
              </label>
              <textarea
                rows={3}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                placeholder="High chair, quiet table, celebrating something…"
                value={form.special_requests}
                onChange={(e) =>
                  setForm((f) => ({ ...f, special_requests: e.target.value }))
                }
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={sending}
            className="w-full rounded-full bg-slate-900 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800 disabled:opacity-50"
          >
            {sending ? "Sending request…" : "Request reservation"}
          </button>
        </form>
      </div>
    </section>
  );
}

function OrderFormSection() {
  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    service_type: "pickup",
    preferred_time: "",
    items_summary: "",
    notes: "",
  });
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setSending(true);
    try {
      await api.post("/api/public/orders", form);
      setMsg("Thanks — we received your order request. We’ll confirm shortly.");
      setForm({
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        service_type: "pickup",
        preferred_time: "",
        items_summary: "",
        notes: "",
      });
    } catch (e2) {
      setErr(
        e2.response?.data?.error || e2.message || "Could not submit. Try again."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="order"
      className="border-y border-slate-200 bg-white py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-600">
            Order ahead
          </p>
          <h2 className="mt-2 font-serif text-3xl font-medium tracking-tight text-slate-900 sm:text-4xl">
            Send us your order
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Tell us what you&apos;d like, how you want it, and when. We&apos;ll
            follow up by phone or email.
          </p>
        </div>
        <form
          onSubmit={submit}
          className="mx-auto mt-10 max-w-xl space-y-4 rounded-3xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm sm:p-8"
        >
          {msg ? (
            <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900 ring-1 ring-emerald-200">
              {msg}
            </p>
          ) : null}
          {err ? (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 ring-1 ring-red-200">
              {err}
            </p>
          ) : null}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Name *
            </label>
            <input
              required
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              value={form.customer_name}
              onChange={(e) =>
                setForm((f) => ({ ...f, customer_name: e.target.value }))
              }
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Phone *
              </label>
              <input
                required
                type="tel"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                value={form.customer_phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, customer_phone: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Email
              </label>
              <input
                type="email"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                value={form.customer_email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, customer_email: e.target.value }))
                }
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Service
            </label>
            <select
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              value={form.service_type}
              onChange={(e) =>
                setForm((f) => ({ ...f, service_type: e.target.value }))
              }
            >
              <option value="pickup">Pickup</option>
              <option value="delivery">Delivery</option>
              <option value="dine_in">Dine in</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Preferred time
            </label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              placeholder="e.g. Today 6:30 PM"
              value={form.preferred_time}
              onChange={(e) =>
                setForm((f) => ({ ...f, preferred_time: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              What would you like? *
            </label>
            <textarea
              required
              rows={4}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              placeholder="Items, quantities, modifications…"
              value={form.items_summary}
              onChange={(e) =>
                setForm((f) => ({ ...f, items_summary: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Notes
            </label>
            <textarea
              rows={2}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              placeholder="Allergies, occasion, etc."
              value={form.notes}
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
            />
          </div>
          <button
            type="submit"
            disabled={sending}
            className="w-full rounded-full bg-violet-600 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition hover:bg-violet-500 disabled:opacity-50"
          >
            {sending ? "Sending…" : "Submit order request"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default function RestaurantLanding({
  settings,
  menu,
  menuError,
  onOpenChat,
}) {
  const brand = settings?.name || "Meridian";
  const tagline = settings?.tagline || "Downtown · Since 2014";
  const line1 = settings?.hero_line1 || "Modern plates.";
  const line2 = settings?.hero_line2 || "Warm hospitality.";
  const sub = settings?.hero_subtitle || "";
  const website = (settings?.website_url || "").trim();
  const maps = (settings?.maps_url || "").trim();
  const phone = (settings?.phone || "").trim();
  const instagram = (settings?.instagram_url || "").trim();
  const facebook = (settings?.facebook_url || "").trim();

  const categories = menu?.categories || [];
  const uncategorized = menu?.uncategorized || [];
  const hasMenuItems =
    categories.some((c) => c.items?.length) || uncategorized.length > 0;

  const menuNavIds = useMemo(() => {
    const ids = [];
    if (hasMenuItems) ids.push("all");
    categories.forEach((c) => {
      if (c.items?.length) ids.push(c.id);
    });
    if (uncategorized.length) ids.push("__uncat__");
    return ids;
  }, [categories, uncategorized.length, hasMenuItems]);

  const [activeMenuKey, setActiveMenuKey] = useState("all");

  const scrollToMenu = useCallback((key) => {
    setActiveMenuKey(key);
    if (key === "all") {
      document.getElementById("menu")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    const el = document.getElementById(
      key === "__uncat__" ? "menu-uncategorized" : `menu-cat-${key}`
    );
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="text-slate-800">
      <nav className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <a
            href="#top"
            className="font-serif text-xl font-semibold tracking-tight text-white sm:text-2xl"
          >
            {brand}
            <span className="text-violet-400">.</span>
          </a>
          <div className="hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex">
            <a href="#menu" className="transition hover:text-white">
              Menu
            </a>
            <a href="#experience" className="transition hover:text-white">
              Experience
            </a>
            <a href="#visit" className="transition hover:text-white">
              Visit
            </a>
            <a href="#reserve" className="transition hover:text-white">
              Book
            </a>
            <a href="#order" className="transition hover:text-white">
              Order
            </a>
          </div>
          <div className="hidden items-center gap-1 text-xs font-medium text-slate-400 lg:flex">
            {phone ? (
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="rounded-full px-2 py-1 transition hover:bg-white/10 hover:text-white"
              >
                Call
              </a>
            ) : null}
            {website ? (
              <a
                href={withHttp(website)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full px-2 py-1 transition hover:bg-white/10 hover:text-white"
              >
                Site
              </a>
            ) : null}
            {maps ? (
              <a
                href={withHttp(maps)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full px-2 py-1 transition hover:bg-white/10 hover:text-white"
              >
                Map
              </a>
            ) : null}
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onOpenChat}
              className="rounded-full border border-white/20 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10 sm:px-4 sm:text-sm"
            >
              AI Concierge
            </button>
            <a
              href="#reserve"
              className="rounded-full bg-violet-600 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-violet-600/25 transition hover:bg-violet-500 sm:px-5 sm:text-sm"
            >
              Book table
            </a>
          </div>
        </div>
      </nav>

      <header id="top" className="relative min-h-[min(92vh,52rem)]">
        <img
          src={IMG_HERO}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/40" />
        <div className="relative mx-auto flex max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-24 sm:pt-36">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
            {tagline}
          </p>
          <h1 className="max-w-3xl font-serif text-4xl font-medium leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {line1}
            <span className="block text-slate-300">{line2}</span>
          </h1>
          {sub ? (
            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              {sub}
            </p>
          ) : null}
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#reserve"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-xl transition hover:bg-slate-100"
            >
              Book a table
            </a>
            <button
              type="button"
              onClick={onOpenChat}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15"
            >
              <ChatBubbleIcon className="h-4 w-4" />
              Chat with us
            </button>
            {website ? (
              <a
                href={withHttp(website)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15"
              >
                Website
              </a>
            ) : null}
            {maps ? (
              <a
                href={withHttp(maps)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15"
              >
                Directions
              </a>
            ) : null}
            {phone ? (
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15"
              >
                Call us
              </a>
            ) : null}
          </div>
          <div className="mt-14 grid grid-cols-2 gap-4 border-t border-white/10 pt-10 sm:grid-cols-4">
            {[
              ["4.9", "Guest rating"],
              ["40+", "Natural wines"],
              ["5–11", "Kitchen hours"],
              ["Walk-ins", "Bar & patio"],
            ].map(([a, b]) => (
              <div key={b}>
                <p className="font-serif text-2xl font-medium text-white sm:text-3xl">
                  {a}
                </p>
                <p className="mt-1 text-xs text-slate-400 sm:text-sm">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <section
        id="menu"
        className="relative border-b border-slate-200/80 bg-gradient-to-b from-white via-violet-50/30 to-stone-50 py-20 sm:py-28"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-violet-600">
                Menu
              </p>
              <h2 className="mt-2 font-serif text-3xl font-medium tracking-tight text-slate-900 sm:text-4xl">
                From the kitchen &amp; bar
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-slate-600 md:text-right">
              Staff curate dishes in the dashboard. Guests explore here—or ask
              the AI host for hours, pairings, and how to book.
            </p>
          </div>
          {menuError ? (
            <p className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-200">
              Could not load menu: {menuError}. Check the API and Supabase tables.
            </p>
          ) : null}
          {!hasMenuItems && !menuError ? (
            <p className="mt-10 text-center text-slate-500">
              No dishes yet. Add categories and items in the{" "}
              <Link
                to="/dashboard"
                className="font-medium text-violet-600 underline"
              >
                staff dashboard
              </Link>
              .
            </p>
          ) : null}

          {hasMenuItems && !menuError ? (
            <div className="sticky top-[4.25rem] z-20 -mx-4 mt-10 border-y border-slate-200/80 bg-stone-50/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 md:top-[4.5rem]">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {menuNavIds.includes("all") ? (
                  <button
                    type="button"
                    onClick={() => scrollToMenu("all")}
                    className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition sm:text-sm ${
                      activeMenuKey === "all"
                        ? "bg-slate-900 text-white shadow-md"
                        : "bg-white text-slate-700 ring-1 ring-slate-200 hover:ring-violet-300"
                    }`}
                  >
                    Full menu
                  </button>
                ) : null}
                {categories.map((cat) =>
                  cat.items?.length ? (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => scrollToMenu(cat.id)}
                      className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition sm:text-sm ${
                        activeMenuKey === cat.id
                          ? "bg-violet-600 text-white shadow-md shadow-violet-600/25"
                          : "bg-white text-slate-700 ring-1 ring-slate-200 hover:ring-violet-300"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ) : null
                )}
                {uncategorized.length ? (
                  <button
                    type="button"
                    onClick={() => scrollToMenu("__uncat__")}
                    className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition sm:text-sm ${
                      activeMenuKey === "__uncat__"
                        ? "bg-violet-600 text-white shadow-md shadow-violet-600/25"
                        : "bg-white text-slate-700 ring-1 ring-slate-200 hover:ring-violet-300"
                    }`}
                  >
                    Chef&apos;s picks &amp; more
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="mt-12 space-y-16 sm:space-y-20">
            {categories.map((cat) =>
              cat.items?.length ? (
                <div key={cat.id} id={`menu-cat-${cat.id}`} className="scroll-mt-40">
                  <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200/80 pb-4">
                    <h3 className="font-serif text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                      {cat.name}
                    </h3>
                    <span className="text-xs font-medium uppercase tracking-wider text-violet-600">
                      {cat.items.length}{" "}
                      {cat.items.length === 1 ? "dish" : "dishes"}
                    </span>
                  </div>
                  <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {cat.items.map((d) => (
                      <article
                        key={d.id}
                        className="group relative flex flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-lg shadow-slate-300/40 ring-1 ring-slate-200/90 transition duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-violet-200/50 hover:ring-violet-200/80"
                      >
                        <div className="relative aspect-[5/3] overflow-hidden bg-slate-100">
                          <img
                            src={d.image_url || MENU_FALLBACK_IMG}
                            alt=""
                            className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                          />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent opacity-80" />
                          <span className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1 text-sm font-bold tabular-nums text-slate-900 shadow-md ring-1 ring-slate-200/80 backdrop-blur-sm">
                            {d.price != null && d.price !== ""
                              ? `$${Number(d.price).toFixed(2)}`
                              : "Ask"}
                          </span>
                          <div className="absolute bottom-3 left-4 right-4">
                            <p className="font-serif text-lg font-semibold leading-tight text-white drop-shadow-md sm:text-xl">
                              {d.name}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-1 flex-col p-5 sm:p-6">
                          {d.description ? (
                            <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">
                              {d.description}
                            </p>
                          ) : (
                            <p className="text-sm italic text-slate-400">
                              Signature preparation — ask your server for tonight&apos;s
                              detail.
                            </p>
                          )}
                          <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                            <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-violet-800 ring-1 ring-violet-100">
                              In house
                            </span>
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                              {cat.name}
                            </span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ) : null
            )}
            {uncategorized.length ? (
              <div id="menu-uncategorized" className="scroll-mt-40">
                <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200/80 pb-4">
                  <h3 className="font-serif text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                    Chef&apos;s picks &amp; more
                  </h3>
                  <span className="text-xs font-medium uppercase tracking-wider text-violet-600">
                    Featured
                  </span>
                </div>
                <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {uncategorized.map((d) => (
                    <article
                      key={d.id}
                      className="group relative flex flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-lg shadow-slate-300/40 ring-1 ring-slate-200/90 transition duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-violet-200/50 hover:ring-violet-200/80"
                    >
                      <div className="relative aspect-[5/3] overflow-hidden bg-slate-100">
                        <img
                          src={d.image_url || MENU_FALLBACK_IMG}
                          alt=""
                          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent opacity-80" />
                        <span className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1 text-sm font-bold tabular-nums text-slate-900 shadow-md ring-1 ring-slate-200/80 backdrop-blur-sm">
                          {d.price != null && d.price !== ""
                            ? `$${Number(d.price).toFixed(2)}`
                            : "Ask"}
                        </span>
                        <div className="absolute bottom-3 left-4 right-4">
                          <p className="font-serif text-lg font-semibold leading-tight text-white drop-shadow-md sm:text-xl">
                            {d.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col p-5 sm:p-6">
                        {d.description ? (
                          <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">
                            {d.description}
                          </p>
                        ) : (
                          <p className="text-sm italic text-slate-400">
                            Ask the AI host for pairing ideas.
                          </p>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section
        id="experience"
        className="border-y border-slate-200 bg-white py-20 sm:py-28"
      >
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-600">
              The experience
            </p>
            <h2 className="mt-2 font-serif text-3xl font-medium tracking-tight text-slate-900 sm:text-4xl">
              Designed like a dinner party at a friend&apos;s loft
            </h2>
            <p className="mt-5 text-slate-600 leading-relaxed">
              Low lights, open flame, and a soundtrack that never shouts.
              Private dining for twelve, or a two-top at the pass watching the
              line.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-slate-700">
              {[
                "Chef's tasting · Wed & Sat",
                "Zero-proof pairings available",
                "Dogs welcome on the patio",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="rounded-3xl bg-gradient-to-br from-violet-100 to-violet-50 p-6 ring-1 ring-violet-200/60 sm:p-8">
              <p className="font-serif text-4xl font-medium text-violet-900">
                18
              </p>
              <p className="mt-2 text-sm font-medium text-violet-800/80">
                Craft cocktails
              </p>
            </div>
            <div className="rounded-3xl bg-slate-900 p-6 text-white sm:p-8">
              <p className="font-serif text-4xl font-medium">12</p>
              <p className="mt-2 text-sm text-slate-400">Open tables tonight</p>
            </div>
            <div className="col-span-2 rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
              <p className="text-sm font-medium text-slate-900">
                “Best service we’ve had in the city—felt effortless.”
              </p>
              <p className="mt-3 text-xs text-slate-500">— Local Magazine, 2025</p>
            </div>
          </div>
        </div>
      </section>

      <section id="visit" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="overflow-hidden rounded-3xl bg-slate-900 text-white ring-1 ring-slate-800">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 sm:p-12 lg:p-14">
              <p className="text-xs font-semibold uppercase tracking-widest text-violet-400">
                Visit
              </p>
              <h2 className="mt-2 font-serif text-3xl font-medium sm:text-4xl">
                Find us
              </h2>
              <dl className="mt-8 space-y-6 text-sm">
                <div>
                  <dt className="text-slate-500">Address</dt>
                  <dd className="mt-1 font-medium text-white">
                    {settings?.address || "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Hours</dt>
                  <dd className="mt-1 font-medium text-white">
                    {settings?.hours_text || "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Phone</dt>
                  <dd className="mt-1 font-medium text-violet-300">
                    {phone ? (
                      <a
                        href={`tel:${phone.replace(/\s/g, "")}`}
                        className="hover:underline"
                      >
                        {settings?.phone}
                      </a>
                    ) : (
                      "—"
                    )}
                  </dd>
                </div>
              </dl>
              <div className="mt-8 flex flex-wrap gap-3">
                {maps ? (
                  <a
                    href={withHttp(maps)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                  >
                    Directions / map
                  </a>
                ) : null}
                {website ? (
                  <a
                    href={withHttp(website)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Official website
                  </a>
                ) : null}
                {instagram ? (
                  <a
                    href={withHttp(instagram)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Instagram
                  </a>
                ) : null}
                {facebook ? (
                  <a
                    href={withHttp(facebook)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Facebook
                  </a>
                ) : null}
              </div>
            </div>
            <div className="relative min-h-[14rem] bg-slate-800 lg:min-h-full">
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 30% 20%, rgba(139,92,246,0.35), transparent 50%), radial-gradient(circle at 70% 80%, rgba(251,191,36,0.15), transparent 45%)",
                }}
              />
              <div className="relative flex h-full min-h-[14rem] flex-col items-center justify-center gap-2 p-8 text-center">
                <p className="max-w-xs text-sm text-slate-400">
                  {maps
                    ? "Open directions for driving, transit, or walking."
                    : "Add a Google Maps link in the dashboard (Maps URL)."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BookTableSection />

      <OrderFormSection />

      <section className="border-t border-slate-200 bg-slate-100 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-serif text-2xl font-medium text-slate-900 sm:text-3xl">
            Ready when you are
          </h2>
          <p className="mt-3 text-slate-600">
            Larger groups or same-day changes? Message our AI host or call the
            restaurant—we&apos;ll help you find the right table.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="#reserve"
              className="inline-flex rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Book a table
            </a>
            <button
              type="button"
              onClick={onOpenChat}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-8 py-3 text-sm font-semibold text-slate-800 transition hover:border-violet-300 hover:bg-violet-50"
            >
              <ChatBubbleIcon className="h-4 w-4 text-violet-600" />
              Open chat widget
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-center text-sm text-slate-500 sm:flex-row sm:px-6 sm:text-left">
          <p className="font-serif text-lg font-semibold text-slate-800">
            {brand}
            <span className="text-violet-600">.</span>
          </p>
          <p>
            © {new Date().getFullYear()} {brand}. Demo site.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <a href="#visit" className="hover:text-slate-800">
              Contact
            </a>
            <button
              type="button"
              onClick={onOpenChat}
              className="hover:text-violet-600"
            >
              AI host
            </button>
            <Link
              to="/dashboard"
              className="text-slate-400 hover:text-violet-600"
            >
              Staff dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
