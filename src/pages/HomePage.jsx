import { useCallback } from "react";
import RestaurantLanding from "../components/RestaurantLanding";
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

export default function HomePage() {
  const { settings, menu, menuError } = usePublicRestaurantData();

  const mergedSettings = { ...DEFAULT_SETTINGS, ...(settings || {}) };

  const openChat = useCallback((panel) => {
    window.dispatchEvent(
      new CustomEvent("open-restaurant-chat", { detail: { panel } })
    );
  }, []);

  return (
    <div className="min-h-full bg-slate-50 font-sans">
      <RestaurantLanding settings={mergedSettings} onOpenChat={openChat} />
      <ChatWidget
        restaurantName={mergedSettings.name}
        websiteUrl={mergedSettings.website_url}
        mapsUrl={mergedSettings.maps_url}
        phone={mergedSettings.phone}
        instagramUrl={mergedSettings.instagram_url}
        facebookUrl={mergedSettings.facebook_url}
        menu={menu}
        menuError={menuError}
      />
    </div>
  );
}
