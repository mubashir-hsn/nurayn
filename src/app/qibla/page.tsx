"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Compass, MapPin, Navigation } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function QiblaPage() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    // Simple simulation of compass movement
    const interval = setInterval(() => {
      setRotation(prev => (prev + (Math.random() * 2 - 1)) % 360);
    }, 100);
    return () => clearInterval(interval);
  }, []);

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
              <Compass className="h-4 w-4" /> Accurate Navigation
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
              Qibla <span className="text-gold">Direction</span>
            </h1>
            <p className="text-xl text-white/80 mb-6 leading-relaxed">
              Find the exact direction of the Kaaba from anywhere in the world.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container px-4 mx-auto py-12 flex flex-col items-center">
        <div className="w-full max-w-md">
          <Card className="overflow-hidden border-none shadow-2xl bg-card aspect-square rounded-full relative flex items-center justify-center p-8 border-8 border-primary-green/10">
            {/* Compass Dial */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center p-4"
              animate={{ rotate: rotation }}
              transition={{ type: "spring", damping: 20 }}
            >
              <div className="w-full h-full rounded-full border-2 border-primary-green/20 relative">
                {/* Cardinal Points */}
                <span className="absolute top-2 left-1/2 -translate-x-1/2 font-bold text-primary-green">N</span>
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 font-bold text-muted-foreground">S</span>
                <span className="absolute left-2 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">W</span>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">E</span>

                {/* Needle */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1 h-full flex flex-col items-center">
                    <div className="flex-1 w-full bg-red-500 rounded-t-full" />
                    <div className="flex-1 w-full bg-slate-300 rounded-b-full" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Center Hub */}
            <div className="z-10 h-16 w-16 rounded-full bg-white shadow-lg flex items-center justify-center border-4 border-primary-green">
              <Navigation className="h-8 w-8 text-primary-green fill-current" />
            </div>

            {/* Target Indicator */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
              <div className="h-4 w-4 bg-primary-green rotate-45 mb-2" />
              <span className="text-xs font-black bg-primary-green text-white px-2 py-0.5 rounded">QIBLA</span>
            </div>
          </Card>

          <div className="mt-12 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-secondary rounded-2xl">
              <MapPin className="h-5 w-5 text-primary-green" />
              <span className="font-bold">295.5° NW from Karachi</span>
            </div>

            <p className="text-muted-foreground max-w-sm mx-auto">
              Please ensure your device is flat and away from magnetic interference for better accuracy.
            </p>

            <Button size="lg" className="rounded-2xl bg-primary-green hover:bg-dark-green px-10 h-14 font-bold shadow-xl shadow-primary-green/20">
              Calibrate Sensor
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
