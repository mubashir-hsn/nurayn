"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, BookOpen, Compass, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Hero = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,#0F766E15_0%,transparent_100%)]" />
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]" />
      
      <div className="container px-4 mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-primary-green uppercase bg-primary-green/10 rounded-full">
            The Noble Quran
          </span>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl md:text-7xl font-poppins">
            Read, Study, and Learn <br />
            <span className="text-primary-green">The Holy Quran</span>
          </h1>
          <p className="max-w-2xl mx-auto mb-10 text-lg text-muted-foreground md:text-xl">
            Experience the divine message with beautiful typography, translations, 
            audio recitations, and deep search capabilities.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <div className="relative w-full max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary-green transition-colors" />
              <Input 
                placeholder="Search Surah, Ayah or Keyword..." 
                className="pl-12 h-14 rounded-2xl border-2 focus-visible:ring-primary-green transition-all shadow-sm"
              />
            </div>
            <Button size="lg" className="h-14 px-8 rounded-2xl bg-primary-green hover:bg-dark-green text-white font-bold text-lg shadow-xl shadow-primary-green/20">
              Start Reading
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
