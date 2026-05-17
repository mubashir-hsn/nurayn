"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { DailySection } from "@/components/home/DailySection";
import { quranService } from "@/services/quranService";
import { Surah, Ayah, Hadith } from "@/types";
import { motion } from "framer-motion";
import { BookOpen, Book, Clock, MapPin, Compass, MessageCircle, ArrowRight, Heart, Share2, Play, Sparkles, BookMarked, Target } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useReadingStore } from "@/store/useReadingStore";
import { Skeleton } from "@/components/ui/skeleton";

interface PrayerTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export default function HomePage() {
  const [popularSurahs, setPopularSurahs] = useState<Surah[]>([]);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const { recentlyRead } = useReadingStore();
  const lastRead = recentlyRead[0];

  useEffect(() => {
    const fetchPopular = async () => {
      const fallbackPopular = [
        { number: 1, englishName: "Al-Faatiha", name: "الفاتحة", englishNameTranslation: "The Opening", numberOfAyahs: 7, revelationType: "Meccan" },
        { number: 18, englishName: "Al-Kahf", name: "الكهف", englishNameTranslation: "The Cave", numberOfAyahs: 110, revelationType: "Meccan" },
        { number: 36, englishName: "Ya-Sin", name: "يس", englishNameTranslation: "Ya Sin", numberOfAyahs: 83, revelationType: "Meccan" },
        { number: 67, englishName: "Al-Mulk", name: "الملك", englishNameTranslation: "The Sovereignty", numberOfAyahs: 30, revelationType: "Meccan" },
      ] as Surah[];

      try {
        const data = await quranService.getSurahs();
        if (data && data.length > 0) {
          const popularIds = [1, 18, 36, 67];
          const filtered = data.filter(s => popularIds.includes(s.number));
          setPopularSurahs(filtered.length > 0 ? filtered : fallbackPopular);
        } else {
          setPopularSurahs(fallbackPopular);
        }
      } catch (error) {
        console.error("Error fetching surahs", error);
        setPopularSurahs(fallbackPopular);
      }
    };

    const fetchPrayerTimes = async () => {
      const fallbackTimes: PrayerTimes = {
        Fajr: "04:30",
        Dhuhr: "12:15",
        Asr: "03:45",
        Maghrib: "06:20",
        Isha: "07:50"
      };

      try {
        const res = await fetch("https://api.aladhan.com/v1/timingsByCity?city=Lahore&country=Pakistan&method=1");
        if (!res.ok) throw new Error("API response not ok");
        const data = await res.json();
        setPrayerTimes(data.data.timings);
      } catch (error) {
        console.error("Error fetching prayer times, using fallback", error);
        setPrayerTimes(fallbackTimes);
      }
    };

    fetchPopular();
    fetchPrayerTimes();
  }, []);

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="container px-4 mx-auto pt-28 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column (Sidebar) */}
          <div className="lg:col-span-3 space-y-8">
            {/* Continue Reading Card */}
            <Card className="bg-primary dark:bg-emerald-950 text-white border-none rounded-[2rem] overflow-hidden relative group shadow-2xl shadow-emerald-900/10">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <BookMarked className="h-24 w-24" />
              </div>
              <CardContent className="p-8 relative z-10">
                <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Continue Reading</p>
                <h3 className="text-3xl font-bold mb-1">{lastRead?.englishName || "Al-Faatiha"}</h3>
                <p className="text-white/60 text-sm mb-8">Ayah 1 • Juz 1</p>
                <Link href={`/surah/${lastRead?.number || 1}`}>
                  <Button className="w-full bg-[#EAB308] hover:bg-[#CA8A04] text-foreground dark:text-primary font-black rounded-xl h-14 shadow-lg shadow-yellow-600/20">
                    Resume Recitation
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Popular Surahs */}
            <Card className="border-none shadow-sm rounded-[2rem] p-8 bg-card">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-foreground dark:text-primary">Popular Surahs</h3>
                <Link href="/surah" className="text-xs font-bold text-gold hover:underline">View All</Link>
              </div>
              <div className="space-y-6">
                {popularSurahs.length > 0 ? popularSurahs.map((surah) => (
                  <Link key={surah.number} href={`/surah/${surah.number}`} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-secondary/50 text-foreground dark:text-primary font-bold text-xs group-hover:bg-gold group-hover:text-white transition-all">
                        {surah.number.toString().padStart(2, '0')}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-foreground dark:text-primary group-hover:text-gold transition-colors">{surah.englishName}</h4>
                        <p className="text-[10px] text-muted-foreground uppercase">{surah.englishNameTranslation}</p>
                      </div>
                    </div>
                    <span className="font-quran text-lg text-foreground dark:text-primary">{surah.name}</span>
                  </Link>
                )) : Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-xl" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-12" />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column (Main Content) */}
          <div className="lg:col-span-9 space-y-8">

            {/* Prayer Times Bar (Lahore 2026) */}
            <Card className="border-none shadow-xl shadow-gold/20 rounded-[2rem] p-6 md:p-8 overflow-hidden relative" style={{ background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-light), var(--color-gold))' }}>
              {/* Decorative Elements */}
              <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]" />
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-700 rounded-xl shadow-lg shadow-emerald-900/20">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-emerald-900/60 uppercase tracking-[0.2em] leading-none mb-1">Lahore, PK</p>
                    <p className="text-sm font-bold text-emerald-900">{dateStr}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 md:gap-14 flex-1 justify-center">
                  {prayerTimes ? [
                    { label: "Fajr", time: prayerTimes.Fajr },
                    { label: "Dhuhr", time: prayerTimes.Dhuhr },
                    { label: "Asr", time: prayerTimes.Asr },
                    { label: "Maghrib", time: prayerTimes.Maghrib },
                    { label: "Isha", time: prayerTimes.Isha },
                  ].map((p) => (
                    <div key={p.label} className="text-center group">
                      <p className="text-[10px] text-black/60 uppercase mb-1 font-bold tracking-wider">{p.label}</p>
                      <p className="text-sm font-black text-emerald-900">
                        {p.time}
                      </p>
                    </div>
                  )) : Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-16 bg-white/20" />
                  ))}
                </div>

                <div className="hidden xl:flex flex-col items-end">
                  <p className="text-[10px] font-black text-emerald-800 uppercase tracking-[0.2em] mb-1">✦ Live</p>
                  <p className="text-sm font-bold text-black/70">All Times Updated</p>
                </div>
              </div>
            </Card>

            {/* Daily Section (Ayah & Hadith) */}
            <DailySection />

            {/* Feature Quick Links - Project Style */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Hadith Library", sub: "Sahih Bukhari & more", icon: BookOpen, color: "bg-blue-50", iconColor: "text-blue-500", href: "/hadith" },
                { title: "Tasbeeh Counter", sub: "Digital Spiritual Counter", icon: Sparkles, color: "bg-orange-50", iconColor: "text-orange-500", href: "/tasbeeh" },
                { title: "Qibla Finder", sub: "Direction to Mecca", icon: Compass, color: "bg-emerald-50", iconColor: "text-emerald-500", href: "/qibla" },
              ].map((f) => (
                <Link key={f.title} href={f.href}>
                  <Card className="border-none shadow-sm rounded-[2rem] p-6 hover:shadow-md transition-all group bg-card">
                    <div className="flex items-center gap-5">
                      <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105", f.color, f.iconColor)}>
                        <f.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground dark:text-primary text-lg">{f.title}</h4>
                        <p className="text-xs text-muted-foreground font-medium">{f.sub}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");
