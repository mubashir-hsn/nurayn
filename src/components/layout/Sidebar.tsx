"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Book, 
  Layers, 
  Heart, 
  Bookmark, 
  MessageSquare, 
  Settings, 
  Info,
  Clock,
  Compass,
  Zap,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Book, label: "Surahs", href: "/surah" },
  { icon: Layers, label: "Paras/Juz", href: "/para" },
  { icon: Heart, label: "Favorites", href: "/favorites" },
  { icon: Bookmark, label: "Bookmarks", href: "/bookmarks" },
  { icon: Download, label: "Offline Downloads", href: "/library?tab=downloads" },
  { icon: MessageSquare, label: "Hadith", href: "/hadith" },
  { icon: Zap, label: "Tasbeeh", href: "/tasbeeh" },
  { icon: Clock, label: "Prayer Times", href: "/prayer-times" },
  { icon: Compass, label: "Qibla", href: "/qibla" },
];

const secondaryItems = [
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: Info, label: "About", href: "/about" },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-background border-r">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-primary-green flex items-center gap-2">
          <Book className="h-6 w-6 text-gold" />
          Nurayn
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group",
                pathname === item.href
                  ? "bg-primary-green text-white shadow-md"
                  : "text-muted-foreground hover:bg-secondary hover:text-primary-green"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5",
                pathname === item.href ? "text-white" : "text-gold group-hover:text-primary-green"
              )} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t space-y-1">
          {secondaryItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group",
                pathname === item.href
                  ? "bg-primary-green text-white shadow-md"
                  : "text-muted-foreground hover:bg-secondary hover:text-primary-green"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5",
                pathname === item.href ? "text-white" : "text-gold group-hover:text-primary-green"
              )} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
      
      <div className="p-4 bg-secondary/30 mt-auto">
        <p className="text-xs text-center text-muted-foreground">
          Premium Islamic App v1.0
        </p>
      </div>
    </div>
  );
};
