"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Surah } from "@/types";
import { cn } from "@/lib/utils";

interface SurahCardProps {
  surah: Surah;
}

export const SurahCard = ({ surah }: SurahCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className="h-full"
    >
      <Link href={`/surah/${surah.number}`} className="block h-full w-full">
        <div className="premium-card overflow-hidden! group relative p-4 md:p-6 bg-card aspect-square flex flex-col justify-between transition-all duration-500 w-full">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-bl-full rounded-tr-2xl group-hover:bg-gold/10 transition-all duration-500 z-0" />

          {/* Top Row: Icon & Arabic Name */}
          <div className="flex items-start justify-between relative z-10 w-full">
            <div className="relative flex h-10 w-10 md:h-14 md:w-14 shrink-0 items-center justify-center">
              <div className="absolute inset-0 bg-gold/10 rounded-lg md:rounded-xl rotate-45 group-hover:bg-gold group-hover:rotate-90 transition-all duration-500" />
              <span className="relative font-bold text-base md:text-xl text-primary-green group-hover:text-white transition-colors">
                {surah.number}
              </span>
            </div>
            <div className="text-right min-w-0 flex-1 ml-2 md:ml-4">
              <h3 className="font-arabic text-xl md:text-4xl text-primary-green group-hover:text-gold transition-colors duration-300 truncate">
                {surah.name}
              </h3>
              <div className="flex items-center justify-end gap-1.5 mt-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                <p className="text-[10px] md:text-xs font-bold text-muted-foreground tracking-tighter uppercase whitespace-nowrap">
                  {surah.numberOfAyahs} Ayahs
                </p>
              </div>
            </div>
          </div>

          {/* Middle Row: English Names */}
          <div className="relative z-10 w-full mt-auto mb-4">
            <h3 className="font-extrabold text-sm md:text-2xl group-hover:text-gold transition-colors duration-300 truncate">
              {surah.englishName}
            </h3>
            <p className="text-[10px] md:text-sm text-muted-foreground font-medium truncate">{surah.englishNameTranslation}</p>
          </div>

          {/* Footer Action */}
          <div className="flex items-center justify-between border-t border-border/50 pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 w-full z-10 relative">
            <span className="text-xs font-bold text-gold uppercase tracking-widest whitespace-nowrap">Explore Surah</span>
            <div className="h-1 w-12 bg-gold rounded-full shrink-0 ml-2" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
