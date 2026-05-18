# 🌟 Nurayn (الْقُرْآنُ الْكَرِيمُ)

A premium, interactive digital experience for reading, exploring, and listening to the Noble Quran and authentic Hadiths. Designed with a modern, state-of-the-art **"Emerald Green & Gold"** aesthetic, Nurayn provides an elegant, distraction-free environment for spiritual growth and daily practice.

Featuring **100% Offline Support**, a **Downloadable Surah System**, and an authentic printed **Mushaf Book Reading view** with seamless chapter and Juz (Para) transitions.

---

## ✨ Features Highlight

### 📱 1. PWA & Complete Offline Support
* **Progressive Web App (PWA)**: Works like a modern desktop/mobile application, fully installable with custom icons and launch banners.
* **Offline Caching**: Leverages high-performance Service Workers and Cache API to cache core assets, layout sheets, translations, and font packages so that the app loads instantly without any internet connection.
* **Large Data Management**: Uses **IndexedDB** for storing large datasets like full Arabic verses, translations, and media metadata.

### 📥 2. Downloadable Surah System (Offline Audio & Text)
* **One-Click Surah Downloader**: Users can download complete Surahs for offline reading and listening.
* **Offline Bundling**: A single download package includes:
  - High-definition Arabic Naskh script.
  - Urdu and English translations.
  - Full Ayah-by-Ayah audio recitations, cached as binary blobs directly inside **IndexedDB**.
* **Offline Mode Indicator**: A live banner indicates whether you are viewing a downloaded Surah or browsing live online.

### 📖 3. Premium Mushaf Book View
* **Authentic Printed Layout**: Dynamically packs and partitions verses into beautifully proportioned page spreads, closely mimicking a printed Quran.
* **Diacritic-Insensitive Bismillah Stripping**: Intelligent Unicode parsing strips the diacritic Bismillah from the first verse of any Surah (except Surah Al-Fatihah #1 and Surah At-Tawbah #9) to prevent repetition with the Surah header, rendering the text cleanly.
* **Golden Islamic Border Surah Cards**: Every time a new Surah starts (either on page start or mid-page in Juz mode), a premium Golden Border card is rendered inline detailing the Surah's Name, Transliteration, Type, and Verse count.
* **Elegant Bismillah Banner**: Beautifully centers the Arabic Bismillah script with custom divider ornaments.

### 🔄 4. Seamless Transitions (No Hard Reloads)
* **Surah Auto-Progression**: Reaching the final page of a Surah and clicking "Next" transitions you smoothly to the next Surah page.
* **Para (Juz) Auto-Progression**: Moving past the boundary of a Para dynamically loads the next Para seamlessly.
* **Client-Side Routing**: Handled entirely through Next.js native `useRouter` client navigation, eliminating browser hard refreshes and page reloads for a fluid single-page experience.

### 🏡 5. Smart "Continue Reading" Dashboard
* **Dynamic Recitation Tracker**: Automatically saves your progress whether you are reading in Surah mode or Para/Juz mode.
* **One-Click Resume**: Displays your last read location (Surah name, Ayah number, or Para number) on the homepage. Clicking the button instantly guides you to your exact reading progress position.

### 📿 6. Additional Islamic Features
* **Prayer Times**: Live tracking of local prayer times (Fajr, Dhuhr, Asr, Maghrib, Isha) with HSL gold theme card.
* **Tasbeeh Counter**: A beautifully animated digital counter for Dhikr, complete with haptic feedback, audio click sounds, and target setting system.
* **Qibla Finder**: A responsive magnetic compass interface helping you orient towards the Kaaba.
* **Authentic Hadiths**: Browse and search through collections like Sahih Bukhari with multi-language translations.
* **My Library**: Dedicated sections for saved favorite verses and page bookmarks.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router & Server-Client Architecture)
- **Library**: React 18
- **Styling**: Tailwind CSS & Vanilla CSS (Emerald-Gold-Ruby premium design theme)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (for Audio, Settings, Favorites, and Reading Progress)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **PWA Capabilities**: Service Workers & Cache Storage API
- **Offline Storage**: IndexedDB (via local wrapper) & LocalStorage

---

## 🔌 APIs Used

- **Quran Data**: [Al Quran Cloud API](https://alquran.cloud/api)
- **Hadith Data**: [Fawaz Ahmed Hadith API](https://github.com/fawazahmed0/hadith-api)
- **Prayer Times**: [Aladhan API](https://aladhan.com/prayer-times-api)

---

## 🚀 Getting Started

First, clone the repository and install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to experience the application.

---

## 🎨 Design Philosophy

Nurayn was built around a **"Premium First"** philosophy. It avoids generic, plain colors in favor of curated, harmonious palettes featuring deep **Emerald Greens**, rich **Golds**, and elegant **Ruby Red** highlights. 

The interface utilizes:
* Sleek glassmorphism filters (`backdrop-blur-md`).
* Smooth micro-animations for cards, clicks, and page transitions.
* Custom Noto Naskh Arabic typography with adjustable sizes for comfortable reading.
* High-end typography (Outfit/Inter/Poppins) for English layouts.
* Native Dark Mode styling for night recitations.

---

> [!NOTE]
> All offline Quran and translation data, downloads, bookmarks, and audio player states are synced client-side using hybrid local storage and fast IndexedDB transactions, making Nurayn a complete standalone spiritual companion.
