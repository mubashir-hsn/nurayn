"use client";

import React from "react";
import { motion } from "framer-motion";
import { Play, Pause, Heart, Bookmark, Copy, Share2, MoreHorizontal, Edit3 } from "lucide-react";
import { Ayah } from "@/types";
import { Button } from "@/components/ui/button";
import { useAudioStore } from "@/store/useAudioStore";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface AyahCardProps {
  ayah: Ayah;
  surahName?: string;
  showInfo?: boolean;
}

export const AyahCard = ({ ayah, surahName, showInfo = false }: AyahCardProps) => {
  const { currentAyah, isPlaying, setIsPlaying, setCurrentAyah } = useAudioStore();
  const { isFavorite, addFavorite, removeFavorite, isBookmarked, addBookmark, removeBookmark } = useFavoritesStore();
  const { fontSize, translationEnabled, urduEnabled, hasHydrated } = useSettingsStore();
  const [mounted, setMounted] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!mounted || !hasHydrated) {
    return <Skeleton className="h-60 w-full rounded-2xl" />;
  }

  const isActive = currentAyah?.number === ayah.number;
  const isPlayingCurrent = isActive && isPlaying;

  const toggleAudio = () => {
    if (isActive) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentAyah(ayah);
      setIsPlaying(true);
    }
  };

  const copyAyah = () => {
    const text = `${ayah.text}\n\n${ayah.translation}\n\n[Surah ${surahName || ayah.surah?.englishName}, Ayah ${ayah.numberInSurah}]`;
    navigator.clipboard.writeText(text);
    toast.success("Ayah copied to clipboard");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className={cn(
        "premium-card group transition-all duration-500 w-full max-w-full rounded-xl sm:rounded-2xl shadow-none sm:shadow-sm border border-border/50",
        isActive ? "border-gold ring-0 sm:ring-2 ring-gold/20 shadow-none sm:shadow-2xl" : "hover:border-gold/30",
        "p-4 px-3 sm:p-8 md:p-10"
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-10 w-full">
        <div className="flex items-center gap-3 sm:gap-5">
          <div className="relative flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center shrink-0">
            <div className="absolute inset-0 bg-gold/10 rounded-2xl rotate-45 group-hover:bg-gold group-hover:rotate-90 transition-all duration-500" />
            <span className="relative font-black text-lg sm:text-xl text-primary-green group-hover:text-primary-foreground transition-colors">
              {ayah.numberInSurah}
            </span>
          </div>
          {showInfo && (
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-black text-gold uppercase tracking-widest mb-0.5 truncate">
                {surahName || ayah.surah?.englishName}
              </p>
              <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase">
                Verse {ayah.numberInSurah}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 sm:gap-2 bg-secondary/50 p-1 sm:p-1.5 rounded-2xl backdrop-blur-sm border border-border/50 justify-between sm:justify-start w-full sm:w-auto">
          <Button variant="ghost" size="icon" onClick={toggleAudio} className={cn("h-9 w-9 sm:h-10 sm:w-10 rounded-xl transition-all", isActive ? "text-gold bg-gold/10" : "hover:text-gold hover:bg-gold/10")}>
            {isPlayingCurrent ? <Pause className="h-4 w-4 sm:h-5 sm:w-5" /> : <Play className="h-4 w-4 sm:h-5 sm:w-5" />}
          </Button>
          <div className="w-px h-5 sm:h-6 bg-border/50 mx-0.5 sm:mx-1" />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => isFavorite(ayah.number) ? removeFavorite(ayah.number) : addFavorite(ayah)}
            className={cn("h-9 w-9 sm:h-10 sm:w-10 rounded-xl transition-all", isFavorite(ayah.number) ? "text-red-500 bg-red-50" : "hover:text-red-500 hover:bg-red-50")}
          >
            <Heart className={cn("h-4 w-4 sm:h-5 sm:w-5", isFavorite(ayah.number) && "fill-current")} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => isBookmarked(ayah.number) ? removeBookmark(ayah.number) : addBookmark(ayah)}
            className={cn("h-9 w-9 sm:h-10 sm:w-10 rounded-xl transition-all", isBookmarked(ayah.number) ? "text-gold bg-gold/5" : "hover:text-gold hover:bg-gold/5")}
          >
            <Bookmark className={cn("h-4 w-4 sm:h-5 sm:w-5", isBookmarked(ayah.number) && "fill-current")} />
          </Button>
          <Button variant="ghost" size="icon" onClick={copyAyah} className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl hover:text-primary-green hover:bg-primary-green/5">
            <Copy className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>

      <div className="space-y-6 sm:space-y-10">
        <p
          className="font-quran text-foreground leading-loose md:leading-[2.5] text-right antialiased drop-shadow-sm group-hover:text-gold transition-colors duration-500"
          style={{
            fontSize: isMobile ? `${Math.max(16, fontSize - 4)}px` : `${fontSize}px`
          }}
          dir="rtl"
        >
          {(() => {
            const isFirstAyah = ayah.numberInSurah === 1;

            if (isFirstAyah) {
              // Bismillah is always 4 words: بسم الله الرحمن الرحيم
              // Check if text starts with Ba (ب = \u0628)
              if (ayah.text.charCodeAt(0) === 0x0628) {
                let spaceCount = 0;
                for (let i = 0; i < ayah.text.length && i < 120; i++) {
                  if (ayah.text.charAt(i) === ' ') {
                    spaceCount++;
                    if (spaceCount === 4) {
                      const result = ayah.text.substring(i + 1).trim();
                      if (result.length > 0) return result;
                      break;
                    }
                  }
                }
              }
            }
            return ayah.text;
          })()}
        </p>

        <div className="space-y-4 sm:space-y-6 pt-6 sm:pt-10 border-t border-border/50 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-1 bg-background text-[9px] sm:text-[10px] font-black text-gold uppercase tracking-[0.2em] border border-border/50 rounded-full whitespace-nowrap">
            Translations
          </div>
          {urduEnabled && (
            <p className="font-poppins text-lg sm:text-2xl text-dark-green/90 font-medium leading-relaxed text-right" dir="rtl">
              {ayah.urduTranslation}
            </p>
          )}
          {translationEnabled && (
            <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed font-medium text-left" dir="ltr">
              {ayah.translation}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
