"use client";

import React, { useEffect, useState, use } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { hadithService } from "@/services/hadithService";
import { Hadith } from "@/types";
import { Book, Copy, Share2, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function HadithDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [hadith, setHadith] = useState<Hadith | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHadith = async () => {
      try {
        const data = await hadithService.getHadithById(id);
        setHadith(data);
      } catch (error) {
        console.error("Error fetching hadith detail", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHadith();
  }, [id]);

  const copyHadith = () => {
    if (!hadith) return;
    const text = `${hadith.hadithArabic}\n\n${hadith.hadithEnglish}\n\n[${hadith.bookName}]`;
    navigator.clipboard.writeText(text);
    toast.success("Hadith copied to clipboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary/10">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
          <Loader2 className="h-12 w-12 text-gold animate-spin" />
          <p className="text-xl font-bold text-muted-foreground">Loading Hadith...</p>
        </div>
      </div>
    );
  }

  if (!hadith) {
    return (
      <div className="min-h-screen bg-secondary/10">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 text-center px-4">
          <Book className="h-24 w-24 text-muted-foreground/30" />
          <h2 className="text-3xl font-bold text-foreground">Hadith not found</h2>
          <p className="text-muted-foreground">The hadith you are looking for could not be found or does not exist.</p>
          <Link href="/hadith">
            <Button className="mt-4 bg-primary-green hover:bg-dark-green text-white font-bold rounded-xl px-8 h-12">
              <ArrowLeft className="mr-2 h-5 w-5" /> Back to Hadith Collection
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-32 bg-secondary/10">
      <Navbar />

      {/* Premium Header */}
      <section className="pt-40 pb-16 relative overflow-hidden bg-primary dark:bg-emerald-950">
        <div className="absolute inset-0 premium-gradient-green opacity-90 pointer-events-none" />
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]" />

        <div className="container px-4 mx-auto relative z-10 text-center text-white">
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="hidden md:block h-px w-20 bg-white/20" />
            <div className="bg-white/10 text-gold px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm backdrop-blur-md flex items-center gap-2 border border-white/20">
              <Book className="h-3 w-3" /> {hadith.bookName}
            </div>
            <div className="hidden md:block h-px w-20 bg-white/20" />
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-gold mb-4 tracking-tight">
            {hadith.header}
          </h1>
          {hadith.chapterName && (
            <h2 className="font-poppins text-xl md:text-2xl text-white/80 mb-8">
              Chapter: {hadith.chapterName}
            </h2>
          )}

          <div className="mt-8">
            <Link href="/hadith">
              <Button variant="ghost" className="rounded-xl font-bold gap-2 text-white/80 hover:text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4" /> Back to Collection
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="container px-4 mx-auto py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          <Card className="premium-card bg-[#FDFBF7] dark:bg-[#04241B] border-[#E5E0D8] dark:border-primary/20 shadow-[0_20px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] rounded-[2rem] overflow-hidden relative">
            <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
            <div className="absolute inset-5 md:inset-8 border-[3px] border-double border-gold/40 dark:border-gold/20 rounded-xl pointer-events-none z-20" />

            <CardContent className="p-10 md:p-16 lg:p-24 relative z-10 flex flex-col gap-12">
              {/* Actions Header */}
              <div className="flex justify-end gap-2 border-b border-gold/10 pb-6">
                <Button variant="ghost" size="icon" onClick={copyHadith} className="h-12 w-12 rounded-xl hover:bg-gold/10 hover:text-gold transition-colors">
                  <Copy className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl hover:bg-gold/10 hover:text-gold transition-colors">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {/* Arabic */}
              {hadith.hadithArabic && (
                <p className="font-quran text-2xl md:text-3xl lg:text-4xl text-right text-primary-green leading-[1.8] md:leading-loose antialiased" dir="rtl">
                  {hadith.hadithArabic}
                </p>
              )}

              <div className="space-y-12 pt-12 border-t border-gold/10 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-6 py-1 bg-[#FDFBF7] dark:bg-[#04241B] text-[10px] md:text-xs font-black text-gold uppercase tracking-[0.3em] border border-gold/20 rounded-full z-10">
                  Translations
                </div>

                {/* Urdu */}
                {hadith.hadithUrdu && (
                  <p className="text-2xl md:text-3xl lg:text-4xl text-right text-dark-green font-medium leading-relaxed" dir="rtl">
                    {hadith.hadithUrdu}
                  </p>
                )}

                {/* English */}
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-medium">
                  "{hadith.hadithEnglish}"
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
