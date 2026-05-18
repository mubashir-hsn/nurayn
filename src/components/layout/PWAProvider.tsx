"use client";

import React, { useEffect } from "react";
import { usePWAStore } from "@/store/usePWAStore";
import { initDB } from "@/lib/indexedDB";
import { toast } from "sonner";
import { Wifi, WifiOff, Sparkles } from "lucide-react";

export const PWAProvider = ({ children }: { children: React.ReactNode }) => {
  const { setOnline, setInstallPrompt, setIsInstalled } = usePWAStore();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Initialize offline IndexedDB database
    initDB()
      .then(() => console.log("[IndexedDB] Offline database initialized successfully"))
      .catch((err) => console.error("[IndexedDB] Failed to initialize offline database:", err));

    // 2. Register/Unregister Service Worker
    if ("serviceWorker" in navigator) {
      if (process.env.NODE_ENV === "development") {
        // Automatically unregister all service workers in development mode to avoid caching/hydration conflicts
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (let registration of registrations) {
            registration.unregister().then((success) => {
              if (success) console.log("[Service Worker] Automatically unregistered in Development Mode.");
            });
          }
        });
      } else {
        window.addEventListener("load", () => {
          navigator.serviceWorker
            .register("/sw.js")
            .then((registration) => {
              console.log("[Service Worker] Registered successfully with scope:", registration.scope);
            })
            .catch((error) => {
              console.error("[Service Worker] Registration failed:", error);
            });
        });
      }
    }

    // 3. Monitor Network Status & Trigger Toast UI
    const handleOnline = () => {
      setOnline(true);
      toast.success("We are back online!", {
        description: "Your connections are restored. Content will auto-sync.",
        icon: <Wifi className="h-5 w-5 text-emerald-500 animate-bounce" />,
        duration: 4000,
      });
    };

    const handleOffline = () => {
      setOnline(false);
      toast.warning("You are currently offline", {
        description: "Accessing downloaded Surahs and locally cached pages.",
        icon: <WifiOff className="h-5 w-5 text-amber-500 animate-pulse" />,
        duration: 5000,
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Set initial network state
    setOnline(navigator.onLine);

    // 4. Capture PWA Installation prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent default browser install banner
      e.preventDefault();
      // Store the event for triggering it later inside our custom UI
      setInstallPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      toast.success("Nurayn installed successfully!", {
        description: "You can now open it directly from your home screen or desktop.",
        icon: <Sparkles className="h-5 w-5 text-gold" />,
      });
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Check if currently running as PWA standalone
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [setOnline, setInstallPrompt, setIsInstalled]);

  return <>{children}</>;
};
