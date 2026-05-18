"use client";

import React, { useEffect, useState, use } from "react";
import { quranService } from "@/services/quranService";
import { SurahDetail, Ayah } from "@/types";
import { Navbar } from "@/components/layout/Navbar";
import { AyahCard } from "@/components/quran/AyahCard";
import { QuranPageView } from "@/components/quran/QuranPageView";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, Book, Info, LayoutGrid, Type, BookOpen, Sparkles } from "lucide-react";
import { useAudioStore } from "@/store/useAudioStore";
import { useReadingStore } from "@/store/useReadingStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 20;

export default function SurahDetails({ params }: { params: Promise<{ number: string }> }) {
  const { number } = use(params);
  const [surah, setSurah] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const { setAyahs, setCurrentAyah, setIsPlaying, setCurrentSurah } = useAudioStore();
  const { addRecentlyRead, setLastRead } = useReadingStore();
  const { readingMode, setReadingMode } = useSettingsStore();

  useEffect(() => {
    const fetchSurah = async () => {
      try {
        const data = await quranService.getSurahDetail(parseInt(number));
        setSurah(data);
        addRecentlyRead(data);
        const ayahsWithSurah = data.ayahs.map(a => ({ ...a, surah: data }));
        setAyahs(ayahsWithSurah);
      } catch (error) {
        console.error("Error fetching surah", error);
        setError("Failed to load Surah details.");
      } finally {
        setLoading(false);
      }
    };
    fetchSurah();
  }, [number]);

  const totalPages = surah ? Math.ceil(surah.ayahs.length / ITEMS_PER_PAGE) : 0;
  const currentAyahs = surah ? surah.ayahs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE) : [];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const playSurah = () => {
    if (surah) {
      const ayahsWithSurah = surah.ayahs.map(a => ({ ...a, surah }));
      setCurrentSurah(surah);
      setCurrentAyah(ayahsWithSurah[0]);
      setIsPlaying(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container px-4 mx-auto py-12">
          <Skeleton className="h-64 w-full mb-8 rounded-3xl" />
          <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-60 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !surah) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="text-center py-40">
          <h2 className="text-2xl font-bold text-red-500">{error || "Surah not found"}</h2>
          <Button onClick={() => window.location.reload()} className="mt-4">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-32 bg-secondary/10">
      <Navbar />
      
      {/* Premium Surah Header */}
      <section className="pt-40 pb-16 relative overflow-hidden bg-primary dark:bg-emerald-950">
        <div className="absolute inset-0 premium-gradient-green opacity-90 pointer-events-none" />
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]" />

        <div className="container px-4 mx-auto relative z-10 text-center text-white">
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="hidden md:block h-px w-20 bg-white/20" />
            <div className="bg-white/10 text-gold px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm backdrop-blur-md border border-white/20">
              Surah No. {surah.number}
            </div>
            <div className="hidden md:block h-px w-20 bg-white/20" />
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-gold mb-2 tracking-tight">
            {surah.englishName}
          </h1>
          <h2 className="font-quran text-4xl md:text-5xl text-white/80 mb-8">
            {surah.name}
          </h2>

          <div className="flex items-center justify-center gap-8 text-xs font-black uppercase tracking-widest text-white/80">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-gold" />
              <span>{surah.numberOfAyahs} Ayahs</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-gold" />
              <span className="text-gold">{surah.revelationType}</span>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
             <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-2 rounded-2xl shadow-sm border border-white/20">
                <Button 
                  variant={readingMode === 'card' ? 'default' : 'ghost'} 
                  size="sm" 
                  onClick={() => setReadingMode('card')}
                  className={cn(
                    "rounded-xl gap-2 h-10 px-6 font-bold transition-all", 
                    readingMode === 'card' 
                      ? "bg-white text-primary shadow-lg" 
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <LayoutGrid className="h-4 w-4" /> Card View
                </Button>
                <Button 
                  variant={readingMode === 'page' ? 'default' : 'ghost'} 
                  size="sm" 
                  onClick={() => setReadingMode('page')}
                  className={cn(
                    "rounded-xl gap-2 h-10 px-6 font-bold transition-all", 
                    readingMode === 'page' 
                      ? "bg-white text-primary shadow-lg" 
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Type className="h-4 w-4" /> Page View
                </Button>
              </div>
              <Button onClick={playSurah} className="h-14 px-8 rounded-2xl bg-gold hover:bg-gold-dark text-black font-black gap-3 shadow-xl hover:scale-105 transition-all">
                <Play className="h-5 w-5 fill-current" /> Play Recitation
              </Button>
          </div>
        </div>
      </section>

      <div className="container px-3 sm:px-4 mx-auto py-6 sm:py-12">
        <Tabs defaultValue="reading" className="w-full">
          <div className="flex justify-center mb-8 sm:mb-12">
            <TabsList className="bg-card shadow-lg shadow-emerald-900/5 p-2 h-16 rounded-[1.5rem] border border-border/50 backdrop-blur-md">
              <TabsTrigger 
                value="reading" 
                className="rounded-xl px-6 sm:px-12 h-full data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-900/20 transition-all duration-300 font-black text-[10px] sm:text-xs uppercase tracking-widest gap-2"
              >
                <Book className="h-4 w-4 sm:mr-2" /> Reading
              </TabsTrigger>
              <TabsTrigger 
                value="info" 
                className="rounded-xl px-6 sm:px-12 h-full data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-900/20 transition-all duration-300 font-black text-[10px] sm:text-xs uppercase tracking-widest gap-2"
              >
                <Info className="h-4 w-4 sm:mr-2" /> Details
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="reading" className="space-y-6 sm:space-y-12 focus-visible:outline-none">
            {readingMode === 'card' ? (
              <>
                <div className="grid grid-cols-1 gap-3 sm:gap-8">
                  {currentAyahs.map((ayah) => (
                    <AyahCard key={ayah.number} ayah={ayah} surahName={surah.englishName} />
                  ))}
                </div>

                {/* Pagination (Only for Card View) */}
                {totalPages > 1 && (
                  <div className="mt-16 py-8 border-t flex justify-center w-full overflow-hidden">
                    <Pagination>
                      <PaginationContent className="flex-wrap justify-center gap-1">
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            className={cn("cursor-pointer", currentPage === 1 && "pointer-events-none opacity-50")}
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                          if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                            return (
                              <PaginationItem key={page} className={cn(currentPage !== page && "hidden sm:inline-block")}>
                                <PaginationLink 
                                  onClick={() => handlePageChange(page)}
                                  isActive={currentPage === page}
                                  className="cursor-pointer"
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          }
                          if (page === currentPage - 2 || page === currentPage + 2) {
                            return (
                              <PaginationItem key={page} className="hidden sm:inline-block">
                                <PaginationEllipsis />
                              </PaginationItem>
                            );
                          }
                          return null;
                        })}

                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                            className={cn("cursor-pointer", currentPage === totalPages && "pointer-events-none opacity-50")}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            ) : (
              <QuranPageView ayahs={surah.ayahs} surah={surah} />
            )}
          </TabsContent>

          <TabsContent value="info" className="focus-visible:outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="premium-card p-8 bg-card border-none">
                <h3 className="font-bold text-2xl mb-6 text-primary-green">Revelation Details</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground font-medium">Place of Revelation</span>
                    <span className="font-bold text-gold uppercase tracking-widest">{surah.revelationType}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground font-medium">Number of Verses</span>
                    <span className="font-bold text-gold">{surah.numberOfAyahs}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-muted-foreground font-medium">Surah Number</span>
                    <span className="font-bold text-gold">#{surah.number}</span>
                  </div>
                </div>
              </Card>
              
              <Card className="premium-card p-8 bg-card border-none">
                <h3 className="font-bold text-2xl mb-6 text-primary-green">Summary</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Surah {surah.englishName} ({surah.name}) is the {surah.number}th surah of the Quran. 
                  It was revealed in {surah.revelationType === 'Meccan' ? 'Mecca' : 'Medina'} and contains {surah.numberOfAyahs} ayahs.
                </p>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
