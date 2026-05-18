"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { prayerService } from "@/services/prayerService";
import { PrayerTime } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, Loader2, Bell, BellOff } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function PrayerTimesPage() {
  const [times, setTimes] = useState<PrayerTime | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("Karachi, Pakistan");

  useEffect(() => {
    const fetchTimes = async () => {
      try {
        const data = await prayerService.getPrayerTimes();
        setTimes(data);
      } catch (error) {
        console.error("Error fetching prayer times", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTimes();
  }, []);

  const prayers = times ? [
    { name: "Fajr", time: times.Fajr },
    { name: "Sunrise", time: times.Sunrise },
    { name: "Dhuhr", time: times.Dhuhr },
    { name: "Asr", time: times.Asr },
    { name: "Maghrib", time: times.Maghrib },
    { name: "Isha", time: times.Isha },
  ] : [];

  return (
    <main className="min-h-screen pb-20">
      <Navbar />
      
      {/* Premium Prayer Times Hero */}
      <section className="pt-36 pb-20 relative overflow-hidden bg-primary dark:bg-emerald-950">
        <div className="absolute inset-0 premium-gradient-green opacity-95 pointer-events-none" />
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]" />
        
        <div className="container px-4 mx-auto relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-gold font-bold text-sm mb-6 border border-white/20 shadow-sm backdrop-blur-md">
              <Clock className="h-4 w-4 text-gold animate-pulse" /> Daily Salah Schedule
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
              Prayer <span className="text-gold">Times</span>
            </h1>
            <div className="flex items-center justify-center gap-2 text-lg sm:text-xl text-white/80 font-semibold tracking-wide">
              <MapPin className="h-5 w-5 text-gold" />
              <span>{location}</span>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container px-4 mx-auto py-12">
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {prayers.map((prayer, i) => (
                <motion.div
                  key={prayer.name}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="overflow-hidden border-none shadow-md bg-card hover:shadow-lg transition-all group">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="h-14 w-14 rounded-2xl bg-secondary flex items-center justify-center text-primary-green group-hover:bg-primary-green group-hover:text-white transition-all">
                          <Clock className="h-7 w-7" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{prayer.name}</h3>
                          <p className="text-muted-foreground">Salah Time</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-3xl font-black text-primary-green">{prayer.time}</span>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary-green">
                          <Bell className="h-5 w-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
