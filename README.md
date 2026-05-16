# Al-Nur Quran App

A premium, interactive digital experience for reading and exploring the Noble Quran and authentic Hadiths. Designed with a modern "Emerald Green & Gold" aesthetic, Al-Nur provides an elegant, distraction-free environment for spiritual growth and daily practice.

## ✨ Features

- **The Noble Quran**: Complete 114 Surahs and 30 Paras (Juz) with beautifully optimized Arabic typography.
- **Authentic Hadiths**: Browse and search through collections like Sahih Bukhari with multi-language translations.
- **Audio Recitation**: Built-in audio player for listening to Quranic recitations seamlessly while you read.
- **Digital Tasbeeh**: An interactive, animated digital counter for your daily Dhikr, complete with haptic feedback, sound, and a target system.
- **Qibla Finder**: A beautiful compass interface to help you find the direction of the Kaaba.
- **My Library**: Save your favorite verses, bookmark your progress, and continue reading exactly where you left off.
- **Daily Inspiration**: Auto-updating "Ayah of the Day" and "Hadith of the Day" on the home page.
- **Prayer Times**: Live tracking of local prayer times.
- **Highly Customizable**: 
  - Toggle between Page View and Card View.
  - Adjust Arabic font size to your preference.
  - Toggle English and Urdu translations.
  - Full Dark Mode support.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Library**: React 18
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: Zustand (for audio, settings, and favorites persistence)
- **Components**: Shadcn UI / Radix Primitives

## 🔌 APIs Used

- **Quran Data**: [Al Quran Cloud API](https://alquran.cloud/api)
- **Hadith Data**: [Fawaz Ahmed Hadith API](https://github.com/fawazahmed0/hadith-api)
- **Prayer Times**: [Aladhan API](https://aladhan.com/prayer-times-api)

## 🚀 Getting Started

First, clone the repository and install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to experience the application.

## 🎨 Design Philosophy

Al-Nur was built around a "Premium First" philosophy. It avoids generic styles in favor of curated, harmonious color palettes featuring deep Emerald Greens, rich Golds, and elegant Ruby Red accents. The UI utilizes glassmorphism, soft shadows, sophisticated Arabic typography (Noto Naskh Arabic/Amiri), and subtle micro-animations to create an interface that feels responsive, alive, and spiritually uplifting.
