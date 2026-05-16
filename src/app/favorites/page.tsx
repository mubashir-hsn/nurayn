"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { AyahCard } from "@/components/quran/AyahCard";
import { AudioPlayer } from "@/components/audio/AudioPlayer";
import { Heart, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FavoritesPage() {
  const { favorites } = useFavoritesStore();

  return (
    <main className="min-h-screen pb-32">
      <Navbar />
      
      <section className="bg-red-500 text-white py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]" />
        <div className="container px-4 mx-auto relative z-10">
          <Heart className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Favorite Ayahs</h1>
          <p className="text-xl opacity-80">Your personally curated collection of divine verses</p>
        </div>
      </section>

      <div className="container px-4 mx-auto py-12">
        {favorites.length > 0 ? (
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {favorites.map((ayah) => (
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
              <Heart className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold mb-2">No favorites yet</h3>
            <p className="text-muted-foreground mb-8">Start saving your favorite ayahs while reading</p>
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
