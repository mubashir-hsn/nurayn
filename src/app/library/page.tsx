"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { AyahCard } from "@/components/quran/AyahCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Bookmark, Library as LibraryIcon, Search, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function LibraryPage() {
  const { favorites, bookmarks } = useFavoritesStore();
  const [activeTab, setActiveTab] = useState("favorites");

  const items = activeTab === "favorites" ? favorites : bookmarks;

  return (
    <main className="min-h-screen bg-background pb-32">
      <Navbar />
      
      {/* Premium Header */}
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
              <LibraryIcon className="h-4 w-4" /> Personal Collection
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
              My <span className="text-gold">Library</span>
            </h1>
            <p className="text-xl text-white/80 mb-10 leading-relaxed">
              Access your saved verses, bookmarks, and spiritual collections in one personalized space.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container px-4 mx-auto py-16">
        <Tabs defaultValue="favorites" className="w-full" onValueChange={setActiveTab}>
          <div className="flex justify-center mb-16">
            <TabsList className="bg-card shadow-lg shadow-emerald-900/5 p-2 h-16 rounded-[1.5rem] border border-border/50 backdrop-blur-md">
              <TabsTrigger 
                value="favorites" 
                className="rounded-xl px-12 h-full data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-900/20 transition-all duration-300 font-black text-xs uppercase tracking-widest gap-2"
              >
                <Heart className="h-4 w-4" /> Favorites
              </TabsTrigger>
              <TabsTrigger 
                value="bookmarks" 
                className="rounded-xl px-12 h-full data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-900/20 transition-all duration-300 font-black text-xs uppercase tracking-widest gap-2"
              >
                <Bookmark className="h-4 w-4" /> Bookmarks
              </TabsTrigger>
            </TabsList>
          </div>

          <AnimatePresence mode="wait">
            <TabsContent value={activeTab} className="focus-visible:outline-none">
              {items.length > 0 ? (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="max-w-4xl mx-auto space-y-8"
                >
                  <div className="flex items-center justify-between mb-8 px-4">
                    <h3 className="text-2xl font-black text-foreground flex items-center gap-3">
                      <Sparkles className="h-6 w-6 text-gold" />
                      Saved {activeTab === "favorites" ? "Ayahs" : "Verses"}
                    </h3>
                    <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                      {items.length} Items
                    </span>
                  </div>
                  
                  {items.map((ayah) => (
                    <AyahCard key={ayah.number} ayah={ayah} showInfo />
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-40 bg-card rounded-[3rem] border border-dashed border-border max-w-2xl mx-auto"
                >
                  <div className="h-24 w-24 bg-background rounded-full flex items-center justify-center mx-auto mb-6">
                    {activeTab === "favorites" ? <Heart className="h-10 w-10 text-muted-foreground/30" /> : <Bookmark className="h-10 w-10 text-muted-foreground/30" />}
                  </div>
                  <h3 className="text-2xl font-black text-foreground mb-2">No {activeTab} yet</h3>
                  <p className="text-muted-foreground font-medium mb-8">
                    Start exploring the Quran and save your favorite verses for easy access.
                  </p>
                  <Button asChild className="rounded-xl h-12 px-8 bg-primary font-black uppercase tracking-widest text-xs">
                    <a href="/surah">Explore Surahs</a>
                  </Button>
                </motion.div>
              )}
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </main>
  );
}
