"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { BookOpen, ShieldCheck, Heart, Users, Globe, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background pb-32">
      <Navbar />

      {/* Premium Header */}
      <section className="bg-dark-green text-white pt-40 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 premium-gradient-green opacity-90" />
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]" />

        <div className="container px-4 mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="h-20 w-20 bg-white/10 rounded-[2.5rem] backdrop-blur-md flex items-center justify-center mx-auto mb-8 border border-white/20">
              <Sparkles className="h-10 w-10 text-gold" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight">About Nur<span className="text-gold">ayn</span></h1>
            <p className="text-xl text-white/70 max-w-lg mx-auto font-medium">
              Illuminating the path of guidance through technology and devotion.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container px-4 mx-auto py-20">
        <div className="max-w-4xl mx-auto space-y-24">

          {/* Mission Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-black text-gold uppercase tracking-[0.3em]">Our Mission</span>
              <h2 className="text-4xl font-black text-foreground leading-tight">Spreading the Message of Peace & Guidance</h2>
              <p className="text-muted-foreground leading-relaxed font-medium">
                Nurayn is dedicated to providing a high-fidelity, modern platform for engaging with the Word of Allah. Our goal is to make Quranic study accessible, beautiful, and deeply integrated into your daily life.
              </p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-[3rem] p-12 aspect-square flex items-center justify-center border border-emerald-100 dark:border-emerald-900/20">
              <BookOpen className="h-32 w-32 text-primary" />
            </div>
          </section>

          {/* Core Values */}
          <section className="space-y-12">
            <div className="text-center">
              <h2 className="text-4xl font-black text-foreground">Core Principles</h2>
              <p className="text-muted-foreground font-medium mt-2">The foundation of every feature we build.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { title: "Authenticity", desc: "Sourced from verified repositories like Al-Quran Cloud for maximum accuracy.", icon: ShieldCheck },
                { title: "User-Centric", desc: "Designed with focus and tranquility in mind to prevent distractions.", icon: Users },
                { title: "Global Access", desc: "Supporting multiple translations and recitations for the Ummah worldwide.", icon: Globe },
              ].map((v) => (
                <Card key={v.title} className="border-none shadow-sm rounded-[2rem] bg-card p-8 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0 space-y-4">
                    <div className="h-14 w-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                      <v.icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{v.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Open Source / Community */}
          <section className="bg-primary rounded-[3rem] p-12 md:p-20 text-center text-white space-y-8 shadow-2xl shadow-emerald-900/40">
            <Heart className="h-16 w-16 mx-auto text-gold fill-current" />
            <h2 className="text-4xl font-black tracking-tight">Support Our Journey</h2>
            <p className="text-lg text-white/80 max-w-xl mx-auto font-medium">
              This project is a Sadqah Jariyah initiative. If you find value in Nurayn, please remember us in your Duas and share the application with others.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
