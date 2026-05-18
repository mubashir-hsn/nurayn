"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Ayah, SurahDetail } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { useSettingsStore } from "@/store/useSettingsStore";
import { cn } from "@/lib/utils";
import { useAudioStore } from "@/store/useAudioStore";
import { useReadingStore } from "@/store/useReadingStore";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Heart,
  Volume2,
  FileText,
  HelpCircle,
  Maximize2,
  Loader2
} from "lucide-react";
import { getOfflineAudio } from "@/lib/indexedDB";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface QuranPageViewProps {
  ayahs: Ayah[];
  surah?: SurahDetail;
}

export const QuranPageView = ({ ayahs, surah }: QuranPageViewProps) => {
  const router = useRouter();
  const { fontSize, setFontSize, translationEnabled, urduEnabled, hasHydrated } = useSettingsStore();
  const { currentAyah, setCurrentAyah, setIsPlaying, setAyahs: setAudioStoreAyahs } = useAudioStore();
  const { addRecentlyRead, setLastRead, updateProgress } = useReadingStore();
  const { addBookmark, removeBookmark, isBookmarked, addFavorite, removeFavorite, isFavorite } = useFavoritesStore();

  const [mounted, setMounted] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [progressRestored, setProgressRestored] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 1. DYNAMIC MUSHAF PAGE ALLOCATOR
  // Dynamically group ayahs into beautiful pages so they fit perfectly inside the printed frame
  const quranPages = useMemo(() => {
    if (!ayahs || ayahs.length === 0) return [];

    const pages: Ayah[][] = [];
    let currentPage: Ayah[] = [];
    let currentLength = 0;

    for (const ayah of ayahs) {
      const textLength = ayah.text.length;
      currentPage.push(ayah);
      currentLength += textLength;

      // Group verses if total character count reaches 1000,
      // ensuring at least 3 verses per page, and a maximum of 12 verses
      if ((currentLength >= 1100 && currentPage.length >= 3) || currentPage.length >= 12) {
        pages.push(currentPage);
        currentPage = [];
        currentLength = 0;
      }
    }

    if (currentPage.length > 0) {
      pages.push(currentPage);
    }

    return pages;
  }, [ayahs]);

  // Resolve dynamic surah based on current page ayahs
  const activePageAyahs = quranPages[currentPageIndex] || [];
  const dynamicSurah = useMemo(() => {
    return surah || (activePageAyahs[0]?.surah as SurahDetail);
  }, [surah, activePageAyahs]);

  // 2. AUTO-CONTINUE READING PROGRESS (Offline & Local)
  // Jump automatically to the user's last read position in this Surah
  useEffect(() => {
    if (!mounted || quranPages.length === 0 || !dynamicSurah || progressRestored) return;

    // Check if there is a saved lastReadVerse for this surah
    const savedLastRead = localStorage.getItem(`last_read_ayah_surah_${dynamicSurah.number}`);
    if (savedLastRead) {
      const lastReadAyahNum = parseInt(savedLastRead);
      // Find which page contains this ayah number
      const foundPageIndex = quranPages.findIndex(page =>
        page.some(ayah => ayah.numberInSurah === lastReadAyahNum)
      );
      if (foundPageIndex !== -1) {
        setCurrentPageIndex(foundPageIndex);
        toast.info("Auto-Restored Reading Progress", {
          description: `Continuing from Page ${foundPageIndex + 1}, Verse ${lastReadAyahNum}.`,
          duration: 3000
        });
      }
    }
    setProgressRestored(true);
  }, [mounted, quranPages, dynamicSurah, progressRestored]);

  if (!mounted || !hasHydrated) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-muted-foreground text-xs font-bold animate-pulse">Assembling Mushaf Pages...</p>
      </div>
    );
  }

  const totalPages = quranPages.length;

  // Page Turn Actions
  const handleNextPage = () => {
    if (currentPageIndex < totalPages - 1) {
      setCurrentPageIndex(prev => prev + 1);
      savePageProgress(currentPageIndex + 1);
    } else if (surah && surah.number < 114) {
      toast.info(`Transitioning to Next Surah: #${surah.number + 1}`, {
        description: "Moving seamlessly to the next chapter.",
        duration: 2500
      });
      setTimeout(() => {
        router.push(`/surah/${surah.number + 1}`);
      }, 1000);
    } else if (!surah) {
      const currentJuz = activePageAyahs[0]?.juz;
      if (currentJuz && currentJuz < 30) {
        toast.info(`Transitioning to Next Para: #${currentJuz + 1}`, {
          description: "Moving seamlessly to the next Juz/Para.",
          duration: 2500
        });
        setTimeout(() => {
          router.push(`/para/${currentJuz + 1}`);
        }, 1000);
      }
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(prev => prev - 1);
      savePageProgress(currentPageIndex - 1);
    } else if (surah && surah.number > 1) {
      toast.info(`Transitioning to Previous Surah: #${surah.number - 1}`, {
        description: "Moving seamlessly to the previous chapter.",
        duration: 2500
      });
      setTimeout(() => {
        router.push(`/surah/${surah.number - 1}`);
      }, 1000);
    } else if (!surah) {
      const currentJuz = activePageAyahs[0]?.juz;
      if (currentJuz && currentJuz > 1) {
        toast.info(`Transitioning to Previous Para: #${currentJuz - 1}`, {
          description: "Moving seamlessly to the previous Juz/Para.",
          duration: 2500
        });
        setTimeout(() => {
          router.push(`/para/${currentJuz - 1}`);
        }, 1000);
      }
    }
  };

  // Save Reading Progress helpers
  const savePageProgress = (pageIndex: number) => {
    const page = quranPages[pageIndex];
    if (page && page.length > 0) {
      const firstAyah = page[0];
      const activeSurah = surah || (firstAyah.surah as SurahDetail);
      if (activeSurah) {
        setLastRead(activeSurah, firstAyah);
        localStorage.setItem(`last_read_ayah_surah_${activeSurah.number}`, firstAyah.numberInSurah.toString());

        // Calculate progress percentage
        const progressPercent = Math.round(((pageIndex + 1) / totalPages) * 100);
        updateProgress(activeSurah.number, progressPercent);

        // Save global last read session (either Para or Surah)
        if (surah) {
          localStorage.setItem("global_last_read_type", "surah");
          localStorage.setItem("global_last_read_surah_num", surah.number.toString());
          localStorage.setItem("global_last_read_surah_name", surah.englishName);
          localStorage.setItem("global_last_read_surah_arabic", surah.name);
          localStorage.setItem("global_last_read_ayah_num", firstAyah.numberInSurah.toString());
          localStorage.setItem("global_last_read_juz", firstAyah.juz.toString());
        } else {
          localStorage.setItem("global_last_read_type", "para");
          localStorage.setItem("global_last_read_juz", firstAyah.juz.toString());
          localStorage.setItem("global_last_read_ayah_num", firstAyah.numberInSurah.toString());
          localStorage.setItem("global_last_read_surah_name", firstAyah.surah?.englishName || "Al-Faatiha");
          localStorage.setItem("global_last_read_surah_arabic", firstAyah.surah?.name || "الفاتحة");
        }
      }
    }
  };

  // Play Ayah Handler with Local Audio Blobs Injection
  const handleAyahClick = async (ayah: Ayah) => {
    const activeSurah = surah || (ayah.surah as SurahDetail);
    if (!activeSurah) return;

    // Save last read position on verse click
    setLastRead(activeSurah, ayah);
    localStorage.setItem(`last_read_ayah_surah_${activeSurah.number}`, ayah.numberInSurah.toString());

    // Save global last read session on click
    if (surah) {
      localStorage.setItem("global_last_read_type", "surah");
      localStorage.setItem("global_last_read_surah_num", surah.number.toString());
      localStorage.setItem("global_last_read_surah_name", surah.englishName);
      localStorage.setItem("global_last_read_surah_arabic", surah.name);
      localStorage.setItem("global_last_read_ayah_num", ayah.numberInSurah.toString());
      localStorage.setItem("global_last_read_juz", ayah.juz.toString());
    } else {
      localStorage.setItem("global_last_read_type", "para");
      localStorage.setItem("global_last_read_juz", ayah.juz.toString());
      localStorage.setItem("global_last_read_ayah_num", ayah.numberInSurah.toString());
      localStorage.setItem("global_last_read_surah_name", ayah.surah?.englishName || "Al-Faatiha");
      localStorage.setItem("global_last_read_surah_arabic", ayah.surah?.name || "الفاتحة");
    }

    // 1. Try to fetch offline audio blob URL from IndexedDB
    const offlineAudioUrl = await getOfflineAudio(activeSurah.number, ayah.numberInSurah);

    // 2. Wrap ayah and overwrite audio URL with local blob if offline
    const ayahToPlay = {
      ...ayah,
      audio: offlineAudioUrl || ayah.audio,
      surah: activeSurah
    };

    // Load active page's verses into the audio playlist for sequential playback
    const currentPlaylist = activePageAyahs.map(a => ({
      ...a,
      surah: activeSurah
    }));

    setAudioStoreAyahs(currentPlaylist);
    setCurrentAyah(ayahToPlay);
    setIsPlaying(true);

    if (offlineAudioUrl) {
      toast.success("Playing Recitation offline", {
        description: `Verse ${ayah.numberInSurah} loaded from offline device storage.`,
        duration: 2000
      });
    }
  };

  // Bookmark active page toggle
  const isPageBookmarked = activePageAyahs.length > 0 && isBookmarked(activePageAyahs[0].number);
  const handlePageBookmarkToggle = () => {
    if (activePageAyahs.length === 0 || !dynamicSurah) return;
    const representativeAyah = { ...activePageAyahs[0], surah: dynamicSurah };

    if (isPageBookmarked) {
      removeBookmark(representativeAyah.number);
      toast.success("Bookmark removed for this page");
    } else {
      addBookmark(representativeAyah);
      toast.success("Page bookmarked successfully!", {
        description: "Milestone saved in your Personal Library."
      });
    }
  };

  return (
    <div className="relative max-w-5xl mx-auto px-1 sm:px-4 md:px-12">


      {/* Outer Container containing page content & floating sidebar buttons */}
      <div className="flex items-center justify-between gap-2 md:gap-6">

        {/* Previous page trigger button (Left/Ltr, or Next page in Arabic book format) */}
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevPage}
          disabled={currentPageIndex === 0 && (surah ? surah.number === 1 : (activePageAyahs[0]?.juz === 1))}
          className={cn(
            "hidden md:flex h-14 w-14 shrink-0 rounded-full border-gold/20 shadow-md bg-card text-gold hover:bg-gold/10 transition-all",
            currentPageIndex === 0 && (surah ? surah.number === 1 : (activePageAyahs[0]?.juz === 1)) && "opacity-20 pointer-events-none"
          )}
        >
          <ChevronLeft className="h-6 w-6 stroke-[2.5]" />
        </Button>

        {/* Real Book Page Container */}
        <div className="flex-1 w-full min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPageIndex}
              initial={{ opacity: 0, rotateY: -15, scale: 0.98 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: 15, scale: 0.98 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="relative w-full min-h-[450px] sm:min-h-[600px] bg-[#FDFBF7] dark:bg-[#032219] shadow-none rounded-lg p-5 px-4 sm:p-8 md:p-14 border border-[#EBE6DD] dark:border-primary/20 overflow-hidden transition-colors duration-500"
            >

              {/* Paper Fibers Texture overlay */}
              <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />

              {/* Spine Shadow Crease Effect (realistic open book visual) */}
              <div className="absolute top-0 bottom-0 left-0 w-3 sm:w-8 bg-linear-to-r from-black/5 dark:from-black/45 to-transparent pointer-events-none z-20" />
              <div className="absolute top-0 bottom-0 right-0 w-3 sm:w-8 bg-linear-to-l from-black/5 dark:from-black/45 to-transparent pointer-events-none z-20" />

              {/* Double Classic Islamic Borders */}
              <div className="absolute inset-2 sm:inset-4 md:inset-6 border-[3px] border-double border-gold/30 dark:border-gold/25 rounded-xl pointer-events-none z-20" />
              <div className="absolute inset-3.5 sm:inset-[22px] md:inset-[32px] border border-gold/15 dark:border-gold/10 rounded-lg pointer-events-none z-20" />

              {/* Header: Controls, Bookmarks, and Info */}
              <div className="relative z-30 flex items-center justify-between mb-4 sm:mb-8 pb-3 border-b border-gold/10 gap-2">

                {/* Font control pill */}
                <div className="flex items-center gap-0.5 bg-secondary/80 dark:bg-black/20 backdrop-blur-sm p-0.5 sm:p-1 rounded-lg sm:rounded-xl border border-gold/10">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 sm:h-7 sm:w-7 rounded text-gold hover:bg-gold/10 text-[9px] sm:text-[10px] font-black"
                    onClick={() => setFontSize(Math.max(16, fontSize - 2))}
                  >
                    A-
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 sm:h-7 sm:w-7 rounded text-gold hover:bg-gold/10 text-[9px] sm:text-[10px] font-black"
                    onClick={() => setFontSize(Math.min(48, fontSize + 2))}
                  >
                    A+
                  </Button>
                </div>

                {/* Surah Name & Header Title */}
                <div className="text-center flex-1 min-w-0 px-1">
                  <span className="font-extrabold text-[8px] sm:text-[10px] uppercase tracking-widest text-gold drop-shadow-sm truncate block">
                    {dynamicSurah?.englishName || "Juz Reading"} ({dynamicSurah?.name || ""})
                  </span>
                </div>

                {/* Bookmark active page control */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePageBookmarkToggle}
                  className={cn(
                    "h-7 w-7 sm:h-8 sm:w-8 rounded-lg hover:bg-gold/10",
                    isPageBookmarked ? "text-gold" : "text-muted-foreground/50 hover:text-gold"
                  )}
                  title="Bookmark current page"
                >
                  <Bookmark className="h-4.5 w-4.5 sm:h-5 sm:w-5 fill-current" />
                </Button>
              </div>

              {/* MAIN CONTENT AREA: Arabic Verses */}
              <div className="relative z-10 text-justify [text-align-last:right] leading-[2.8] sm:leading-[3.2] md:leading-[3.5] mt-4 sm:mt-6" dir="rtl">
                {activePageAyahs.map((ayah) => {
                  const isActive = currentAyah?.number === ayah.number;
                  const isFirstAyah = ayah.numberInSurah === 1;
                  const ayahSurah = ayah.surah || dynamicSurah;

                  // Diacritic Bismillah strip logic for first verse
                  let cleanText = ayah.text;
                  if (isFirstAyah && ayahSurah?.number !== 1 && ayahSurah?.number !== 9) {
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

                  // Skip ghost items
                  if (ayahSurah?.number === 1 && ayah.numberInSurah === 1 && cleanText === "") return null;

                  return (
                    <React.Fragment key={ayah.number}>
                      {isFirstAyah && ayahSurah && (
                        <div className="block w-full text-center my-6 sm:my-10 font-poppins select-none" dir="ltr">
                          {/* Premium Golden Islamic Border Surah Heading box */}
                          <div className="relative py-3 sm:py-5 px-4 sm:px-8 rounded-2xl sm:rounded-3xl bg-emerald-950/5 dark:bg-emerald-950/30 border border-gold/30 max-w-xl mx-auto overflow-hidden shadow-md">
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]" />
                            <div className="flex justify-between items-center gap-3 sm:gap-6 w-full">
                              <span className="font-arabic text-xl sm:text-2xl md:text-3xl text-primary-green drop-shadow-sm font-semibold">{ayahSurah.name}</span>
                              <div className="hidden sm:flex flex-col text-center">
                                <span className="font-black text-[10px] sm:text-xs md:text-sm text-gold uppercase tracking-[0.15em]">Surah {ayahSurah.englishName}</span>
                                <span className="text-[8px] sm:text-[10px] text-muted-foreground font-extrabold uppercase mt-1 tracking-wider">
                                  {ayahSurah.revelationType} • {ayahSurah.numberOfAyahs} Verses
                                </span>
                              </div>
                              <span className="font-black text-[10px] sm:text-xs text-primary bg-primary/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-primary/20 shadow-inner">#{ayahSurah.number}</span>
                            </div>
                          </div>

                          {/* Bismillah banner (skipped for Surah At-Tawbah #9) */}
                          {ayahSurah.number !== 9 && (
                            <div className="mt-4 sm:mt-6 text-center">
                              <p className="font-noto-naskh text-xl sm:text-3xl md:text-4xl text-foreground drop-shadow-xs py-1 sm:py-2 leading-relaxed">
                                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                              </p>
                              <div className="w-12 sm:w-16 h-px bg-gold/25 mx-auto mt-2" />
                            </div>
                          )}
                        </div>
                      )}

                      <span className="inline group">
                        <span
                          onClick={() => handleAyahClick(ayah)}
                          className={cn(
                            "font-noto-naskh transition-all duration-300 cursor-pointer rounded-lg px-1.5 py-0.5 inline leading-loose select-none",
                            isActive
                              ? "bg-gold/15 text-primary shadow-sm drop-shadow-[0_2px_4px_rgba(180,140,50,0.1)] border-b-2 border-gold"
                              : "hover:bg-gold/5 hover:text-primary drop-shadow-sm"
                          )}
                          style={{
                            fontSize: isMobile ? `${Math.max(15, fontSize - 4)}px` : `${fontSize}px`
                          }}
                        >
                          {cleanText}

                          {/* Ayah End Ornament */}
                          <span className="inline-flex items-center justify-center mx-1 md:mx-2 translate-y-0.5 md:translate-y-1">
                            <span className="relative flex items-center justify-center h-6 w-6 md:h-8 md:w-8">
                              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-gold/30 fill-none stroke-current stroke-6 group-hover:text-gold/50 transition-colors">
                                <circle cx="50" cy="50" r="42" />
                              </svg>
                              <span className="relative font-inter text-[8px] md:text-[9px] font-black text-gold/80">{ayah.numberInSurah}</span>
                            </span>
                          </span>
                        </span>

                        {/* Compact Inline translation container */}
                        {(translationEnabled || urduEnabled) && isActive && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="block text-left font-poppins bg-gold/5 dark:bg-black/15 p-3 sm:p-5 rounded-xl sm:rounded-2xl my-3 sm:my-4 border-l-3 border-gold"
                            dir="ltr"
                          >
                            {urduEnabled && (
                              <p className="text-base sm:text-lg text-emerald-800 dark:text-emerald-400 mb-2 text-right font-medium leading-relaxed font-noto-naskh" dir="rtl">
                                {ayah.urduTranslation}
                              </p>
                            )}
                            {translationEnabled && (
                              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
                                {ayah.translation}
                              </p>
                            )}
                          </motion.div>
                        )}
                      </span>
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Bottom Footer: Page indicator and pagination summary */}
              <div className="relative z-30 mt-8 sm:mt-16 pt-4 border-t border-gold/10 flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between items-center text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                <span className="order-2 sm:order-1">Verses {activePageAyahs[0]?.numberInSurah} - {activePageAyahs[activePageAyahs.length - 1]?.numberInSurah}</span>
                <span className="order-1 sm:order-2 bg-gold/10 text-gold px-3 sm:px-4 py-1 rounded-full border border-gold/20 shadow-sm">
                  Page {currentPageIndex + 1} of {totalPages}
                </span>
                <span className="order-3">Juz {activePageAyahs[0]?.juz}</span>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Next page trigger button (Right/Rtl, or Prev page in Arabic book format) */}
        <Button
          variant="outline"
          size="icon"
          onClick={handleNextPage}
          disabled={currentPageIndex === totalPages - 1 && (surah ? surah.number === 114 : (activePageAyahs[0]?.juz === 30))}
          className={cn(
            "hidden md:flex h-14 w-14 shrink-0 rounded-full border-gold/20 shadow-md bg-card text-gold hover:bg-gold/10 transition-all",
            currentPageIndex === totalPages - 1 && (surah ? surah.number === 114 : (activePageAyahs[0]?.juz === 30)) && "opacity-20 pointer-events-none"
          )}
        >
          <ChevronRight className="h-6 w-6 stroke-[2.5]" />
        </Button>
      </div>

      {/* Mobile Page Navigation Controls (displayed at bottom of screen for responsive scaling) */}
      <div className="mt-8 flex justify-between items-center md:hidden bg-card p-2 sm:p-3 rounded-xl sm:rounded-2xl border shadow-md">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevPage}
          disabled={currentPageIndex === 0 && (surah ? surah.number === 1 : (activePageAyahs[0]?.juz === 1))}
          className="rounded-xl h-9 sm:h-10 px-3 sm:px-4 text-xs font-bold text-gold"
        >
          <ChevronLeft className="h-4 w-4 mr-1 stroke-[2.5]" /> Prev
        </Button>
        <span className="text-[10px] font-black text-muted-foreground">
          Page {currentPageIndex + 1} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextPage}
          disabled={currentPageIndex === totalPages - 1 && (surah ? surah.number === 114 : (activePageAyahs[0]?.juz === 30))}
          className="rounded-xl h-9 sm:h-10 px-3 sm:px-4 text-xs font-bold text-gold"
        >
          Next <ChevronRight className="h-4 w-4 ml-1 stroke-[2.5]" />
        </Button>
      </div>
    </div>
  );
};

const LoaderIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);
