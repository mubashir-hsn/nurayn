"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { quranService } from "@/services/quranService";
import { Surah } from "@/types";
import { SurahCard } from "@/components/quran/SurahCard";
import { Input } from "@/components/ui/input";
import { Search, Book } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination";

import { getOfflineMetadata } from "@/lib/indexedDB";

export default function SurahPage() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [downloadedIds, setDownloadedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // 3 rows * 4 columns max

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        // 1. Fetch Surah index list
        const data = await quranService.getSurahs();
        setSurahs(data);

        // 2. Fetch downloaded IDs for badges
        const offlineMeta = await getOfflineMetadata();
        setDownloadedIds(offlineMeta.map(d => d.number));
      } catch (error) {
        console.error("Error fetching surahs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSurahs();
  }, []);

  const filteredSurahs = surahs.filter(s =>
    s.englishName.toLowerCase().includes(search.toLowerCase()) ||
    s.name.includes(search)
  );

  const totalPages = Math.ceil(filteredSurahs.length / itemsPerPage);
  const currentSurahs = filteredSurahs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <main className="min-h-screen pb-20 bg-secondary/10">
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
              <Book className="h-4 w-4" /> Noble Quran
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
              114 <span className="text-gold">Surahs</span>
            </h1>
            <p className="text-xl text-white/80 mb-10 leading-relaxed">
              Explore the complete collection of chapters in the Holy Quran, available with multi-language translations and audio recitation.
            </p>
            
            <div className="max-w-xl mx-auto relative shadow-xl shadow-black/10 rounded-2xl">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-gold z-10" />
              <Input
                placeholder="Search Surah by name..."
                className="pl-14 h-16 rounded-2xl bg-white/10 border border-white/20 text-white text-lg placeholder:text-white/50 focus-visible:ring-gold transition-all backdrop-blur-md relative z-0"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1); // Reset page on search
                }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container px-4 mx-auto py-12">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {loading ? (
            Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full rounded-2xl" />
            ))
          ) : (
            <AnimatePresence mode="popLayout">
              {currentSurahs.map((surah) => (
                <motion.div
                  key={surah.number}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  layout
                >
                  <SurahCard 
                    surah={surah} 
                    isDownloaded={downloadedIds.includes(surah.number)} 
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {!loading && filteredSurahs.length > itemsPerPage && (
          <div className="mt-20">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className={cn(
                      "cursor-pointer text-gold border-gold/20 hover:bg-gold/10",
                      currentPage === 1 && "opacity-50 pointer-events-none"
                    )}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  if (
                    pageNum === 1 || 
                    pageNum === totalPages || 
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink 
                          onClick={() => setCurrentPage(pageNum)}
                          isActive={currentPage === pageNum}
                          className={cn(
                            "cursor-pointer transition-all",
                            currentPage === pageNum ? "bg-gold text-white" : "text-gold border-gold/20 hover:bg-gold/10"
                          )}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  
                  if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationEllipsis className="text-gold/50" />
                      </PaginationItem>
                    );
                  }

                  return null;
                })}

                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className={cn(
                      "cursor-pointer text-gold border-gold/20 hover:bg-gold/10",
                      currentPage === totalPages && "opacity-50 pointer-events-none"
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {!loading && filteredSurahs.length === 0 && (
          <div className="text-center py-20 text-muted-foreground bg-card rounded-3xl border border-border/50">
            <h3 className="text-2xl font-bold mb-2">No surahs found</h3>
            <p>Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </main>
  );
}
