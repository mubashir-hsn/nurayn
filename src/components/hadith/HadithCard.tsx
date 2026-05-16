"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, Book, Share2, Copy } from "lucide-react";
import { Hadith } from "@/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

interface HadithCardProps {
  hadith: Hadith;
}

export const HadithCard = ({ hadith }: HadithCardProps) => {
  const copyHadith = () => {
    const text = `${hadith.hadithArabic}\n\n${hadith.hadithEnglish}\n\n[${hadith.bookName}]`;
    navigator.clipboard.writeText(text);
    toast.success("Hadith copied to clipboard");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="h-full"
    >
      <Card className="premium-card overflow-hidden bg-card border-none shadow-xl h-full flex flex-col">
        <CardContent className="p-6 md:p-8 relative flex-1 flex flex-col">
          <Quote className="absolute top-8 right-8 h-12 w-12 md:h-16 md:w-16 text-gold/5 -rotate-12" />
          
          <div className="flex flex-col gap-8 flex-1">
            {/* Header: Book & Number */}
            <div className="flex items-center gap-3 w-full border-b border-border/50 pb-4">
              <div className="h-10 w-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold shrink-0">
                <Book className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-primary-green truncate">{hadith.bookName}</h4>
                <p className="text-xs text-muted-foreground uppercase font-black tracking-tighter truncate">{hadith.header}</p>
              </div>
            </div>

            {/* Arabic */}
            {hadith.hadithArabic && (
              <p className="font-quran text-2xl md:text-3xl text-right text-primary-green leading-[2.2] antialiased line-clamp-3" dir="rtl">
                {hadith.hadithArabic}
              </p>
            )}

            <div className="space-y-6 pt-6 border-t border-gold/10 relative">
               <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-background text-[9px] font-black text-gold uppercase tracking-[0.3em] border border-gold/20 rounded-full whitespace-nowrap">
                  Translations
               </div>

               {/* Urdu */}
               {hadith.hadithUrdu && (
                 <p className="text-xl md:text-2xl text-right text-dark-green font-medium leading-relaxed line-clamp-3" dir="rtl">
                   {hadith.hadithUrdu}
                 </p>
               )}

               {/* English */}
               <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-medium line-clamp-3">
                 "{hadith.hadithEnglish}"
               </p>
            </div>

            <div className="flex items-center justify-between gap-4 pt-6 mt-auto border-t border-border/50">
              <Link href={`/hadith/${hadith.id}`} className="flex-1">
                <Button className="w-full bg-primary-green hover:bg-dark-green text-white rounded-xl shadow-lg shadow-emerald-900/20 font-bold px-4">
                  Read Full
                </Button>
              </Link>
              <div className="flex items-center gap-1 border-l border-border/50 pl-4 shrink-0">
                <Button variant="ghost" size="icon" onClick={copyHadith} className="h-10 w-10 rounded-xl hover:bg-gold/5 hover:text-gold shrink-0">
                  <Copy className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-gold/5 hover:text-gold shrink-0">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
