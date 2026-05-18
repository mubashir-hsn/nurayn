import { Hadith } from '@/types';

const BASE_URL = 'https://raw.githubusercontent.com/fawazahmed0/hadith-api/1/editions';

const fetchJson = async (url: string) => {
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) {
      console.warn(`Hadith API 404/Error: ${url}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(`Fetch failed for ${url}:`, error);
    return null;
  }
};

export const hadithService = {
  async getHadiths(edition = 'eng-bukhari'): Promise<any[]> {
    let data = await fetchJson(`${BASE_URL}/${edition}.json`);
    if (!data) data = await fetchJson(`${BASE_URL}/eng-bukhari.json`);
    return data?.hadiths || [];
  },

  async getHadithById(id: string | number): Promise<Hadith | null> {
    try {
      // Find the hadith by id
      const targetId = Number(id);
      
      const [ara, eng] = await Promise.all([
        fetchJson(`${BASE_URL}/ara-bukhari.json`),
        fetchJson(`${BASE_URL}/eng-bukhari.json`),
      ]);

      if (ara && eng && ara.hadiths && eng.hadiths) {
        // The APIs are ordered sequentially so hadithnumber might match index approximately, but let's find it.
        const engHadith = eng.hadiths.find((h: any) => h.hadithnumber === targetId);
        const araHadith = ara.hadiths.find((h: any) => h.hadithnumber === targetId);
        
        if (engHadith) {
           return {
             id: engHadith.hadithnumber,
             hadithArabic: araHadith?.text || '', 
             hadithEnglish: engHadith.text,
             hadithUrdu: '',
             bookName: 'Sahih Bukhari',
             chapterName: '',
             header: `Hadith ${engHadith.hadithnumber}`,
           };
        }
      }

      const fallback = await fetchJson(`${BASE_URL}/eng-bukhari.json`);
      if (fallback && fallback.hadiths) {
        const fallbackHadith = fallback.hadiths.find((h: any) => h.hadithnumber === targetId);
        if (fallbackHadith) {
          return {
            id: fallbackHadith.hadithnumber,
            hadithArabic: '',
            hadithEnglish: fallbackHadith.text,
            hadithUrdu: '',
            bookName: 'Sahih Bukhari',
            chapterName: '',
            header: `Hadith ${fallbackHadith.hadithnumber}`,
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error fetching hadith by ID:", error);
      return null;
    }
  },

  async getDailyHadith(): Promise<Hadith | null> {
    const randomIndex = Math.floor(Math.random() * 50) + 1; // Pick from first 50 for stability
    
    try {
      // Try multi-lang first
      const [ara, eng] = await Promise.all([
        fetchJson(`${BASE_URL}/ara-bukhari.json`),
        fetchJson(`${BASE_URL}/eng-bukhari.json`),
      ]);

      if (ara && eng && ara.hadiths && eng.hadiths) {
        const safeIndex = Math.min(randomIndex, ara.hadiths.length - 1, eng.hadiths.length - 1);
        return {
          id: eng.hadiths[safeIndex].hadithnumber || safeIndex,
          hadithArabic: ara.hadiths[safeIndex].text, 
          hadithEnglish: eng.hadiths[safeIndex].text,
          hadithUrdu: '',
          bookName: 'Sahih Bukhari',
          chapterName: '',
          header: `Hadith ${eng.hadiths[safeIndex].hadithnumber || safeIndex}`,
        };
      }

      // Fallback to single lang if multi-lang fails
      const fallback = await fetchJson(`${BASE_URL}/eng-bukhari.json`);
      if (fallback && fallback.hadiths[randomIndex]) {
        return {
          id: fallback.hadiths[randomIndex].hadithnumber,
          hadithArabic: '',
          hadithEnglish: fallback.hadiths[randomIndex].text,
          hadithUrdu: '',
          bookName: 'Sahih Bukhari',
          chapterName: '',
          header: `Hadith ${fallback.hadiths[randomIndex].hadithnumber}`,
        };
      }

      // Hardcoded fallback for absolute reliability
      return {
        id: 1,
        hadithArabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
        hadithEnglish: "The reward of deeds depends upon the intentions and every person will get the reward according to what he has intended.",
        hadithUrdu: "اعمال کا دارومدار نیتوں پر ہے۔",
        bookName: "Sahih Bukhari",
        chapterName: "Revelation",
        header: "Hadith 1"
      };
    } catch (error) {
      console.error("Error fetching multi-lang hadith:", error);
      return null;
    }
  }
};
