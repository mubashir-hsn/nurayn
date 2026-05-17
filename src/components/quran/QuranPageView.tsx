"use client";

import React from "react";
import { Ayah } from "@/types";
import { motion } from "framer-motion";
import { useSettingsStore } from "@/store/useSettingsStore";
import { cn } from "@/lib/utils";
import { useAudioStore } from "@/store/useAudioStore";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles } from "lucide-react";

interface QuranPageViewProps {
  ayahs: Ayah[];
  surahName?: string;
}

export const QuranPageView = ({ ayahs, surahName }: QuranPageViewProps) => {
  const { fontSize, setFontSize, translationEnabled, urduEnabled, hasHydrated } = useSettingsStore();
  const { currentAyah, setCurrentAyah, setIsPlaying } = useAudioStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !hasHydrated) {
    return <div className="h-96 flex items-center justify-center"><p className="text-muted-foreground animate-pulse">Loading Reading View...</p></div>;
  }

  const handleAyahClick = (ayah: Ayah) => {
    setCurrentAyah(ayah);
    setIsPlaying(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto bg-[#FDFBF7] dark:bg-[#04241B] shadow-[0_20px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] rounded-sm md:rounded-md p-10 md:p-16 border border-[#E5E0D8] dark:border-primary/20 relative overflow-hidden transition-colors duration-500"
    >
      {/* Page Texture Background */}
      <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />

      {/* Spine Shadow Effect */}
      <div className="absolute top-0 bottom-0 left-0 w-16 bg-linear-to-r from-black/5 dark:from-black/40 to-transparent pointer-events-none z-20" />

      {/* Classic Inner Page Borders */}
      <div className="absolute inset-5 md:inset-8 border-[3px] border-double border-gold/40 dark:border-gold/20 rounded-sm pointer-events-none z-20" />
      <div className="absolute inset-[26px] md:inset-[38px] border border-gold/20 dark:border-gold/10 rounded-sm pointer-events-none z-20" />

      {/* Floating Font Controls */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-1 bg-secondary/80 backdrop-blur-sm p-1 rounded-xl border border-gold/10">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-lg text-gold hover:bg-gold/10 text-[10px] font-bold"
          onClick={() => setFontSize(Math.max(16, fontSize - 2))}
        >
          A-
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-lg text-gold hover:bg-gold/10 text-[10px] font-bold"
          onClick={() => setFontSize(Math.min(48, fontSize + 2))}
        >
          A+
        </Button>
      </div>

      {/* Page Header (Surah Name & Bismillah) */}
      {ayahs.length > 0 && ayahs[0].numberInSurah === 1 && (
        <div className="text-center mb-10 relative z-20">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-12 bg-gold/20" />
            <div className="bg-primary text-primary-foreground px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-lg">
              Surah No. {ayahs[0].surah?.number}
            </div>
            <div className="h-px w-12 bg-gold/20" />
          </div>

          <h2 className="text-5xl font-black text-foreground mb-2 tracking-tight">
            {ayahs[0].surah?.englishName}
          </h2>
          <h3 className="font-quran text-3xl text-foreground/70 mb-6">
            {ayahs[0].surah?.name}
          </h3>

          <div className="flex items-center justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-10">
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-3 w-3" />
              <span>{ayahs[0].surah?.numberOfAyahs} Ayahs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-gold" />
              <span className="text-gold">{ayahs[0].surah?.revelationType}</span>
            </div>
          </div>

          {/* Bismillah */}
          {(ayahs[0].surah?.number !== 9) && (
            <div className="mb-12">
              <p className="font-quran text-3xl md:text-5xl text-foreground drop-shadow-sm">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
            </div>
          )}
        </div>
      )}

      {/* Main Text Area */}
      <div className="relative z-10 text-justify [text-align-last:right] leading-[2.4] md:leading-[2.8]" dir="rtl">
        {ayahs.map((ayah) => {
          const isActive = currentAyah?.number === ayah.number;
          const isFirstAyah = ayah.numberInSurah === 1;
          let cleanText = ayah.text;
          if (isFirstAyah) {
            // Bismillah is always 4 words: بسم الله الرحمن الرحيم
            if (ayah.text.charCodeAt(0) === 0x0628) {
              let spaceCount = 0;
              for (let i = 0; i < ayah.text.length && i < 120; i++) {
                if (ayah.text.charAt(i) === ' ') {
                  spaceCount++;
                  if (spaceCount === 4) {
                    const result = ayah.text.substring(i + 1).trim();
                    if (result.length > 0) cleanText = result;
                    break;
                  }
                }
              }
            }
          }

          // If this is Al-Fatiha Ayah 1 (Bismillah itself) and we stripped everything (shouldn't happen with above logic), don't render a ghost item
          if (ayah.surah?.number === 1 && ayah.numberInSurah === 1 && cleanText === "") return null;

          return (
            <span key={ayah.number} className="inline group">
              <span
                onClick={() => handleAyahClick(ayah)}
                className={cn(
                  "font-quran transition-all duration-300 cursor-pointer rounded-lg px-1.5 py-0.5 inline",
                  isActive ? "bg-gold/15 text-primary-green shadow-sm drop-shadow-[0_2px_4px_rgba(180,140,50,0.1)]" : "hover:bg-gold/5 hover:text-primary-green drop-shadow-sm"
                )}
                style={{ fontSize: `${fontSize}px` }}
              >
                {cleanText}

                {/* Ayah Marker */}
                <span className="inline-flex items-center justify-center mx-2 translate-y-1">
                  <span className="relative flex items-center justify-center h-7 w-7">
                    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-gold/30 fill-none stroke-current stroke-5 group-hover:text-gold/50 transition-colors">
                      <circle cx="50" cy="50" r="45" />
                    </svg>
                    <span className="relative font-inter text-[9px] font-black text-gold/80">{ayah.numberInSurah}</span>
                  </span>
                </span>
              </span>

              {/* Compact Inline Translation */}
              {(translationEnabled || urduEnabled) && isActive && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="block text-left font-poppins bg-gold/5 p-4 rounded-xl my-3 border-l-2 border-gold"
                  dir="ltr"
                >
                  {urduEnabled && (
                    <p className="text-lg text-dark-green mb-1 text-right font-medium" dir="rtl">
                      {ayah.urduTranslation}
                    </p>
                  )}
                  {translationEnabled && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {ayah.translation}
                    </p>
                  )}
                </motion.div>
              )}
            </span>
          );
        })}
      </div>
      {/* Footer Decoration */}
      <div className="mt-12 flex justify-center opacity-10">
        <div className="w-16 h-0.5 bg-gold rounded-full" />
      </div>
    </motion.div>
  );
};
