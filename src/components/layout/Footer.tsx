"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Heart, Bookmark, Mail, Globe, MessageSquare, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container px-4 mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-8 gap-12">

          {/* Brand Section */}
          <div className="md:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-10 w-10 bg-primary dark:bg-emerald-950 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/20 group-hover:scale-105 transition-transform">
                <BookOpen className="h-6 w-6 text-gold" />
              </div>
              <span className="font-black text-xl text-foreground dark:text-primary tracking-tight">
                Nur<span className="text-gold">ayn</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              A premium digital experience for the Noble Quran. Explore, read, and listen with modern tools designed for spiritual growth.
            </p>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="rounded-xl bg-secondary/50 hover:text-primary">
                <Globe className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-xl bg-secondary/50 hover:text-primary">
                <Mail className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-xl bg-secondary/50 hover:text-primary">
                <MessageSquare className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-6">
            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-foreground/50">Explore</h4>
            <ul className="space-y-4">
              <li><Link href="/surah" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Surah Index</Link></li>
              <li><Link href="/para" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Para Index</Link></li>
              <li><Link href="/hadith" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Hadith Library</Link></li>
              <li><Link href="/tasbeeh" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Digital Tasbeeh</Link></li>
            </ul>
          </div>

          {/* User Links */}
          <div className="md:col-span-2 space-y-6">
            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-foreground/50">My Library</h4>
            <ul className="space-y-4">
              <li><Link href="/library" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">Favorites</Link></li>
              <li><Link href="/library" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">Bookmarks</Link></li>
              <li><Link href="/settings" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Settings</Link></li>
              <li><Link href="/about" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">About us</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-muted-foreground font-medium">
            © 2026 Nurayn. All rights reserved. Built with devotion.
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={scrollToTop}
            className="rounded-xl font-bold gap-2 text-xs text-muted-foreground hover:text-primary"
          >
            Scroll to Top <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </footer>
  );
};
