"use client";

import React, { useRef, useEffect, useState } from "react";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  X, 
  Settings2,
  Repeat,
  Download
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useAudioStore } from "@/store/useAudioStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { cn } from "@/lib/utils";

export const AudioPlayer = () => {
  const { 
    currentAyah, 
    isPlaying, 
    setIsPlaying, 
    playNext, 
    playPrevious, 
    playbackSpeed, 
    volume, 
    setVolume,
    setCurrentAyah
  } = useAudioStore();
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (currentAyah?.audio && audioRef.current) {
      audioRef.current.src = currentAyah.audio;
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Play interrupted:", e));
      }
    }
  }, [currentAyah]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Play interrupted:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current && isFinite(playbackSpeed)) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  useEffect(() => {
    if (audioRef.current && isFinite(volume)) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, [volume]);

  const onTimeUpdate = () => {
    if (audioRef.current && isFinite(audioRef.current.duration)) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current && isFinite(audioRef.current.duration)) {
      setDuration(audioRef.current.duration);
    }
  };

  const onEnded = () => {
    playNext();
  };

  const seek = (val: number[]) => {
    if (audioRef.current && isFinite(duration)) {
      const time = (val[0] / 100) * duration;
      if (isFinite(time)) {
        audioRef.current.currentTime = time;
        setProgress(val[0]);
      }
    }
  };

  if (!currentAyah) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t shadow-2xl p-4 md:px-8"
      >
        <audio
          ref={audioRef}
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          onEnded={onEnded}
        />
        
        <div className="container mx-auto">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-secondary cursor-pointer group">
            <div 
              className="h-full bg-primary-green transition-all" 
              style={{ width: `${progress}%` }} 
            />
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-2">
            {/* Ayah Info */}
            <div className="flex items-center gap-4 w-full md:w-1/3">
              <div className="h-12 w-12 rounded-lg bg-primary-green/10 flex items-center justify-center text-primary-green font-bold text-xl border">
                {currentAyah.numberInSurah}
              </div>
              <div className="overflow-hidden">
                <h4 className="font-bold truncate">{currentAyah.surah?.englishName || "Ayah Details"}</h4>
                <p className="text-xs text-muted-foreground truncate italic">
                  {currentAyah.translation?.slice(0, 50)}...
                </p>
              </div>
              <Button variant="ghost" size="icon" className="md:hidden ml-auto" onClick={() => setCurrentAyah(null)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 md:gap-6">
              <Button variant="ghost" size="icon" onClick={playPrevious}>
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="h-12 w-12 rounded-full bg-primary-green hover:bg-dark-green text-white shadow-lg"
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={playNext}>
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>

            {/* Volume & Speed */}
            <div className="hidden md:flex items-center gap-6 w-1/3 justify-end">
              <div className="flex items-center gap-2 w-32">
                {volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                <Slider 
                  value={[volume * 100]} 
                  max={100} 
                  step={1} 
                  onValueChange={(val) => setVolume(val[0] / 100)} 
                />
              </div>
              <Button variant="ghost" size="icon" onClick={() => setCurrentAyah(null)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
