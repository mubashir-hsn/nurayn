"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import Link from "next/link";
import { Layers, ChevronRight } from "lucide-react";

export default function ParaPage() {
  const paras = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <main className="min-h-screen pb-20">
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
              <Layers className="h-4 w-4" /> Quranic Divisions
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
              30 <span className="text-gold">Paras</span>
            </h1>
            <p className="text-xl text-white/80 mb-10 leading-relaxed">
              Navigate the Holy Quran through its traditional thirty equal parts (Juz), designed for daily reading and memorization.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container px-4 mx-auto py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {paras.map((para) => (
            <motion.div
              key={para}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href={`/para/${para}`}>
                <div className="group bg-card border rounded-2xl p-6 hover:border-primary-green hover:shadow-xl transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Layers className="h-12 w-12" />
                  </div>
                  <div className="relative z-10">
                    <span className="text-primary-green font-bold text-sm uppercase tracking-widest">Part</span>
                    <h3 className="text-4xl font-black mb-4">{para}</h3>
                    <div className="flex items-center text-muted-foreground group-hover:text-primary-green transition-colors font-bold text-sm">
                      Open Para <ChevronRight className="ml-1 h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
