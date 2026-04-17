import { useEffect, useState, useCallback } from "react";
import { api } from "../api/client";

export function usePublicRestaurantData() {
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

  return { settings, menu, menuError, reload: load };
}
