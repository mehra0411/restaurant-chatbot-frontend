import ChatWidget from "../components/ChatWidget";
import { usePublicRestaurantData } from "../hooks/usePublicRestaurantData";

const DEFAULT_SETTINGS = {
  name: "Meridian",
  tagline: "Downtown · Since 2014",
  hero_line1: "Modern plates.",
  hero_line2: "Warm hospitality.",
  hero_subtitle:
    "Seasonal American dining with an open kitchen, natural wine, and nights that run late.",
  address: "428 Meridian Ave, River District",
  website_url: "",
  maps_url: "",
  instagram_url: "",
  facebook_url: "",
  phone: "(555) 014-8920",
  hours_text: "Tue–Thu 5–10 · Fri–Sat 5–11 · Sun brunch 10–2",
};

/**
 * Standalone route for embedding on other sites via iframe.
 * The iframe MUST have a height (and ideally a width), e.g.:
 *
 * <iframe
 *   src="https://YOUR-VERCEL-APP.vercel.app/embed"
 *   title="Restaurant chat"
 *   width="100%"
 *   height="620"
 *   style="border:0;display:block;min-height:420px"
 *   loading="lazy"
 * />
 */
export default function EmbedChatPage() {
  const { settings, menu, menuError } = usePublicRestaurantData();
  const merged = { ...DEFAULT_SETTINGS, ...(settings || {}) };

  return (
    <div className="flex h-full min-h-[min(100vh,100dvh)] min-h-[420px] w-full flex-col bg-slate-200/80 font-sans">
      <ChatWidget
        embed
        restaurantName={merged.name}
        websiteUrl={merged.website_url}
        mapsUrl={merged.maps_url}
        phone={merged.phone}
        instagramUrl={merged.instagram_url}
        facebookUrl={merged.facebook_url}
        menu={menu}
        menuError={menuError}
      />
    </div>
  );
}
