import { Surah, SurahDetail, Ayah, Edition } from '@/types';

const BASE_URL = 'https://api.alquran.cloud/v1';

const fetchJson = async (url: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse JSON:", text.slice(0, 100));
      throw new Error("Invalid JSON response from server");
    }
  } catch (error) {
    console.error(`Fetch failed for ${url}:`, error);
    throw error;
  }
};

export const quranService = {
  async getSurahs(): Promise<Surah[]> {
    const data = await fetchJson(`${BASE_URL}/surah`);
    return data.data;
  },

  async getSurahDetail(number: number, englishEdition = 'en.sahih', urduEdition = 'ur.ahmedali', audioEdition = 'ar.alafasy'): Promise<SurahDetail> {
    const [arabic, english, urdu, audio] = await Promise.all([
      fetchJson(`${BASE_URL}/surah/${number}`),
      fetchJson(`${BASE_URL}/surah/${number}/${englishEdition}`),
      fetchJson(`${BASE_URL}/surah/${number}/${urduEdition}`),
      fetchJson(`${BASE_URL}/surah/${number}/${audioEdition}`),
    ]);

    const detail: SurahDetail = {
      ...arabic.data,
      ayahs: arabic.data.ayahs.map((ayah: Ayah, index: number) => ({
        ...ayah,
        translation: english.data.ayahs[index].text,
        urduTranslation: urdu.data.ayahs[index].text,
        audio: audio.data.ayahs[index].audio,
      })),
    };

    return detail;
  },

  async getJuz(number: number, englishEdition = 'en.sahih', urduEdition = 'ur.ahmedali', audioEdition = 'ar.alafasy'): Promise<Ayah[]> {
    const [arabic, english, urdu, audio] = await Promise.all([
      fetchJson(`${BASE_URL}/juz/${number}/quran-uthmani`),
      fetchJson(`${BASE_URL}/juz/${number}/${englishEdition}`),
      fetchJson(`${BASE_URL}/juz/${number}/${urduEdition}`),
      fetchJson(`${BASE_URL}/juz/${number}/${audioEdition}`),
    ]);

    return arabic.data.ayahs.map((ayah: Ayah, index: number) => ({
      ...ayah,
      translation: english.data.ayahs[index].text,
      urduTranslation: urdu.data.ayahs[index].text,
      audio: audio.data.ayahs[index].audio,
    }));
  },

  async search(query: string): Promise<Ayah[]> {
    const data = await fetchJson(`${BASE_URL}/search/${query}/all/en.sahih`);
    return data.data.matches;
  },

  async getDailyAyah(): Promise<Ayah | null> {
    try {
      const randomAyah = Math.floor(Math.random() * 6236) + 1;
      const [arabic, english, urdu, audio] = await Promise.all([
        fetchJson(`${BASE_URL}/ayah/${randomAyah}/quran-uthmani`),
        fetchJson(`${BASE_URL}/ayah/${randomAyah}/en.sahih`),
        fetchJson(`${BASE_URL}/ayah/${randomAyah}/ur.ahmedali`),
        fetchJson(`${BASE_URL}/ayah/${randomAyah}/ar.alafasy`),
      ]);
      
      return {
        ...arabic.data,
        translation: english.data.text,
        urduTranslation: urdu.data.text,
        audio: audio.data.audio,
        surah: arabic.data.surah
      };
    } catch (error) {
      console.error("Error in getDailyAyah:", error);
      return null;
    }
  }
};
