export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  audio?: string;
  audioSecondary?: string[];
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | any;
  surah?: Surah;
  translation?: string;
  urduTranslation?: string;
}

export interface SurahDetail extends Surah {
  ayahs: Ayah[];
  edition?: Edition;
}

export interface Edition {
  identifier: string;
  language: string;
  name: string;
  englishName: string;
  format: string;
  type: string;
}

export interface Juz {
  number: number;
  ayahs: Ayah[];
}

export interface Hadith {
  id: number;
  hadithArabic: string;
  hadithUrdu: string;
  hadithEnglish: string;
  bookName: string;
  chapterName: string;
  header: string;
}

export interface PrayerTime {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
}

export interface AudioState {
  isPlaying: boolean;
  currentSurah: Surah | null;
  currentAyahIndex: number;
  ayahs: Ayah[];
  playbackSpeed: number;
  reciter: string;
  volume: number;
}
