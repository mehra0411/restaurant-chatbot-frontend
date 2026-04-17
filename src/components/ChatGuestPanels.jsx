import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";

const MENU_FALLBACK_IMG =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80";

function priceLabel(p) {
  if (p == null || p === "") return "Ask";
  const n = Number(p);
  return Number.isFinite(n) ? `$${n.toFixed(2)}` : String(p);
}

export function ChatBookTableForm() {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
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
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">
        Reservations
      </p>
      <h3 className="mt-1 font-serif text-lg font-medium text-slate-900">
        Book a table
      </h3>
      <p className="mt-1 text-xs text-slate-600">
        We&apos;ll confirm by phone or email. Same-day large parties may need a
        call back.
      </p>
      <form onSubmit={submit} className="mt-4 space-y-3">
        {msg ? (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-900 ring-1 ring-emerald-200">
            {msg}
          </p>
        ) : null}
        {err ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-800 ring-1 ring-red-200">
            {err}
          </p>
        ) : null}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Full name *
          </label>
          <input
            required
            className="mt-0.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            value={form.guest_name}
            onChange={(e) =>
              setForm((f) => ({ ...f, guest_name: e.target.value }))
            }
            autoComplete="name"
          />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Phone *
            </label>
            <input
              required
              type="tel"
              className="mt-0.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              value={form.guest_phone}
              onChange={(e) =>
                setForm((f) => ({ ...f, guest_phone: e.target.value }))
              }
              autoComplete="tel"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Email *
            </label>
            <input
              required
              type="email"
              className="mt-0.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              value={form.guest_email}
              onChange={(e) =>
                setForm((f) => ({ ...f, guest_email: e.target.value }))
              }
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Party size *
            </label>
            <input
              required
              type="number"
              min={1}
              max={50}
              className="mt-0.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              value={form.party_size}
              onChange={(e) =>
                setForm((f) => ({ ...f, party_size: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Occasion
            </label>
            <select
              className="mt-0.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
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
            <label className="block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Date *
            </label>
            <input
              required
              type="date"
              min={today}
              className="mt-0.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              value={form.reservation_date}
              onChange={(e) =>
                setForm((f) => ({ ...f, reservation_date: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Time *
            </label>
            <input
              required
              type="time"
              className="mt-0.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              value={form.reservation_time}
              onChange={(e) =>
                setForm((f) => ({ ...f, reservation_time: e.target.value }))
              }
            />
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Dietary needs
          </label>
          <textarea
            rows={2}
            className="mt-0.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            value={form.dietary_notes}
            onChange={(e) =>
              setForm((f) => ({ ...f, dietary_notes: e.target.value }))
            }
          />
        </div>
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Special requests
          </label>
          <textarea
            rows={2}
            className="mt-0.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            value={form.special_requests}
            onChange={(e) =>
              setForm((f) => ({ ...f, special_requests: e.target.value }))
            }
          />
        </div>
        <button
          type="submit"
          disabled={sending}
          className="w-full rounded-full bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
        >
          {sending ? "Sending…" : "Request reservation"}
        </button>
      </form>
    </div>
  );
}

export function ChatOrderForm() {
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
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">
        Order ahead
      </p>
      <h3 className="mt-1 font-serif text-lg font-medium text-slate-900">
        Send us your order
      </h3>
      <p className="mt-1 text-xs text-slate-600">
        Describe what you&apos;d like and when. We&apos;ll follow up by phone
        or email.
      </p>
      <form onSubmit={submit} className="mt-4 space-y-3">
        {msg ? (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-900 ring-1 ring-emerald-200">
            {msg}
          </p>
        ) : null}
        {err ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-800 ring-1 ring-red-200">
            {err}
          </p>
        ) : null}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Name *
          </label>
          <input
            required
            className="mt-0.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            value={form.customer_name}
            onChange={(e) =>
              setForm((f) => ({ ...f, customer_name: e.target.value }))
            }
          />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Phone *
            </label>
            <input
              required
              type="tel"
              className="mt-0.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              value={form.customer_phone}
              onChange={(e) =>
                setForm((f) => ({ ...f, customer_phone: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Email
            </label>
            <input
              type="email"
              className="mt-0.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              value={form.customer_email}
              onChange={(e) =>
                setForm((f) => ({ ...f, customer_email: e.target.value }))
              }
            />
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Service
          </label>
          <select
            className="mt-0.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
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
          <label className="block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Preferred time
          </label>
          <input
            className="mt-0.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            placeholder="e.g. Today 6:30 PM"
            value={form.preferred_time}
            onChange={(e) =>
              setForm((f) => ({ ...f, preferred_time: e.target.value }))
            }
          />
        </div>
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            What would you like? *
          </label>
          <textarea
            required
            rows={3}
            className="mt-0.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            value={form.items_summary}
            onChange={(e) =>
              setForm((f) => ({ ...f, items_summary: e.target.value }))
            }
          />
        </div>
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Notes
          </label>
          <textarea
            rows={2}
            className="mt-0.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          />
        </div>
        <button
          type="submit"
          disabled={sending}
          className="w-full rounded-full bg-violet-600 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-violet-500 disabled:opacity-50"
        >
          {sending ? "Sending…" : "Submit order request"}
        </button>
      </form>
    </div>
  );
}

export function ChatMenuPanel({ menu, menuError }) {
  const categories = menu?.categories || [];
  const uncategorized = menu?.uncategorized || [];
  const hasItems =
    categories.some((c) => c.items?.length) || uncategorized.length > 0;

  if (menuError) {
    return (
      <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900 ring-1 ring-amber-200">
        Could not load menu: {menuError}. Check the API and database.
      </p>
    );
  }

  if (!hasItems) {
    return (
      <p className="text-center text-xs text-slate-600">
        No dishes yet. Add items in the{" "}
        <Link
          to="/dashboard"
          className="font-medium text-violet-600 underline"
        >
          staff dashboard
        </Link>
        .
      </p>
    );
  }

  return (
    <div className="space-y-5 pb-2">
      <p className="text-xs text-slate-600">
        Tap a category to scroll. Ask the AI for pairings or modifications.
      </p>
      {categories.map((cat) =>
        cat.items?.length ? (
          <div key={cat.id} id={`chat-menu-cat-${cat.id}`}>
            <h4 className="border-b border-slate-200 pb-1 font-serif text-base font-semibold text-slate-900">
              {cat.name}
            </h4>
            <ul className="mt-2 space-y-3">
              {cat.items.map((d) => (
                <li
                  key={d.id}
                  className="flex gap-2 rounded-xl border border-slate-100 bg-white p-2 shadow-sm"
                >
                  <img
                    src={d.image_url || MENU_FALLBACK_IMG}
                    alt=""
                    className="h-14 w-14 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900">
                        {d.name}
                      </p>
                      <span className="shrink-0 text-sm font-bold text-violet-700">
                        {priceLabel(d.price)}
                      </span>
                    </div>
                    {d.description ? (
                      <p className="mt-0.5 line-clamp-2 text-xs text-slate-600">
                        {d.description}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null
      )}
      {uncategorized.length ? (
        <div>
          <h4 className="border-b border-slate-200 pb-1 font-serif text-base font-semibold text-slate-900">
            More
          </h4>
          <ul className="mt-2 space-y-3">
            {uncategorized.map((d) => (
              <li
                key={d.id}
                className="flex gap-2 rounded-xl border border-slate-100 bg-white p-2 shadow-sm"
              >
                <img
                  src={d.image_url || MENU_FALLBACK_IMG}
                  alt=""
                  className="h-14 w-14 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900">
                      {d.name}
                    </p>
                    <span className="shrink-0 text-sm font-bold text-violet-700">
                      {priceLabel(d.price)}
                    </span>
                  </div>
                  {d.description ? (
                    <p className="mt-0.5 line-clamp-2 text-xs text-slate-600">
                      {d.description}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
