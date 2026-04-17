import { useEffect, useState, useCallback } from "react";
import { api } from "../api/client";
import RestaurantLanding from "../components/RestaurantLanding";
import ChatWidget from "../components/ChatWidget";

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

export default function HomePage() {
  const [settings, setSettings] = useState(null);
  const [menu, setMenu] = useState({ categories: [], uncategorized: [] });
  const [menuError, setMenuError] = useState(null);

  const load = useCallback(async () => {
    setMenuError(null);
    try {
      const [sRes, mRes] = await Promise.all([
        api.get("/api/public/settings"),
        api.get("/api/public/menu"),
      ]);
      setSettings(sRes.data);
      setMenu(mRes.data || { categories: [], uncategorized: [] });
    } catch (e) {
      setMenuError(e.response?.data?.error || e.message);
      setSettings(null);
      setMenu({ categories: [], uncategorized: [] });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const mergedSettings = { ...DEFAULT_SETTINGS, ...(settings || {}) };

  const openChat = () => {
    window.dispatchEvent(new CustomEvent("open-restaurant-chat"));
  };

  return (
    <div className="min-h-full bg-slate-50 font-sans">
      <RestaurantLanding
        settings={mergedSettings}
        menu={menu}
        menuError={menuError}
        onOpenChat={openChat}
      />
      <ChatWidget
        restaurantName={mergedSettings.name}
        websiteUrl={mergedSettings.website_url}
        mapsUrl={mergedSettings.maps_url}
        phone={mergedSettings.phone}
        instagramUrl={mergedSettings.instagram_url}
        facebookUrl={mergedSettings.facebook_url}
      />
    </div>
  );
}
