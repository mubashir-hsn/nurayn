"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { useSettingsStore } from "@/store/useSettingsStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "../../components/ui/label";
import {
  Type,
  Languages,
  Volume2,
  Moon,
  Trash2,
  Settings as SettingsIcon,
  ShieldCheck,
  Bell,
  Sparkles,
  Palette,
  Monitor,
  Database
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const {
    fontSize,
    setFontSize,
    translationEnabled,
    toggleTranslation,
    urduEnabled,
    toggleUrdu,
    autoPlayNext,
    toggleAutoPlay,
    hasHydrated
  } = useSettingsStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const clearData = () => {
    if (confirm("Are you sure you want to clear all reading progress and favorites?")) {
      localStorage.clear();
      toast.success("All local data cleared");
      window.location.reload();
    }
  };

  if (!mounted) return null;
  if (!hasHydrated) return <div className="min-h-screen flex items-center justify-center">Loading Settings...</div>;

  return (
    <main className="min-h-screen bg-background pb-32">
      <Navbar />

      {/* Premium Header */}
      <section className="pt-36 pb-20 relative overflow-hidden bg-primary dark:bg-emerald-950">
        <div className="absolute inset-0 premium-gradient-green opacity-90 pointer-events-none" />
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]" />
        
        <div className="container px-4 mx-auto relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-gold font-bold text-sm mb-6 border border-white/20 shadow-sm backdrop-blur-md">
              <SettingsIcon className="h-4 w-4" /> App Preferences
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
              App <span className="text-gold">Settings</span>
            </h1>
            <p className="text-xl text-white/80 mb-10 leading-relaxed">
              Personalize your spiritual journey. Customize reading fonts, translations, and app behavior.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container px-4 mx-auto py-16">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">

          {/* Navigation Sidebar (Visual only for now) */}
          <div className="md:col-span-4 space-y-2">
            {[
              { label: "Appearance", icon: Palette, active: true },
              { label: "Reading Mode", icon: Type },
              { label: "Audio & Playback", icon: Volume2 },
              { label: "Notifications", icon: Bell },
              { label: "Data Management", icon: Database },
            ].map((item) => (
              <Button
                key={item.label}
                variant={item.active ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start h-14 rounded-2xl gap-4 font-bold text-sm transition-all",
                  item.active ? "bg-primary dark:bg-emerald-950 text-white shadow-lg" : "text-muted-foreground hover:bg-emerald-50 hover:text-foreground dark:text-primary"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Button>
            ))}
          </div>

          {/* Settings Content */}
          <div className="md:col-span-8 space-y-8">
            {/* Appearance Section */}
            <Card className="border-none shadow-sm rounded-[2.5rem] bg-card overflow-hidden">
              <CardHeader className="p-8 pb-0">
                <CardTitle className="text-lg font-black text-foreground dark:text-primary flex items-center gap-3">
                  <div className="h-8 w-8 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                    <Palette className="h-4 w-4" />
                  </div>
                  Theme & Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="flex items-center justify-between p-6 bg-background rounded-3xl border border-[#F0F2F5]">
                  <div className="space-y-1">
                    <Label className="font-bold text-foreground dark:text-primary">Dark Mode</Label>
                    <p className="text-xs text-muted-foreground">Enable dark theme for night reading</p>
                  </div>
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Reading Preferences */}
            <Card className="border-none shadow-sm rounded-[2.5rem] bg-card overflow-hidden">
              <CardHeader className="p-8 pb-0">
                <CardTitle className="text-lg font-black text-foreground dark:text-primary flex items-center gap-3">
                  <div className="h-8 w-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                    <Type className="h-4 w-4" />
                  </div>
                  Reading Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-6 p-6 bg-background rounded-3xl border border-[#F0F2F5]">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <Label className="font-bold text-foreground dark:text-primary">Arabic Font Size</Label>
                      <p className="text-xs text-muted-foreground">Current size: {fontSize}px</p>
                    </div>
                    <span className="text-xs font-black text-gold bg-gold/10 px-3 py-1 rounded-full">{fontSize}px</span>
                  </div>
                  <Slider
                    value={[fontSize]}
                    min={16}
                    max={64}
                    step={1}
                    onValueChange={(val) => setFontSize(Array.isArray(val) ? val[0] : val)}
                    className="py-4"
                  />
                  <div
                    className="mt-4 p-8 bg-card rounded-2xl font-quran text-right border border-[#F0F2F5] shadow-inner text-foreground dark:text-primary leading-relaxed"
                    style={{ fontSize: `${fontSize}px` }}
                    dir="rtl"
                  >
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-6 bg-background rounded-3xl border border-[#F0F2F5]">
                    <div className="space-y-1">
                      <Label className="font-bold text-foreground dark:text-primary">English</Label>
                      <p className="text-[10px] text-muted-foreground">Translation</p>
                    </div>
                    <Switch checked={translationEnabled} onCheckedChange={toggleTranslation} />
                  </div>
                  <div className="flex items-center justify-between p-6 bg-background rounded-3xl border border-[#F0F2F5]">
                    <div className="space-y-1">
                      <Label className="font-bold text-foreground dark:text-primary">Urdu</Label>
                      <p className="text-[10px] text-muted-foreground">Translation</p>
                    </div>
                    <Switch checked={urduEnabled} onCheckedChange={toggleUrdu} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Audio Settings */}
            <Card className="border-none shadow-sm rounded-[2.5rem] bg-card overflow-hidden">
              <CardHeader className="p-8 pb-0">
                <CardTitle className="text-lg font-black text-foreground dark:text-primary flex items-center gap-3">
                  <div className="h-8 w-8 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center">
                    <Volume2 className="h-4 w-4" />
                  </div>
                  Audio & Playback
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center justify-between p-6 bg-background rounded-3xl border border-[#F0F2F5]">
                  <div className="space-y-1">
                    <Label className="font-bold text-foreground dark:text-primary">Auto-play Next Ayah</Label>
                    <p className="text-xs text-muted-foreground">Continuous recitation flow</p>
                  </div>
                  <Switch checked={autoPlayNext} onCheckedChange={toggleAutoPlay} />
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-none shadow-sm rounded-[2.5rem] bg-red-50/30 overflow-hidden border border-red-100">
              <CardHeader className="p-8 pb-0">
                <CardTitle className="text-lg font-black text-red-600 flex items-center gap-3">
                  <div className="h-8 w-8 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">
                    <Trash2 className="h-4 w-4" />
                  </div>
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-card rounded-3xl border border-red-100 shadow-sm">
                  <div className="space-y-1 text-center sm:text-left">
                    <Label className="font-bold text-foreground dark:text-primary">Clear Local Data</Label>
                    <p className="text-xs text-muted-foreground">Deletes all favorites, bookmarks, and local progress</p>
                  </div>
                  <Button variant="destructive" onClick={clearData} className="rounded-xl px-8 h-12 font-bold shadow-lg shadow-red-500/20">
                    Reset All Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </main>
  );
}

