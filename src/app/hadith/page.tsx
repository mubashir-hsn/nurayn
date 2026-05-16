"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { hadithService } from "@/services/hadithService";
import { Hadith } from "@/types";
import { HadithCard } from "@/components/hadith/HadithCard";
import { MessageSquare, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

export default function HadithPage() {
  const [hadiths, setHadiths] = useState<Hadith[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchHadiths = async () => {
      try {
        const data = await hadithService.getHadiths('eng-sahihbukhari');
        const araData = await hadithService.getHadiths('ara-bukhari');

        const combined = data.slice(0, 100).map((h: any, i: number) => ({
          id: h.hadithnumber,
          hadithArabic: araData[i]?.text || '',
          hadithEnglish: h.text,
          hadithUrdu: '',
          bookName: 'Sahih Bukhari',
          chapterName: '',
          header: `Hadith ${h.hadithnumber}`,
        }));

        setHadiths(combined);
      } catch (error) {
        console.error("Error fetching hadiths", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHadiths();
  }, []);

  const filteredHadiths = hadiths.filter(h =>
    h.hadithEnglish.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredHadiths.length / itemsPerPage);
  const currentHadiths = filteredHadiths.slice(
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
              <MessageSquare className="h-4 w-4" /> Prophetic Traditions
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-white">
              Authentic <span className="text-gold">Hadiths</span>
            </h1>
            <p className="text-xl text-white/80 mb-10 leading-relaxed">
              Explore prophetic traditions from Sahih Bukhari with multi-language translations and beautiful typography.
            </p>
            
            <div className="max-w-xl mx-auto relative shadow-xl shadow-black/10 rounded-2xl">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-gold z-10" />
              <Input 
                placeholder="Search Hadith by keyword..." 
                className="pl-14 h-16 rounded-2xl bg-white/10 border border-white/20 text-white text-lg placeholder:text-white/50 focus-visible:ring-gold transition-all backdrop-blur-md relative z-0"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container px-4 mx-auto py-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="h-12 w-12 text-gold animate-spin" />
            <p className="text-xl font-bold text-muted-foreground">Loading authentic traditions...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {currentHadiths.map((hadith) => (
                <HadithCard key={hadith.id} hadith={hadith} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filteredHadiths.length > itemsPerPage && (
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
                  // Only show current page, 2 before and 2 after
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

                  // Show ellipsis
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

        {!loading && filteredHadiths.length === 0 && (
          <div className="text-center py-20 bg-secondary/30 rounded-[3rem]">
            <h3 className="text-2xl font-bold mb-2">No hadiths found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </main>
  );
}
