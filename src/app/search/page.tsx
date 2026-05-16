"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, X, Book, MessageSquare, Loader2 } from "lucide-react";
import { quranService } from "@/services/quranService";
import { Ayah, Surah } from "@/types";
import { AyahCard } from "@/components/quran/AyahCard";
import { SurahCard } from "@/components/quran/SurahCard";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AudioPlayer } from "@/components/audio/AudioPlayer";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [ayahResults, setAyahResults] = useState<Ayah[]>([]);
  const [surahResults, setSurahResults] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(false);
  const [allSurahs, setAllSurahs] = useState<Surah[]>([]);

  useEffect(() => {
    quranService.getSurahs().then(setAllSurahs);
  }, []);

  useEffect(() => {
    if (!query || query.length < 2) {
      setAyahResults([]);
      setSurahResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        // Search Surahs locally
        const filteredSurahs = allSurahs.filter(s => 
          s.englishName.toLowerCase().includes(query.toLowerCase()) ||
          s.name.includes(query)
        );
        setSurahResults(filteredSurahs);

        // Search Ayahs via API
        const matches = await quranService.search(query);
        setAyahResults(matches);
      } catch (error) {
        console.error("Search error", error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, allSurahs]);

  return (
    <main className="min-h-screen pb-32">
      <Navbar />
      
      <section className="bg-secondary/30 py-12">
        <div className="container px-4 mx-auto">
          <div className="max-w-2xl mx-auto relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
            <Input 
              placeholder="Search by Surah name, Ayah text, or meaning..."
              className="pl-14 h-16 rounded-2xl border-2 text-lg focus-visible:ring-primary-green shadow-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            {query && (
              <button 
                onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-secondary"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="container px-4 mx-auto py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-10 w-10 text-primary-green animate-spin" />
            <p className="text-muted-foreground">Searching across the Noble Quran...</p>
          </div>
        ) : query ? (
          <Tabs defaultValue="surahs" className="w-full">
            <div className="flex justify-center mb-10">
              <TabsList className="bg-secondary/50 p-1 rounded-xl">
                <TabsTrigger value="surahs" className="px-8 rounded-lg font-bold">
                  Surahs ({surahResults.length})
                </TabsTrigger>
                <TabsTrigger value="ayahs" className="px-8 rounded-lg font-bold">
                  Ayahs ({ayahResults.length})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="surahs">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                  {surahResults.map((surah) => (
                    <motion.div
                      key={surah.number}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      layout
                    >
                      <SurahCard surah={surah} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              {surahResults.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                  No surahs found matching "{query}"
                </div>
              )}
            </TabsContent>

            <TabsContent value="ayahs">
              <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
                <AnimatePresence mode="popLayout">
                  {ayahResults.map((ayah) => (
                    <motion.div
                      key={ayah.number}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      layout
                    >
                      <AyahCard ayah={ayah} showInfo />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              {ayahResults.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                  No ayahs found matching "{query}"
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-secondary mb-6">
              <SearchIcon className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">Search the Quran</h3>
            <p className="text-muted-foreground">Enter a keyword to explore verses and chapters</p>
          </div>
        )}
      </div>

      
    </main>
  );
}
