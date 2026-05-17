"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { AyahCard } from "@/components/quran/AyahCard";
import { AudioPlayer } from "@/components/audio/AudioPlayer";
import { Bookmark, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function BookmarksPage() {
  const { bookmarks } = useFavoritesStore();

  return (
    <main className="min-h-screen pb-32">
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
              <Bookmark className="h-4 w-4" /> Saved Ayahs
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
              Your <span className="text-gold">Bookmarks</span>
            </h1>
            <p className="text-xl text-white/80 mb-10 leading-relaxed">
              Marked ayahs for quick reference and study, saved across sessions.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container px-4 mx-auto py-12">
        {bookmarks.length > 0 ? (
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {bookmarks.map((ayah) => (
                <motion.div
                  key={ayah.number}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  layout
                >
                  <AyahCard ayah={ayah} showInfo />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-secondary mb-6 text-muted-foreground">
              <Bookmark className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold mb-2">No bookmarks yet</h3>
            <p className="text-muted-foreground mb-8">Bookmark important ayahs while studying</p>
            <Link href="/surah">
              <Button size="lg" className="bg-primary-green hover:bg-dark-green rounded-xl px-8">
                Explore Surahs
              </Button>
            </Link>
          </div>
        )}
      </div>

      
    </main>
  );
}
