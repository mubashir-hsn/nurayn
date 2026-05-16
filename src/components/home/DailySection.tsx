"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Quote, Sparkles, BookOpen, MessageSquare, ArrowRight, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { quranService } from "@/services/quranService";
import { hadithService } from "@/services/hadithService";
import { Ayah, Hadith } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

export const DailySection = () => {
  const [dailyAyah, setDailyAyah] = useState<Ayah | null>(null);
  const [dailyHadith, setDailyHadith] = useState<Hadith | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ayah, hadith] = await Promise.all([
          quranService.getDailyAyah(),
          hadithService.getDailyHadith()
        ]);
        setDailyAyah(ayah);
        setDailyHadith(hadith);
      } catch (error) {
        console.error("Error fetching daily content", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Ayah of the Day */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <Card className="border-none shadow-sm rounded-[2.5rem] bg-card overflow-hidden p-8 md:p-12">
          <CardContent className="p-0 space-y-8">
            <div className="flex justify-between items-start">
              <div className="space-y-3">
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full uppercase tracking-widest">
                  Ayah of the Day
                </span>
                <h2 className="text-2xl font-bold text-foreground dark:text-primary pt-2">
                  {dailyAyah ? `Surah ${dailyAyah.surah?.englishName} • Ayah ${dailyAyah.numberInSurah}` : "Loading Ayah..."}
                </h2>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="rounded-full border border-border h-10 w-10 text-muted-foreground hover:text-gold hover:border-gold">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full border border-border h-10 w-10 text-muted-foreground hover:text-gold hover:border-gold">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4 text-center">
                <Skeleton className="h-16 w-3/4 mx-auto" />
                <Skeleton className="h-8 w-1/2 mx-auto" />
              </div>
            ) : dailyAyah ? (
              <div className="space-y-8 text-center">
                <p className="font-quran text-2xl md:text-4xl text-gold leading-[1.6]" dir="rtl">
                  {dailyAyah.text}
                </p>
                <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto italic leading-relaxed">
                  "| {dailyAyah.translation} |"
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </motion.div>

      {/* Hadith of the Day */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <Card className="border-none shadow-sm rounded-[2.5rem] bg-card overflow-hidden p-8 md:p-12 relative">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <MessageSquare className="h-24 w-24 text-emerald-900" />
          </div>
          <CardContent className="p-0 space-y-8 relative z-10">
            <div className="flex justify-between items-start">
              <div className="space-y-3">
                <span className="text-[10px] font-black text-gold bg-gold/10 px-4 py-2 rounded-full uppercase tracking-widest">
                  Hadith of the Day
                </span>
                <h2 className="text-2xl pt-2 font-bold text-foreground dark:text-primary">
                  {dailyHadith ? dailyHadith.bookName : "Loading Hadith..."}
                </h2>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-8 w-3/4" />
              </div>
            ) : dailyHadith ? (
              <div className="space-y-8">
                <p className="font-quran text-xl md:text-2xl text-right text-emerald-800 dark:text-emerald-300 leading-relaxed" dir="rtl">
                  {dailyHadith.hadithArabic}
                </p>
                <div className="pt-6 border-t border-emerald-900/10">
                  <p className="text-base text-emerald-900/70 dark:text-emerald-100/60 leading-relaxed italic">
                    "{dailyHadith.hadithEnglish}"
                  </p>
                  <div className="mt-6 flex justify-end">
                    <Link href="/hadith">
                      <Button variant="ghost" className="text-gold font-bold hover:bg-gold/10 gap-2 h-10 px-4 text-sm">
                        Read Hadith Library <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
