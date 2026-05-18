"use client";

import React, { useEffect, useState, use } from "react";
import { quranService } from "@/services/quranService";
import { Ayah } from "@/types";
import { Navbar } from "@/components/layout/Navbar";
import { AyahCard } from "@/components/quran/AyahCard";
import { QuranPageView } from "@/components/quran/QuranPageView";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, Book, LayoutGrid, Type, Sparkles } from "lucide-react";
import { useAudioStore } from "@/store/useAudioStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { motion } from "framer-motion";
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

export default function ParaDetails({ params }: { params: Promise<{ number: string }> }) {
  const { number } = use(params);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { setAyahs: setStoreAyahs } = useAudioStore();
  const { readingMode, setReadingMode } = useSettingsStore();

  useEffect(() => {
    const fetchPara = async () => {
      try {
        const data = await quranService.getJuz(parseInt(number));
        setAyahs(data);
        setStoreAyahs(data);
      } catch (error) {
        console.error("Error fetching para", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPara();
  }, [number]);

  const totalPages = Math.ceil(ayahs.length / ITEMS_PER_PAGE);
  const currentAyahs = ayahs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen pb-32 bg-secondary/10">
      <Navbar />
      
      {/* Premium Para Header */}
      <section className="pt-40 pb-16 relative overflow-hidden bg-primary dark:bg-emerald-950">
        <div className="absolute inset-0 premium-gradient-green opacity-90 pointer-events-none" />
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]" />

        <div className="container px-4 mx-auto relative z-10 text-center text-white">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="hidden md:block h-px w-20 bg-white/20" />
              <div className="bg-white/10 text-gold px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm backdrop-blur-md border border-white/20">
                Para {number}
              </div>
              <div className="hidden md:block h-px w-20 bg-white/20" />
            </div>

            <h1 className="text-6xl md:text-8xl font-black mb-2 tracking-tight">
              Juz <span className="text-gold">{number}</span>
            </h1>
            <p className="text-white/80 font-bold uppercase tracking-[0.3em] text-xs mb-10">
              The Noble Quran • Part {number}
            </p>

            <div className="flex items-center justify-center gap-8 text-xs font-black uppercase tracking-widest text-white/60 mb-12">
              <div className="flex items-center gap-2">
                <Book className="h-4 w-4 text-gold/80" />
                <span>{ayahs.length} Ayahs</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-gold" />
                <span className="text-gold">Complete Para</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center gap-2 bg-white/10 p-2 rounded-full shadow-sm border border-white/20 backdrop-blur-md">
                <Button 
                  variant={readingMode === 'card' ? 'default' : 'ghost'} 
                  size="sm" 
                  onClick={() => setReadingMode('card')}
                  className={cn(
                    "rounded-full gap-2 h-10 px-6 font-bold transition-all", 
                    readingMode === 'card' 
                      ? "bg-white text-primary shadow-lg" 
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <LayoutGrid className="h-4 w-4" /> Card View
                </Button>
                <Button 
                  variant={readingMode === 'page' ? 'default' : 'ghost'} 
                  size="sm" 
                  onClick={() => setReadingMode('page')}
                  className={cn(
                    "rounded-full gap-2 h-10 px-6 font-bold transition-all", 
                    readingMode === 'page' 
                      ? "bg-white text-primary shadow-lg" 
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Type className="h-4 w-4" /> Page View
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container px-4 mx-auto py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-60 w-full rounded-3xl" />
            ))
          ) : (
            <>
              {readingMode === 'card' && (
                <div className="flex items-center justify-between mb-8 bg-card shadow-sm p-5 rounded-3xl border border-border/50">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center">
                      <Book className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Current Progress</p>
                      <p className="font-bold text-sm">Ayahs {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, ayahs.length)}</p>
                    </div>
                  </div>
                  <div className="bg-primary/5 text-primary px-4 py-2 rounded-xl border border-primary/10">
                     <span className="text-xs font-black uppercase tracking-widest">Page {currentPage} of {totalPages}</span>
                  </div>
                </div>
              )}

              <div className="space-y-8">
                {readingMode === 'card' ? (
                  <>
                    {currentAyahs.map((ayah) => (
                      <AyahCard key={ayah.number} ayah={ayah} showInfo />
                    ))}
                    
                    {/* Card View Pagination */}
                    {totalPages > 1 && (
                      <div className="mt-16 py-12 border-t flex justify-center">
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious 
                                href="#" 
                                onClick={(e) => { e.preventDefault(); if(currentPage > 1) handlePageChange(currentPage - 1)}}
                                className={cn("cursor-pointer h-12 rounded-xl px-4", currentPage === 1 && "pointer-events-none opacity-50")}
                              />
                            </PaginationItem>
                            
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                              if (
                                page === 1 || 
                                page === totalPages || 
                                (page >= currentPage - 1 && page <= currentPage + 1)
                              ) {
                                return (
                                  <PaginationItem key={page}>
                                    <PaginationLink 
                                      href="#" 
                                      onClick={(e) => { e.preventDefault(); handlePageChange(page)}}
                                      isActive={currentPage === page}
                                      className={cn(
                                        "cursor-pointer h-12 w-12 rounded-xl transition-all font-bold",
                                        currentPage === page ? "bg-primary text-white shadow-lg shadow-emerald-900/20 border-primary" : "hover:bg-emerald-50 hover:text-primary"
                                      )}
                                    >
                                      {page}
                                    </PaginationLink>
                                  </PaginationItem>
                                );
                              }
                              
                              if (page === currentPage - 2 || page === currentPage + 2) {
                                return (
                                  <PaginationItem key={page}>
                                    <PaginationEllipsis />
                                  </PaginationItem>
                                );
                              }
                              
                              return null;
                            })}

                            <PaginationItem>
                              <PaginationNext 
                                href="#" 
                                onClick={(e) => { e.preventDefault(); if(currentPage < totalPages) handlePageChange(currentPage + 1)}}
                                className={cn("cursor-pointer h-12 rounded-xl px-4", currentPage === totalPages && "pointer-events-none opacity-50")}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
                  </>
                ) : (
                  <QuranPageView ayahs={ayahs} />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
