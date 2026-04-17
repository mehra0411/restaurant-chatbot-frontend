import { Link } from "react-router-dom";
import { ChatBubbleIcon } from "./Icons";

const IMG_HERO =
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2000&q=80";

function withHttp(url) {
  const u = (url || "").trim();
  if (!u) return "";
  return u.startsWith("http") ? u : `https://${u}`;
}

export default function RestaurantLanding({
  settings,
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
            <button
              type="button"
              onClick={() => onOpenChat("menu")}
              className="transition hover:text-white"
            >
              Menu
            </button>
            <a href="#experience" className="transition hover:text-white">
              Experience
            </a>
            <a href="#visit" className="transition hover:text-white">
              Visit
            </a>
            <button
              type="button"
              onClick={() => onOpenChat("book")}
              className="transition hover:text-white"
            >
              Book
            </button>
            <button
              type="button"
              onClick={() => onOpenChat("order")}
              className="transition hover:text-white"
            >
              Order
            </button>
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
              onClick={() => onOpenChat()}
              className="rounded-full border border-white/20 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10 sm:px-4 sm:text-sm"
            >
              AI Concierge
            </button>
            <button
              type="button"
              onClick={() => onOpenChat("book")}
              className="rounded-full bg-violet-600 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-violet-600/25 transition hover:bg-violet-500 sm:px-5 sm:text-sm"
            >
              Book table
            </button>
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
            <button
              type="button"
              onClick={() => onOpenChat("book")}
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-xl transition hover:bg-slate-100"
            >
              Book a table
            </button>
            <button
              type="button"
              onClick={() => onOpenChat()}
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

      <section className="border-t border-slate-200 bg-slate-100 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-serif text-2xl font-medium text-slate-900 sm:text-3xl">
            Ready when you are
          </h2>
          <p className="mt-3 text-slate-600">
            Menu, reservations, and orders are handled in the AI chat—same-day
            changes or large parties, just ask.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => onOpenChat("book")}
              className="inline-flex rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Book a table
            </button>
            <button
              type="button"
              onClick={() => onOpenChat()}
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
              onClick={() => onOpenChat()}
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
