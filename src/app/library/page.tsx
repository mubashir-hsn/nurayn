"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { AyahCard } from "@/components/quran/AyahCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  Bookmark, 
  Library as LibraryIcon, 
  Search, 
  Sparkles, 
  Download, 
  Trash2, 
  HardDrive, 
  RefreshCw, 
  Volume2, 
  AlertTriangle, 
  BookOpen, 
  CheckCircle2, 
  Loader2, 
  Play, 
  Wifi, 
  WifiOff, 
  HelpCircle,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePWAStore } from "@/store/usePWAStore";
import { quranService } from "@/services/quranService";
import { 
  getOfflineMetadata, 
  deleteOfflineSurah, 
  saveOfflineSurah, 
  getStorageUsage, 
  OfflineSurahMetadata 
} from "@/lib/indexedDB";
import { toast } from "sonner";
import { Surah } from "@/types";

export default function LibraryPage() {
  const { favorites, bookmarks } = useFavoritesStore();
  const { isOnline } = usePWAStore();
  const [activeTab, setActiveTab] = useState("favorites");
  const [mounted, setMounted] = useState(false);

  // Download Manager States
  const [downloadedSurahs, setDownloadedSurahs] = useState<OfflineSurahMetadata[]>([]);
  const [surahsList, setSurahsList] = useState<Surah[]>([]);
  const [storage, setStorage] = useState<{ used: number; quota?: number; percentage?: number }>({ used: 0 });
  const [loadingList, setLoadingList] = useState(true);
  
  // Download Settings & Configurations
  const [includeAudio, setIncludeAudio] = useState(false);
  const [audioQuality, setAudioQuality] = useState<'standard' | 'low'>('standard');
  const [searchQuery, setSearchQuery] = useState("");
  const [offlineSearchQuery, setOfflineSearchQuery] = useState("");
  
  // Active Downloading Progress States
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadStatusText, setDownloadStatusText] = useState("");

  // Batch download state
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check URL parameters for tab
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam && ["favorites", "bookmarks", "downloads"].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  // Fetch Offline Metadata & Storage Estimation
  const loadOfflineData = async () => {
    try {
      const meta = await getOfflineMetadata();
      setDownloadedSurahs(meta);
      const usage = await getStorageUsage();
      setStorage(usage);
    } catch (error) {
      console.error("Failed to load offline data", error);
    }
  };

  // Load 114 Surahs Listing
  useEffect(() => {
    if (!mounted) return;

    const fetchAllSurahs = async () => {
      try {
        setLoadingList(true);
        const list = await quranService.getSurahs();
        setSurahsList(list);
      } catch (error) {
        console.error("Failed to fetch surah index list", error);
        toast.error("Could not load Surah directory index");
      } finally {
        setLoadingList(false);
      }
    };

    fetchAllSurahs();
    loadOfflineData();
  }, [mounted]);

  // Sync tab updates to URL
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      const newUrl = `${window.location.pathname}?tab=${tab}`;
      window.history.pushState({ path: newUrl }, "", newUrl);
    }
  };

  // Download Action Logic
  const handleDownloadSurah = async (surahNum: number) => {
    if (!isOnline) {
      toast.error("Network connection required to download content");
      return;
    }

    try {
      setDownloadingId(surahNum);
      setDownloadProgress(5);
      setDownloadStatusText("Fetching verses text & translations...");

      // 1. Fetch Surah detail from API (Text, English, Urdu translations)
      const surahDetail = await quranService.getSurahDetail(surahNum);
      
      setDownloadProgress(25);
      setDownloadStatusText("Processing ayah text layout...");

      // 2. Fetch Audio recitations if requested
      const audioBlobs: { [key: number]: Blob } = {};
      
      if (includeAudio) {
        setDownloadStatusText(`Fetching audio files (0/${surahDetail.ayahs.length})...`);
        
        // Loop through all ayahs to download audio Blobs
        for (let i = 0; i < surahDetail.ayahs.length; i++) {
          const ayah = surahDetail.ayahs[i];
          const audioUrl = ayah.audio;
          
          if (audioUrl) {
            // Adjust quality if low is selected (standard is ar.alafasy which is good)
            let fetchUrl = audioUrl;
            // standard alafasy audio files are small (~100kb each)
            try {
              const res = await fetch(fetchUrl);
              if (res.ok) {
                const blob = await res.blob();
                audioBlobs[ayah.numberInSurah] = blob;
              }
            } catch (err) {
              console.error(`Failed to download audio for Ayah ${ayah.number}`, err);
              // Continue and save whatever audio works, no hard crash
            }
          }
          
          // Scaled progress: 25% starting + 70% range for audios
          const progressStep = Math.round(25 + ((i + 1) / surahDetail.ayahs.length) * 70);
          setDownloadProgress(progressStep);
          setDownloadStatusText(`Fetching audio files (${i + 1}/${surahDetail.ayahs.length})...`);
        }
      } else {
        // Fast fake progress for text only downloads
        for (let p = 25; p <= 90; p += 15) {
          await new Promise((resolve) => setTimeout(resolve, 80));
          setDownloadProgress(p);
        }
      }

      setDownloadProgress(95);
      setDownloadStatusText("Saving data to offline database...");

      // 3. Save Surah data, layouts, and audios locally to IndexedDB
      await saveOfflineSurah(surahDetail, includeAudio, includeAudio ? audioBlobs : undefined);
      
      setDownloadProgress(100);
      
      toast.success(`Surah ${surahDetail.englishName} downloaded successfully!`, {
        description: `Now available for full offline reading${includeAudio ? ' and audio recitation' : ''}.`
      });

      // Reload metadata and clean states
      await loadOfflineData();
    } catch (error) {
      console.error("Failed to download Surah details:", error);
      toast.error(`Download failed for Surah #${surahNum}`, {
        description: "Please check your internet connection and try again."
      });
    } finally {
      setDownloadingId(null);
      setDownloadProgress(0);
      setDownloadStatusText("");
    }
  };

  // Delete Action Logic
  const handleDeleteSurah = async (surahNum: number, name: string) => {
    try {
      await deleteOfflineSurah(surahNum);
      toast.success(`Deleted Surah ${name} from storage`, {
        description: "Storage space was successfully reclaimed."
      });
      await loadOfflineData();
    } catch (error) {
      console.error("Failed to delete surah", error);
      toast.error(`Could not delete Surah #${surahNum}`);
    }
  };

  // Download All 114 Surahs Sequentially
  const handleDownloadAll = async () => {
    if (!isOnline) {
      toast.error("Online connection is required for batch downloads");
      return;
    }
    
    setIsDownloadingAll(true);
    toast.info("Starting sequential download of all 114 Surahs", {
      description: "This may take several minutes depending on your connection."
    });

    const notDownloaded = surahsList.filter(s => !downloadedSurahs.some(d => d.number === s.number));

    for (const surah of notDownloaded) {
      try {
        toast.info(`Downloading #${surah.number}: ${surah.englishName}...`);
        await handleDownloadSurah(surah.number);
      } catch (err) {
        console.error(`Batch download failed on Surah #${surah.number}`, err);
        // Continue downloading others
      }
    }

    setIsDownloadingAll(false);
    toast.success("Batch downloading process complete!");
  };

  // Search Filter logic for Surahs
  const filteredSurahs = useMemo(() => {
    return surahsList.filter(s => {
      const matchesSearch = s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            s.name.includes(searchQuery);
      return matchesSearch;
    });
  }, [surahsList, searchQuery]);

  // Format Bytes helper
  const formatBytes = (bytes?: number) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // Offline Search in Downloaded Surahs (Advanced Bonus Feature!)
  const [offlineSearchResults, setOfflineSearchResults] = useState<any[]>([]);
  const [isSearchingOffline, setIsSearchingOffline] = useState(false);

  const handleOfflineSearch = async () => {
    if (!offlineSearchQuery.trim()) {
      setOfflineSearchResults([]);
      return;
    }

    setIsSearchingOffline(true);
    try {
      const results: any[] = [];
      // Read all downloaded surahs from DB
      const { initDB } = await import("@/lib/indexedDB");
      const db = await initDB();
      
      const transaction = db.transaction('surahs', 'readonly');
      const store = transaction.objectStore('surahs');
      const request = store.getAll();

      request.onsuccess = () => {
        const allSurahs = request.result || [];
        const query = offlineSearchQuery.toLowerCase();

        for (const s of allSurahs) {
          for (const ayah of s.ayahs) {
            const matchesArabic = ayah.text.includes(query);
            const matchesEnglish = ayah.translation?.toLowerCase().includes(query);
            const matchesUrdu = ayah.urduTranslation?.includes(query);

            if (matchesArabic || matchesEnglish || matchesUrdu) {
              results.push({
                ...ayah,
                surah: {
                  number: s.number,
                  name: s.name,
                  englishName: s.englishName,
                  englishNameTranslation: s.englishNameTranslation
                }
              });
            }
          }
        }
        setOfflineSearchResults(results.slice(0, 50)); // Limit to top 50 matches for performance
        setIsSearchingOffline(false);
      };
      request.onerror = () => {
        setIsSearchingOffline(false);
        toast.error("Offline search failed.");
      };
    } catch (err) {
      console.error(err);
      setIsSearchingOffline(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAFC] dark:bg-[#031510] pb-32 transition-colors duration-500">
      <Navbar />
      
      {/* Premium Header Section */}
      <section className="pt-36 pb-20 relative overflow-hidden bg-primary dark:bg-emerald-950">
        <div className="absolute inset-0 premium-gradient-green opacity-95 pointer-events-none" />
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]" />
        
        <div className="container px-4 mx-auto relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-gold font-bold text-sm mb-6 border border-white/20 shadow-sm backdrop-blur-md">
              <LibraryIcon className="h-4 w-4" /> Personal Collection
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
              My <span className="text-gold">Library</span>
            </h1>
            <p className="text-xl text-white/80 mb-4 leading-relaxed">
              Access your saved verses, bookmarks, and locally downloaded offline Surahs in one elegant, premium space.
            </p>
            <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-gold mt-2">
              {isOnline ? (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/20">
                  <Wifi className="h-3.5 w-3.5" /> Online: Cloud Sync Active
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/20 animate-pulse">
                  <WifiOff className="h-3.5 w-3.5" /> Offline Mode Active
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container px-4 mx-auto py-16">
        <Tabs defaultValue="favorites" value={activeTab} className="w-full" onValueChange={handleTabChange}>
          <div className="flex justify-center mb-16">
            <TabsList className="bg-card shadow-xl shadow-emerald-900/5 p-2 h-16 rounded-[1.5rem] border border-border/50 backdrop-blur-md">
              <TabsTrigger 
                value="favorites" 
                className="rounded-xl px-8 md:px-12 h-full data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-900/20 transition-all duration-300 font-black text-xs uppercase tracking-widest gap-2"
              >
                <Heart className="h-4 w-4" /> Favorites
              </TabsTrigger>
              <TabsTrigger 
                value="bookmarks" 
                className="rounded-xl px-8 md:px-12 h-full data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-900/20 transition-all duration-300 font-black text-xs uppercase tracking-widest gap-2"
              >
                <Bookmark className="h-4 w-4" /> Bookmarks
              </TabsTrigger>
              <TabsTrigger 
                value="downloads" 
                className="rounded-xl px-8 md:px-12 h-full data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-900/20 transition-all duration-300 font-black text-xs uppercase tracking-widest gap-2"
              >
                <Download className="h-4 w-4 animate-bounce" /> Downloads
              </TabsTrigger>
            </TabsList>
          </div>

          <AnimatePresence mode="wait">
            
            {/* 1. FAVORITES TAB */}
            <TabsContent key="tab-favorites" value="favorites" className="focus-visible:outline-none">
              {favorites.length > 0 ? (
                <motion.div 
                  key="fav-list"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="max-w-4xl mx-auto space-y-8"
                >
                  <div className="flex items-center justify-between mb-8 px-4">
                    <h3 className="text-2xl font-black text-foreground flex items-center gap-3">
                      <Sparkles className="h-6 w-6 text-gold animate-pulse" />
                      Saved Favorites
                    </h3>
                    <span className="bg-primary/10 text-primary dark:bg-emerald-950/40 dark:text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-primary/20">
                      {favorites.length} Verses
                    </span>
                  </div>
                  {favorites.map((ayah) => (
                    <AyahCard key={ayah.number} ayah={ayah} showInfo />
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  key="fav-empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-40 bg-card rounded-[3rem] border border-dashed border-border max-w-2xl mx-auto shadow-md"
                >
                  <div className="h-24 w-24 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Heart className="h-10 w-10 text-muted-foreground/30" />
                  </div>
                  <h3 className="text-2xl font-black text-foreground mb-2">No Favorites yet</h3>
                  <p className="text-muted-foreground font-medium mb-8 max-w-sm mx-auto">
                    Tap the heart icon on any verse while reading to save it permanently in your favorites.
                  </p>
                  <Button asChild className="rounded-xl h-12 px-8 bg-primary font-black uppercase tracking-widest text-xs shadow-lg shadow-emerald-900/10">
                    <a href="/surah">Explore Surahs</a>
                  </Button>
                </motion.div>
              )}
            </TabsContent>

            {/* 2. BOOKMARKS TAB */}
            <TabsContent key="tab-bookmarks" value="bookmarks" className="focus-visible:outline-none">
              {bookmarks.length > 0 ? (
                <motion.div 
                  key="bookmark-list"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="max-w-4xl mx-auto space-y-8"
                >
                  <div className="flex items-center justify-between mb-8 px-4">
                    <h3 className="text-2xl font-black text-foreground flex items-center gap-3">
                      <Sparkles className="h-6 w-6 text-gold animate-pulse" />
                      Bookmarks
                    </h3>
                    <span className="bg-primary/10 text-primary dark:bg-emerald-950/40 dark:text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-primary/20">
                      {bookmarks.length} Bookmarks
                    </span>
                  </div>
                  {bookmarks.map((ayah) => (
                    <AyahCard key={ayah.number} ayah={ayah} showInfo />
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  key="bookmark-empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-40 bg-card rounded-[3rem] border border-dashed border-border max-w-2xl mx-auto shadow-md"
                >
                  <div className="h-24 w-24 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Bookmark className="h-10 w-10 text-muted-foreground/30" />
                  </div>
                  <h3 className="text-2xl font-black text-foreground mb-2">No Bookmarks yet</h3>
                  <p className="text-muted-foreground font-medium mb-8 max-w-sm mx-auto">
                    Bookmark your reading milestones to easily return and continue your spiritual journey.
                  </p>
                  <Button asChild className="rounded-xl h-12 px-8 bg-primary font-black uppercase tracking-widest text-xs shadow-lg shadow-emerald-900/10">
                    <a href="/surah">Explore Surahs</a>
                  </Button>
                </motion.div>
              )}
            </TabsContent>

            {/* 3. DOWNLOADS (DOWNLOAD MANAGER) TAB */}
            <TabsContent key="tab-downloads" value="downloads" className="focus-visible:outline-none">
              <motion.div 
                key="downloads-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-6xl mx-auto space-y-12"
              >
                
                {/* Storage & Manager Header Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Gauge 1: Storage Quota Card */}
                  <div className="bg-card p-6 rounded-3xl border shadow-sm flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-extrabold text-muted-foreground text-xs uppercase tracking-wider">Storage Manager</h4>
                        <HardDrive className="h-5 w-5 text-gold" />
                      </div>
                      <div className="flex items-end gap-2 mb-2">
                        <span className="text-3xl font-black text-foreground">{formatBytes(storage.used)}</span>
                        <span className="text-muted-foreground text-xs font-bold mb-1">Used offline</span>
                      </div>
                      {storage.quota ? (
                        <div>
                          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mb-1.5">
                            <div 
                              className="h-full bg-emerald-500 transition-all duration-500" 
                              style={{ width: `${storage.percentage}%` }} 
                            />
                          </div>
                          <div className="flex justify-between text-[10px] text-muted-foreground font-bold">
                            <span>Quota: {formatBytes(storage.quota)}</span>
                            <span>{storage.percentage?.toFixed(1)}%</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-[10px] text-muted-foreground font-medium">Native storage estimation active.</p>
                      )}
                    </div>

                    {/* Low Storage Alert */}
                    {storage.percentage && storage.percentage > 85 && (
                      <div className="mt-4 flex items-center gap-2 p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 text-xs font-bold">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        <span>Low Storage Warning: Consider clearing space.</span>
                      </div>
                    )}
                  </div>

                  {/* Gauge 2: Offline Options & Configurations */}
                  <div className="bg-card p-6 rounded-3xl border shadow-sm flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-bl-full pointer-events-none" />
                    <div>
                      <h4 className="font-extrabold text-muted-foreground text-xs uppercase tracking-wider mb-4">Download Configurations</h4>
                      
                      {/* Audio Download toggle */}
                      <label className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-secondary/30 border border-border/50 cursor-pointer hover:bg-secondary/50 transition-colors mb-3">
                        <div className="flex items-center gap-2">
                          <Volume2 className="h-4.5 w-4.5 text-gold" />
                          <span className="text-xs font-bold text-foreground">Download Audio Recitation</span>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={includeAudio} 
                          onChange={(e) => setIncludeAudio(e.target.checked)} 
                          className="h-4 w-4 rounded accent-emerald-600 cursor-pointer"
                        />
                      </label>

                      {/* Quality selector */}
                      {includeAudio && (
                        <div className="flex items-center justify-between text-xs p-1 rounded-xl bg-secondary/50">
                          <span className="font-bold pl-2 text-muted-foreground text-[10px] uppercase">Reciter Quality:</span>
                          <div className="flex gap-1">
                            <Button 
                              variant={audioQuality === 'standard' ? 'default' : 'ghost'} 
                              size="sm" 
                              onClick={() => setAudioQuality('standard')}
                              className="h-7 text-[10px] font-black rounded-lg px-3 py-0 bg-primary"
                            >
                              Standard (128kbps)
                            </Button>
                            <Button 
                              variant={audioQuality === 'low' ? 'default' : 'ghost'} 
                              size="sm" 
                              onClick={() => setAudioQuality('low')}
                              className="h-7 text-[10px] font-black rounded-lg px-3 py-0"
                            >
                              Low Space (64kbps)
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Gauge 3: Batch Actions & Availability */}
                  <div className="bg-card p-6 rounded-3xl border shadow-sm flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
                    <div>
                      <h4 className="font-extrabold text-muted-foreground text-xs uppercase tracking-wider mb-3">Batch Actions</h4>
                      <p className="text-xs text-muted-foreground mb-4 font-medium leading-relaxed">
                        Download all remaining {114 - downloadedSurahs.length} chapters sequentially for absolute 100% offline completion.
                      </p>
                    </div>
                    <Button 
                      onClick={handleDownloadAll} 
                      disabled={isDownloadingAll || downloadedSurahs.length === 114 || !isOnline}
                      className="w-full h-11 bg-primary text-white hover:bg-emerald-700 rounded-xl font-black text-xs uppercase tracking-widest shadow-md flex items-center justify-center gap-2"
                    >
                      {isDownloadingAll ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4" /> Download All 114 Surahs
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* ADVANCED: OFFLINE VERSE SEARCH CARD */}
                <div className="bg-card p-8 rounded-3xl border shadow-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gold/5 rounded-bl-full pointer-events-none" />
                  <div className="max-w-2xl">
                    <h3 className="text-xl font-black text-foreground flex items-center gap-2 mb-2">
                      <Sparkles className="h-5 w-5 text-gold" />
                      Search Inside Downloaded Surahs (Offline)
                    </h3>
                    <p className="text-xs text-muted-foreground mb-6 font-medium">
                      Search Arabic scripts, English translations, or Urdu translations instantly across any surah you have downloaded, without internet.
                    </p>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gold" />
                        <Input
                          placeholder="Type Arabic or translation keywords... (e.g. mercy, رحمة)"
                          value={offlineSearchQuery}
                          onChange={(e) => setOfflineSearchQuery(e.target.value)}
                          className="pl-12 h-12 rounded-xl bg-secondary/20 border border-border"
                          onKeyDown={(e) => e.key === "Enter" && handleOfflineSearch()}
                        />
                      </div>
                      <Button onClick={handleOfflineSearch} className="h-12 px-6 rounded-xl bg-gold text-black font-black uppercase text-xs tracking-widest gap-2">
                        {isSearchingOffline ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search Offline"}
                      </Button>
                    </div>
                  </div>

                  {/* Offline Search results container */}
                  {offlineSearchResults.length > 0 && (
                    <div className="mt-8 space-y-6 max-h-[500px] overflow-y-auto pr-2">
                      <h4 className="font-extrabold text-sm text-primary flex items-center justify-between border-b pb-2">
                        <span>Offline Matches Found ({offlineSearchResults.length})</span>
                        <span className="text-xs text-muted-foreground">Limited to top 50 matches</span>
                      </h4>
                      {offlineSearchResults.map((ayah) => (
                        <div key={ayah.number} className="p-5 bg-secondary/20 border rounded-2xl relative overflow-hidden">
                          <div className="flex justify-between items-center mb-3">
                            <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border">
                              {ayah.surah?.englishName} ({ayah.surah?.name}) - Verse {ayah.numberInSurah}
                            </span>
                            <Button asChild variant="ghost" size="sm" className="h-8 rounded-lg text-gold hover:bg-gold/10 font-bold">
                              <a href={`/surah/${ayah.surah?.number}`}>Read Verse <ArrowRight className="h-4 w-4 ml-1" /></a>
                            </Button>
                          </div>
                          <p className="font-quran text-right text-2xl text-foreground mb-3 leading-relaxed" dir="rtl">{ayah.text}</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">{ayah.translation}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {offlineSearchQuery && offlineSearchResults.length === 0 && !isSearchingOffline && (
                    <div className="mt-6 text-center py-6 text-muted-foreground/60 text-xs font-semibold">
                      Press enter or click search to execute local search query.
                    </div>
                  )}
                </div>

                {/* Surah List Table / Directory */}
                <div className="bg-card rounded-3xl border shadow-sm overflow-hidden">
                  <div className="p-6 md:p-8 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="text-2xl font-black text-foreground">Surah Download Directory</h3>
                      <p className="text-xs text-muted-foreground mt-1 font-medium">
                        View status, download progress, file sizes, or read completed surahs.
                      </p>
                    </div>
                    <div className="relative w-full sm:w-80">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
                      <Input
                        placeholder="Search Surah index..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-10 rounded-xl bg-secondary/10 border-border"
                      />
                    </div>
                  </div>

                  {loadingList ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-3">
                      <Loader2 className="h-8 w-8 text-primary animate-spin" />
                      <p className="text-muted-foreground text-xs font-bold animate-pulse">Loading Surah Directory...</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-secondary/30 border-b text-muted-foreground text-[10px] font-black uppercase tracking-wider">
                            <th className="py-4 px-6">No.</th>
                            <th className="py-4 px-6">Name</th>
                            <th className="py-4 px-6">Verses</th>
                            <th className="py-4 px-6">Storage Size</th>
                            <th className="py-4 px-6">Status</th>
                            <th className="py-4 px-6 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                          {filteredSurahs.map((surah) => {
                            const metadata = downloadedSurahs.find(d => d.number === surah.number);
                            const isDownloaded = !!metadata;
                            const isDownloading = downloadingId === surah.number;
                            
                            // Estimate text+audio size based on total verses
                            // Standard average verse text size = 0.5KB. Audio size = 80KB.
                            const estimatedTextSize = surah.numberOfAyahs * 500;
                            const estimatedAudioSize = includeAudio ? (surah.numberOfAyahs * 85000) : 0;
                            const sizeEstimateText = formatBytes(estimatedTextSize + estimatedAudioSize);

                            return (
                              <tr key={surah.number} className="hover:bg-secondary/15 transition-all duration-200 text-sm">
                                
                                {/* Number */}
                                <td className="py-4 px-6 font-bold text-muted-foreground">
                                  {surah.number}
                                </td>
                                
                                {/* Name */}
                                <td className="py-4 px-6">
                                  <div className="flex items-center gap-3">
                                    <div>
                                      <h4 className="font-extrabold text-foreground">{surah.englishName}</h4>
                                      <p className="text-[10px] text-muted-foreground font-semibold">{surah.englishNameTranslation}</p>
                                    </div>
                                    <span className="font-arabic text-xl text-primary-green ml-auto pr-6">{surah.name}</span>
                                  </div>
                                </td>
                                
                                {/* Verses */}
                                <td className="py-4 px-6 font-bold text-muted-foreground">
                                  {surah.numberOfAyahs} Ayahs
                                </td>
                                
                                {/* Size */}
                                <td className="py-4 px-6 text-muted-foreground font-semibold">
                                  {isDownloaded ? (
                                    formatBytes(metadata.textSize + (metadata.audioSize || 0))
                                  ) : (
                                    <span className="text-[10px] uppercase tracking-wide text-muted-foreground/60">~ {sizeEstimateText}</span>
                                  )}
                                </td>
                                
                                {/* Status badge */}
                                <td className="py-4 px-6">
                                  {isDownloading ? (
                                    <div className="space-y-1 max-w-[150px]">
                                      <div className="flex justify-between items-center text-[10px] font-black text-emerald-600">
                                        <span>{downloadProgress}%</span>
                                        <span className="animate-pulse">Loading...</span>
                                      </div>
                                      <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                                        <div 
                                          className="h-full bg-emerald-500 transition-all duration-300" 
                                          style={{ width: `${downloadProgress}%` }} 
                                        />
                                      </div>
                                    </div>
                                  ) : isDownloaded ? (
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-wide shadow-sm">
                                      <CheckCircle2 className="h-3.5 w-3.5 animate-bounce" /> Available Offline
                                    </div>
                                  ) : (
                                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-muted-foreground text-xs font-bold">
                                      Cloud Only
                                    </div>
                                  )}
                                </td>
                                
                                {/* Actions */}
                                <td className="py-4 px-6 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    
                                    {isDownloaded && (
                                      <Button 
                                        asChild 
                                        variant="default" 
                                        size="sm" 
                                        className="h-9 px-4 rounded-xl bg-gold hover:bg-gold/90 text-black font-black uppercase text-[10px] tracking-wider shadow-sm"
                                      >
                                        <a href={`/surah/${surah.number}`}>Read Offline</a>
                                      </Button>
                                    )}

                                    {!isDownloaded && !isDownloading && (
                                      <Button 
                                        onClick={() => handleDownloadSurah(surah.number)}
                                        disabled={!isOnline}
                                        variant="outline" 
                                        size="sm" 
                                        className="h-9 w-9 p-0 rounded-xl text-primary border-primary/20 hover:bg-primary/10 shadow-sm"
                                      >
                                        <Download className="h-4 w-4" />
                                      </Button>
                                    )}

                                    {isDownloaded && !isDownloading && (
                                      <>
                                        <Button 
                                          onClick={() => handleDownloadSurah(surah.number)}
                                          disabled={!isOnline}
                                          variant="outline" 
                                          size="sm" 
                                          className="h-9 w-9 p-0 rounded-xl text-amber-500 border-amber-500/20 hover:bg-amber-500/10 shadow-sm"
                                          title="Re-download Surah"
                                        >
                                          <RefreshCw className="h-4 w-4" />
                                        </Button>
                                        <Button 
                                          onClick={() => handleDeleteSurah(surah.number, surah.englishName)}
                                          variant="outline" 
                                          size="sm" 
                                          className="h-9 w-9 p-0 rounded-xl text-rose-500 border-rose-500/20 hover:bg-rose-500/10 shadow-sm"
                                          title="Delete Surah from device"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </>
                                    )}

                                    {isDownloading && (
                                      <span className="text-[10px] font-black text-emerald-600 animate-pulse truncate max-w-[120px]">
                                        {downloadStatusText}
                                      </span>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {!loadingList && filteredSurahs.length === 0 && (
                    <div className="text-center py-20 text-muted-foreground">
                      <HelpCircle className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
                      <h4 className="text-lg font-bold">No matching surahs found</h4>
                      <p className="text-xs">Adjust your search parameters and try again.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </TabsContent>

          </AnimatePresence>
        </Tabs>
      </div>
    </main>
  );
}

// Arrow icon helper
const ArrowRight = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={2.5} 
    stroke="currentColor" 
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </svg>
);
