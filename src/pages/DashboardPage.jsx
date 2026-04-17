import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";

const STORAGE_KEY = "restaurant_dashboard_secret";

const TABS = [
  { id: "settings", label: "Restaurant" },
  { id: "categories", label: "Categories" },
  { id: "items", label: "Menu items" },
  { id: "reservations", label: "Reservations" },
  { id: "orders", label: "Orders" },
];

function adminHeaders(secret) {
  return { headers: { "x-dashboard-secret": secret } };
}

export default function DashboardPage() {
  const [secret, setSecret] = useState(
    () => sessionStorage.getItem(STORAGE_KEY) || ""
  );
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginErr, setLoginErr] = useState(null);
  const [tab, setTab] = useState("settings");
  const [busy, setBusy] = useState(false);

  const [settings, setSettings] = useState({});
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [refreshNote, setRefreshNote] = useState(null);

  const [catName, setCatName] = useState("");
  const [itemForm, setItemForm] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    category_id: "",
    is_available: true,
    sort_order: 0,
  });
  const [editingItemId, setEditingItemId] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    (async () => {
      try {
        await api.get("/api/admin/verify", adminHeaders(stored));
        setSecret(stored);
        setLoggedIn(true);
      } catch {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    })();
  }, []);

  const refreshAll = useCallback(async () => {
    if (!secret) return;
    setRefreshNote(null);
    const h = adminHeaders(secret);
    const labels = ["Settings", "Categories", "Menu items", "Reservations", "Orders"];
    const settled = await Promise.allSettled([
      api.get("/api/admin/settings", h),
      api.get("/api/admin/categories", h),
      api.get("/api/admin/menu-items", h),
      api.get("/api/admin/reservations", h),
      api.get("/api/admin/orders", h),
    ]);
    const failed = [];
    settled.forEach((r, idx) => {
      if (r.status === "rejected") {
        const msg =
          r.reason?.response?.data?.error ??
          r.reason?.message ??
          "Request failed";
        failed.push(`${labels[idx]}: ${msg}`);
      }
    });
    const ok = (idx) => (settled[idx].status === "fulfilled" ? settled[idx].value.data : null);
    setSettings(typeof ok(0) === "object" && ok(0) !== null ? ok(0) : {});
    setCategories(Array.isArray(ok(1)) ? ok(1) : []);
    setItems(Array.isArray(ok(2)) ? ok(2) : []);
    setReservations(Array.isArray(ok(3)) ? ok(3) : []);
    setOrders(Array.isArray(ok(4)) ? ok(4) : []);
    if (failed.length) {
      setRefreshNote(failed.join(" · "));
    }
  }, [secret]);

  const tryLogin = async (e) => {
    e.preventDefault();
    setLoginErr(null);
    setBusy(true);
    try {
      await api.get("/api/admin/verify", adminHeaders(secret));
      sessionStorage.setItem(STORAGE_KEY, secret);
      setLoggedIn(true);
      await refreshAll();
    } catch (err) {
      setLoginErr(err.response?.data?.error || err.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setSecret("");
    setLoggedIn(false);
  };

  useEffect(() => {
    if (!secret || !loggedIn) return;
    refreshAll().catch(() => {});
  }, [secret, loggedIn, refreshAll]);

  const saveSettings = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await api.patch(
        "/api/admin/settings",
        settings,
        adminHeaders(secret)
      );
      setSettings(data);
      alert("Saved.");
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    } finally {
      setBusy(false);
    }
  };

  const addCategory = async (e) => {
    e.preventDefault();
    if (!catName.trim()) return;
    setBusy(true);
    try {
      await api.post(
        "/api/admin/categories",
        { name: catName.trim(), sort_order: categories.length },
        adminHeaders(secret)
      );
      setCatName("");
      await refreshAll();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    } finally {
      setBusy(false);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category? Items will become uncategorized."))
      return;
    setBusy(true);
    try {
      await api.delete(`/api/admin/categories/${id}`, adminHeaders(secret));
      await refreshAll();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    } finally {
      setBusy(false);
    }
  };

  const resetItemForm = () => {
    setItemForm({
      name: "",
      description: "",
      price: "",
      image_url: "",
      category_id: "",
      is_available: true,
      sort_order: 0,
    });
    setEditingItemId(null);
  };

  const submitItem = async (e) => {
    e.preventDefault();
    if (!itemForm.name.trim()) return;
    setBusy(true);
    try {
      const payload = {
        ...itemForm,
        name: itemForm.name.trim(),
        category_id: itemForm.category_id || null,
        price: itemForm.price === "" ? null : itemForm.price,
      };
      if (editingItemId) {
        await api.patch(
          `/api/admin/menu-items/${editingItemId}`,
          payload,
          adminHeaders(secret)
        );
      } else {
        await api.post("/api/admin/menu-items", payload, adminHeaders(secret));
      }
      resetItemForm();
      await refreshAll();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    } finally {
      setBusy(false);
    }
  };

  const editItem = (row) => {
    setEditingItemId(row.id);
    setItemForm({
      name: row.name,
      description: row.description || "",
      price: row.price != null ? String(row.price) : "",
      image_url: row.image_url || "",
      category_id: row.category_id || "",
      is_available: row.is_available !== false,
      sort_order: row.sort_order ?? 0,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    setBusy(true);
    try {
      await api.delete(`/api/admin/menu-items/${id}`, adminHeaders(secret));
      if (editingItemId === id) resetItemForm();
      await refreshAll();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    } finally {
      setBusy(false);
    }
  };

  const setOrderStatus = async (id, status) => {
    setBusy(true);
    try {
      await api.patch(
        `/api/admin/orders/${id}`,
        { status },
        adminHeaders(secret)
      );
      await refreshAll();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    } finally {
      setBusy(false);
    }
  };

  const setReservationStatus = async (id, status) => {
    setBusy(true);
    try {
      await api.patch(
        `/api/admin/reservations/${id}`,
        { status },
        adminHeaders(secret)
      );
      await refreshAll();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    } finally {
      setBusy(false);
    }
  };

  if (!loggedIn) {
    return (
      <div className="flex min-h-full items-center justify-center bg-slate-100 px-4 py-16">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
          <h1 className="font-serif text-2xl font-semibold text-slate-900">
            Staff dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Enter the secret from your server{" "}
            <code className="rounded bg-slate-100 px-1 text-xs">DASHBOARD_SECRET</code>{" "}
            in <code className="rounded bg-slate-100 px-1 text-xs">.env</code>.
          </p>
          <form onSubmit={tryLogin} className="mt-6 space-y-4">
            {loginErr ? (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
                {loginErr}
              </p>
            ) : null}
            <input
              type="password"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              placeholder="Dashboard secret"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="submit"
              disabled={busy || !secret}
              className="w-full rounded-full bg-violet-600 py-3 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-50"
            >
              {busy ? "Checking…" : "Unlock"}
            </button>
          </form>
          <Link
            to="/"
            className="mt-6 block text-center text-sm text-violet-600 hover:underline"
          >
            ← Back to site
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <h1 className="font-serif text-xl font-semibold text-slate-900">
              Restaurant dashboard
            </h1>
            <p className="text-xs text-slate-500">
              Menu, settings &amp; customer orders
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => refreshAll()}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Refresh
            </button>
            <Link
              to="/"
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              View site
            </Link>
            <button
              type="button"
              onClick={logout}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Log out
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-3 sm:px-6">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                tab === t.id
                  ? "bg-violet-600 text-white"
                  : "text-slate-600 hover:bg-slate-200/80"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
        {refreshNote ? (
          <div className="mx-auto flex max-w-6xl items-start gap-3 border-t border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 sm:px-6">
            <p className="min-w-0 flex-1">
              <span className="font-semibold">Some data did not load:</span>{" "}
              {refreshNote}
            </p>
            <button
              type="button"
              onClick={() => setRefreshNote(null)}
              className="shrink-0 rounded-lg px-2 py-1 text-xs font-medium text-amber-900 hover:bg-amber-100"
            >
              Dismiss
            </button>
          </div>
        ) : null}
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {tab === "settings" ? (
          <form
            onSubmit={saveSettings}
            className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="font-semibold text-slate-900">Restaurant details</h2>
            <p className="text-sm text-slate-500">
              Shown on the public site: hero copy, visit section, and links.
            </p>
            {[
              ["name", "Brand name"],
              ["tagline", "Tagline (hero eyebrow)"],
              ["hero_line1", "Hero line 1"],
              ["hero_line2", "Hero line 2"],
              ["hero_subtitle", "Hero paragraph"],
              ["address", "Address"],
              ["phone", "Phone"],
              ["hours_text", "Hours (one line)"],
              ["website_url", "Website URL"],
              ["maps_url", "Maps / directions URL"],
              ["instagram_url", "Instagram URL"],
              ["facebook_url", "Facebook URL"],
            ].map(([key, label]) => (
              <div key={key}>
                <label className="block text-xs font-semibold uppercase text-slate-500">
                  {label}
                </label>
                <input
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  value={settings[key] ?? ""}
                  onChange={(e) =>
                    setSettings((s) => ({ ...s, [key]: e.target.value }))
                  }
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={busy}
              className="rounded-full bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-50"
            >
              Save settings
            </button>
          </form>
        ) : null}

        {tab === "categories" ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-900">Categories</h2>
            <form onSubmit={addCategory} className="mt-4 flex gap-2">
              <input
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                placeholder="New category name"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
              />
              <button
                type="submit"
                disabled={busy}
                className="rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Add
              </button>
            </form>
            <ul className="mt-6 divide-y divide-slate-100">
              {categories.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between py-3 text-sm"
                >
                  <span className="font-medium">{c.name}</span>
                  <button
                    type="button"
                    onClick={() => deleteCategory(c.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {tab === "items" ? (
          <div className="space-y-6">
            <form
              onSubmit={submitItem}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="font-semibold text-slate-900">
                {editingItemId ? "Edit menu item" : "Add menu item"}
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase text-slate-500">
                    Name *
                  </label>
                  <input
                    required
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    value={itemForm.name}
                    onChange={(e) =>
                      setItemForm((f) => ({ ...f, name: e.target.value }))
                    }
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase text-slate-500">
                    Description
                  </label>
                  <textarea
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    rows={2}
                    value={itemForm.description}
                    onChange={(e) =>
                      setItemForm((f) => ({ ...f, description: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">
                    Price (leave empty if N/A)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    value={itemForm.price}
                    onChange={(e) =>
                      setItemForm((f) => ({ ...f, price: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">
                    Category
                  </label>
                  <select
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    value={itemForm.category_id}
                    onChange={(e) =>
                      setItemForm((f) => ({ ...f, category_id: e.target.value }))
                    }
                  >
                    <option value="">— None —</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase text-slate-500">
                    Image URL
                  </label>
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    placeholder="https://…"
                    value={itemForm.image_url}
                    onChange={(e) =>
                      setItemForm((f) => ({ ...f, image_url: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">
                    Sort order
                  </label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    value={itemForm.sort_order}
                    onChange={(e) =>
                      setItemForm((f) => ({
                        ...f,
                        sort_order: Number(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    id="avail"
                    type="checkbox"
                    checked={itemForm.is_available}
                    onChange={(e) =>
                      setItemForm((f) => ({
                        ...f,
                        is_available: e.target.checked,
                      }))
                    }
                  />
                  <label htmlFor="avail" className="text-sm">
                    Available on public menu
                  </label>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-full bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white"
                >
                  {editingItemId ? "Update item" : "Add item"}
                </button>
                {editingItemId ? (
                  <button
                    type="button"
                    onClick={resetItemForm}
                    className="rounded-full border border-slate-200 px-6 py-2.5 text-sm font-medium"
                  >
                    Cancel edit
                  </button>
                ) : null}
              </div>
            </form>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-4">
                <h3 className="font-semibold text-slate-900">All items</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">On menu</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((row) => {
                      const cat = categories.find((c) => c.id === row.category_id);
                      return (
                        <tr key={row.id}>
                          <td className="px-4 py-3 font-medium">{row.name}</td>
                          <td className="px-4 py-3 text-slate-600">
                            {cat?.name || "—"}
                          </td>
                          <td className="px-4 py-3">
                            {row.price != null ? `$${row.price}` : "—"}
                          </td>
                          <td className="px-4 py-3">
                            {row.is_available ? "Yes" : "No"}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              type="button"
                              onClick={() => editItem(row)}
                              className="mr-3 text-violet-600 hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteItem(row.id)}
                              className="text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : null}

        {tab === "reservations" ? (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="font-semibold text-slate-900">Table requests</h2>
              <p className="mt-1 text-xs text-slate-500">
                Submitted from the public &quot;Book a table&quot; form. Confirm by
                phone or email with the guest.
              </p>
            </div>
            <div className="divide-y divide-slate-100">
              {reservations.length === 0 ? (
                <p className="p-6 text-sm text-slate-500">No reservation requests yet.</p>
              ) : (
                reservations.map((rv) => (
                  <div key={rv.id} className="p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-900">{rv.guest_name}</p>
                        <p className="text-sm text-slate-600">{rv.guest_phone}</p>
                        {rv.guest_email ? (
                          <p className="text-sm text-slate-600">{rv.guest_email}</p>
                        ) : null}
                        <p className="mt-2 text-xs text-slate-400">
                          Requested {new Date(rv.created_at).toLocaleString()}
                        </p>
                      </div>
                      <select
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                        value={rv.status}
                        onChange={(e) =>
                          setReservationStatus(rv.id, e.target.value)
                        }
                        disabled={busy}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="seated">Seated</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="no_show">No-show</option>
                      </select>
                    </div>
                    <p className="mt-3 text-sm text-slate-700">
                      <span className="font-medium">When:</span>{" "}
                      {rv.reservation_date} at {rv.reservation_time} · party of{" "}
                      {rv.party_size}
                    </p>
                    {rv.occasion ? (
                      <p className="mt-1 text-sm text-slate-700">
                        <span className="font-medium">Occasion:</span> {rv.occasion}
                      </p>
                    ) : null}
                    {rv.dietary_notes ? (
                      <p className="mt-2 text-sm text-slate-600">
                        <span className="font-medium">Dietary:</span> {rv.dietary_notes}
                      </p>
                    ) : null}
                    {rv.special_requests ? (
                      <p className="mt-2 text-sm text-slate-600">
                        <span className="font-medium">Requests:</span>{" "}
                        {rv.special_requests}
                      </p>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </div>
        ) : null}

        {tab === "orders" ? (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="font-semibold text-slate-900">Customer orders</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {orders.length === 0 ? (
                <p className="p-6 text-sm text-slate-500">No orders yet.</p>
              ) : (
                orders.map((o) => (
                  <div key={o.id} className="p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {o.customer_name}
                        </p>
                        <p className="text-sm text-slate-600">{o.customer_phone}</p>
                        {o.customer_email ? (
                          <p className="text-sm text-slate-600">{o.customer_email}</p>
                        ) : null}
                        <p className="mt-2 text-xs text-slate-400">
                          {new Date(o.created_at).toLocaleString()}
                        </p>
                      </div>
                      <select
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                        value={o.status}
                        onChange={(e) => setOrderStatus(o.id, e.target.value)}
                        disabled={busy}
                      >
                        <option value="new">New</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <p className="mt-3 text-sm text-slate-700">
                      <span className="font-medium">Service:</span>{" "}
                      {o.service_type}
                      {o.preferred_time ? ` · ${o.preferred_time}` : ""}
                    </p>
                    <p className="mt-2 text-sm text-slate-700">
                      <span className="font-medium">Order:</span> {o.items_summary}
                    </p>
                    {o.notes ? (
                      <p className="mt-2 text-sm text-slate-600">
                        <span className="font-medium">Notes:</span> {o.notes}
                      </p>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
