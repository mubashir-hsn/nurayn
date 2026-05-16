"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RotateCcw, Plus, Volume2, VolumeX, History, Settings, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

export default function TasbeehPage() {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("tasbeeh-total");
    if (saved) setTotalCount(parseInt(saved));
  }, []);

  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);
    setTotalCount(prev => {
      const updated = prev + 1;
      localStorage.setItem("tasbeeh-total", updated.toString());
      return updated;
    });

    if (soundEnabled) {
      const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3");
      audio.volume = 0.2;
      audio.play().catch(() => { });
    }

    if (newCount === target) {
      toast.success("Target reached!");
      if (window.navigator.vibrate) window.navigator.vibrate(200);
    }
  };

  const handleReset = () => {
    setCount(0);
    toast.info("Counter reset");
  };

  return (
    <main className="min-h-screen pb-20">
      <Navbar />

      {/* Premium Hero Section */}
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
              <Sparkles className="h-4 w-4" /> Spiritual Practice
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
              Digital <span className="text-gold">Tasbeeh</span>
            </h1>
            <p className="text-xl text-white/80 mb-6 leading-relaxed">
              Remember Allah in every moment with our interactive digital counter.
            </p>
            <div className="inline-flex items-center justify-center gap-2 text-gold font-bold bg-black/20 px-6 py-3 rounded-full backdrop-blur-md border border-white/10 shadow-inner">
              <History className="h-5 w-5" />
              <span>Total Lifetime Dhikr: {totalCount}</span>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container px-4 mx-auto py-12 flex flex-col items-center">
        <div className="w-full max-w-md">
          <Card className="overflow-hidden border-none shadow-2xl bg-card aspect-square rounded-[3rem] relative flex flex-col items-center justify-center p-8 border-4 border-primary-green/20">
            {/* Inner Ring */}
            <div className="absolute inset-4 rounded-[2.5rem] border-2 border-dashed border-primary-green/20 pointer-events-none" />

            <div className="text-center z-10">
              <span className="text-sm font-bold text-primary-green tracking-widest uppercase mb-2 block">Current Count</span>
              <motion.h2
                key={count}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-8xl md:text-9xl font-black text-foreground mb-4"
              >
                {count}
              </motion.h2>
              <div className="px-4 py-1 bg-secondary rounded-full inline-block">
                <span className="text-sm font-medium text-muted-foreground">Target: {target}</span>
              </div>
            </div>

            <Button
              onClick={handleIncrement}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            <motion.div
              whileTap={{ scale: 0.95 }}
              className="absolute bottom-12 h-24 w-24 rounded-full bg-primary-green shadow-xl shadow-primary-green/30 flex items-center justify-center text-white pointer-events-none"
            >
              <Plus className="h-10 w-10" />
            </motion.div>
          </Card>

          <div className="flex items-center justify-between mt-12 gap-4">
            <Button
              variant="outline"
              size="lg"
              className="flex-1 h-14 rounded-2xl border-2 font-bold"
              onClick={handleReset}
            >
              <RotateCcw className="mr-2 h-5 w-5" /> Reset
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-14 w-14 rounded-2xl border-2 p-0"
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-14 w-14 rounded-2xl border-2 p-0"
              onClick={() => setTarget(target === 33 ? 100 : 33)}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>

          <div className="mt-12 space-y-4">
            <h3 className="font-bold text-xl text-center mb-6">Popular Dhikr</h3>
            <div className="grid grid-cols-1 gap-3">
              {[
                { ar: "سُبْحَانَ اللهِ", en: "SubhanAllah", sub: "Glory be to Allah" },
                { ar: "اَلْحَمْدُ لِلهِ", en: "Alhamdulillah", sub: "Praise be to Allah" },
                { ar: "اَللهُ أَكْبَرُ", en: "Allahu Akbar", sub: "Allah is Greatest" },
              ].map((dhikr, i) => (
                <button
                  key={i}
                  onClick={() => { setCount(0); toast.info(`Started ${dhikr.en}`) }}
                  className="w-full flex items-center justify-between p-4 bg-card border rounded-2xl hover:border-primary-green hover:shadow-md transition-all text-left"
                >
                  <div>
                    <p className="font-bold">{dhikr.en}</p>
                    <p className="text-xs text-muted-foreground">{dhikr.sub}</p>
                  </div>
                  <p className="font-arabic text-2xl text-primary-green">{dhikr.ar}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
