"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";
import { Input } from "@/components/ui/input";

export const Navbar = () => {
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="fixed top-0 z-50 w-full bg-card/80 backdrop-blur-md border-b border-[#F0F2F5]">
      <div className="container flex h-20 items-center justify-between px-4 mx-auto">

        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger 
              render={
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              }
            />
            <SheetContent side="left" className="p-0 w-72">
              <Sidebar />
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 bg-primary dark:bg-emerald-950 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/20 group-hover:scale-105 transition-transform">
              <BookOpen className="h-6 w-6 text-[#EAB308]" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg text-foreground dark:text-primary leading-none tracking-tight">Al-Nur <span className="text-gold">Quran</span></span>
            </div>
          </Link>
        </div>

        {/* Right: Navigation */}
        <div className="hidden md:flex items-center justify-end gap-10 ml-auto">
          {mounted && [
            { label: "Home", href: "/" },
            { label: "Surah", href: "/surah" },
            { label: "Para", href: "/para" },
            { label: "Hadith", href: "/hadith" },
            { label: "Tasbeeh", href: "/tasbeeh" },
            { label: "Qibla", href: "/qibla" },
            { label: "Library", href: "/library" },
            { label: "Settings", href: "/settings" },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "text-sm font-bold transition-all relative group",
                pathname === link.href ? "text-foreground dark:text-primary" : "text-muted-foreground hover:text-foreground dark:text-primary"
              )}
            >
              {link.label}
              {pathname === link.href && (
                <motion.div layoutId="nav-underline" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
              )}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");
import { motion } from "framer-motion";
