import { SurahDetail, Ayah } from '@/types';

const DB_NAME = 'AlQuranOfflineDB';
const DB_VERSION = 1;

export interface OfflineSurahMetadata {
  number: number;
  englishName: string;
  name: string;
  numberOfAyahs: number;
  downloadedAt: number;
  hasAudio: boolean;
  audioSize?: number;
  textSize: number;
}

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject('IndexedDB is only available in the browser');
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('IndexedDB open error:', event);
      reject(request.error);
    };

    request.onsuccess = (event) => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = request.result;
      
      // Store surah details (text, translations, layout, metadata)
      if (!db.objectStoreNames.contains('surahs')) {
        db.createObjectStore('surahs', { keyPath: 'number' });
      }

      // Store audio recitations (Blobs or array buffers, keyed by surahNumber_ayahNumber)
      if (!db.objectStoreNames.contains('audio')) {
        db.createObjectStore('audio');
      }

      // Store download metadata
      if (!db.objectStoreNames.contains('metadata')) {
        db.createObjectStore('metadata', { keyPath: 'number' });
      }
    };
  });
};

export const saveOfflineSurah = async (
  surah: SurahDetail,
  hasAudio: boolean,
  audioBlobs?: { [key: number]: Blob }
): Promise<void> => {
  const db = await initDB();

  // Smart Page Allocation (Page layout data)
  // Group ayahs dynamically to fit nicely in pages without overcrowding
  const pages: Ayah[][] = [];
  let currentPage: Ayah[] = [];
  let currentLength = 0;

  for (const ayah of surah.ayahs) {
    const textLength = ayah.text.length;
    currentPage.push(ayah);
    currentLength += textLength;

    // Split if character count exceeds 1000 characters and we have at least 3 ayahs,
    // or if we hit a maximum of 12 ayahs per page
    if ((currentLength >= 1000 && currentPage.length >= 3) || currentPage.length >= 12) {
      pages.push(currentPage);
      currentPage = [];
      currentLength = 0;
    }
  }
  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  const pageLayout = pages.map((pageAyahs, index) => ({
    pageNumber: index + 1,
    startAyah: pageAyahs[0].numberInSurah,
    endAyah: pageAyahs[pageAyahs.length - 1].numberInSurah,
    ayahs: pageAyahs,
  }));

  const surahToSave = {
    ...surah,
    pageLayout,
  };

  // Estimate text data size
  const textSize = new Blob([JSON.stringify(surahToSave)]).size;

  // 1. Save Surah data
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction('surahs', 'readwrite');
    const store = transaction.objectStore('surahs');
    const request = store.put(surahToSave);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });

  // 2. Save Audio Blobs if provided
  let audioSize = 0;
  if (hasAudio && audioBlobs) {
    const audioTransaction = db.transaction('audio', 'readwrite');
    const audioStore = audioTransaction.objectStore('audio');

    for (const [ayahNumber, blob] of Object.entries(audioBlobs)) {
      audioSize += blob.size;
      const key = `${surah.number}_${ayahNumber}`;
      audioStore.put(blob, key);
    }

    await new Promise<void>((resolve, reject) => {
      audioTransaction.oncomplete = () => resolve();
      audioTransaction.onerror = () => reject(audioTransaction.error);
    });
  }

  // 3. Save Metadata
  const metadata: OfflineSurahMetadata = {
    number: surah.number,
    englishName: surah.englishName,
    name: surah.name,
    numberOfAyahs: surah.numberOfAyahs,
    downloadedAt: Date.now(),
    hasAudio,
    textSize,
    audioSize: hasAudio ? audioSize : 0,
  };

  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction('metadata', 'readwrite');
    const store = transaction.objectStore('metadata');
    const request = store.put(metadata);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getOfflineSurah = async (number: number): Promise<(SurahDetail & { pageLayout: any[] }) | null> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('surahs', 'readonly');
      const store = transaction.objectStore('surahs');
      const request = store.get(number);

      request.onsuccess = () => {
        resolve(request.result || null);
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Failed to get offline surah', error);
    return null;
  }
};

export const getOfflineAudio = async (surahNumber: number, ayahNumber: number): Promise<string | null> => {
  try {
    const db = await initDB();
    const key = `${surahNumber}_${ayahNumber}`;
    const blob = await new Promise<Blob | null>((resolve, reject) => {
      const transaction = db.transaction('audio', 'readonly');
      const store = transaction.objectStore('audio');
      const request = store.get(key);

      request.onsuccess = () => {
        resolve(request.result || null);
      };
      request.onerror = () => {
        reject(request.error);
      };
    });

    if (blob) {
      return URL.createObjectURL(blob);
    }
    return null;
  } catch (error) {
    console.error('Failed to get offline audio', error);
    return null;
  }
};

export const deleteOfflineSurah = async (number: number): Promise<void> => {
  const db = await initDB();

  // 1. Delete Surah Detail
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction('surahs', 'readwrite');
    const store = transaction.objectStore('surahs');
    const request = store.delete(number);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });

  // 2. Delete All Audio for this Surah
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction('audio', 'readwrite');
    const store = transaction.objectStore('audio');
    
    // We open a cursor to find all keys starting with `${number}_`
    const request = store.openKeyCursor();
    request.onsuccess = (event) => {
      const cursor = request.result;
      if (cursor) {
        const key = cursor.primaryKey as string;
        if (key.startsWith(`${number}_`)) {
          store.delete(key);
        }
        cursor.continue();
      } else {
        resolve();
      }
    };
    request.onerror = () => reject(request.error);
  });

  // 3. Delete Metadata
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction('metadata', 'readwrite');
    const store = transaction.objectStore('metadata');
    const request = store.delete(number);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getOfflineMetadata = async (): Promise<OfflineSurahMetadata[]> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('metadata', 'readonly');
      const store = transaction.objectStore('metadata');
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result || []);
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Failed to get offline metadata', error);
    return [];
  }
};

export const getStorageUsage = async (): Promise<{ used: number; quota?: number; percentage?: number }> => {
  if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
    const estimate = await navigator.storage.estimate();
    return {
      used: estimate.usage || 0,
      quota: estimate.quota || 0,
      percentage: estimate.usage && estimate.quota ? (estimate.usage / estimate.quota) * 100 : 0
    };
  }
  
  // Fallback estimation using metadata
  const metadatas = await getOfflineMetadata();
  let total = 0;
  for (const m of metadatas) {
    total += m.textSize + (m.audioSize || 0);
  }
  return {
    used: total
  };
};
