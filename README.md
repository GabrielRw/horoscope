# Daily Horoscope 🌙

A premium, deploy-ready daily horoscope website powered by [FreeAstroAPI](https://www.freeastroapi.com). Built with Next.js 15 (App Router), TypeScript, Tailwind CSS 4, and Framer Motion.

![Daily Horoscope Preview](https://github.com/GabrielRw/horoscope/raw/main/public/preview.png)

## Overview

This project is a modern, minimalist astrology web application designed for speed, accessibility, and visual elegance. It features a "Cosmic" black-and-white theme with glassmorphism effects and fluid animations.Users can get daily readings for their zodiac sign or generate highly personalized horoscopes based on their exact birth time and location.

## Features

- 🌌 **Cosmic Aesthetic:** Immersive night-sky theme with noise textures, glass panels, and subtle gradients.
- ♈ **12 Zodiac Signs:** Dedicated pages for each sign with element-themed styling (Fire, Earth, Air, Water).
- 📅 **Personalized Readings:** Calculate exact transits based on birth date, time, and city coordinates.
- 📊 **Vitality Scores:** Visual breakdown of Love, Career, Money, and Health scores with animated progress bars.
- 🎯 **Actionable Guidance:** Daily "Cosmic State" (Moon Phase, Moon Sign) and lucky attributes.
- 📱 **Mobile-First:** Fully responsive design with native-like date/time pickers for a seamless mobile experience.
- ⚡ **High Performance:** Server-Side Rendering (SSR) for fast initial loads and SEO optimization.

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://typescriptlang.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Data:** [FreeAstroAPI](https://www.freeastroapi.com/)
- **Validation:** [Zod](https://zod.dev/)

---

## How It Works

### 1. Architecture
The application uses the **Next.js App Router** structure.
- **`src/app/page.tsx`**: The main landing page. It features a tabbed interface for switching between "Generic Sign" (Sun Sign only) and "Personalized" (Full birth chart) modes.
- **`src/app/horoscope/[sign]/page.tsx`**: A dynamic route that renders the reading for a specific sign. It fetches data server-side to ensure good SEO and performance.

### 2. Data Fetching & Caching
Data is fetched from `FreeAstroAPI`.
- **Server Actions/Components**: The reading pages are React Server Components (RSC). They fetch horoscope data directly on the server before sending HTML to the client.
- **Caching**: Next.js automatically caches these requests for a short period to reduce API load and improve speed.
- **Proxy**: API requests are routed through `src/app/api/horoscope/route.ts` to hide any sensitive logic (if applicable) and manage headers.

### 3. Personalized Engine
The "Personalized" feature uses a sophisticated flow:
1.  **Input:** User enters Birth Date, Birth Time, and Birth City.
2.  **Geocoding:** The city search uses a client-side lookup (or API) to find latitude/longitude.
3.  **Calculation:** The app sends this precise data (Day, Month, Year, Hour, Minute, Lat, Lon) to the backend.
4.  **Transits:** The backend calculates the exact planetary transits relative to the user's natal chart (e.g., "Mars square Natal Venus") to provide a truly unique reading.

### 4. Native UI Components
To ensure a robust experience across iOS and Android:
- **Date/Time Pickers:** We use native `<input type="date">` and `<input type="time">` elements wrapped in custom styled containers. This triggers the native OS spinners on mobile, providing the most familiar and accessible interaction for users.

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/GabrielRw/horoscope.git
   cd horoscope
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   
   Define your API keys (if required/using a private instance):
   ```env
   FREEASTROAPI_API_KEY=your_key_here
   FREEASTROAPI_BASE_URL=https://astro-api-1qnc.onrender.com
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment

The easiest way to deploy is using **Vercel**:

### One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FGabrielRw%2Fhoroscope)

### Manual Deployment
1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com) and click "Add New... > Project".
3. Import your `horoscope` repository.
4. Vercel will automatically detect Next.js. Click **Deploy**.
5. (Optional) Add environment variables in the Vercel dashboard under "Settings > Environment Variables".

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx         # Global layout (Fonts, Metadata)
│   ├── page.tsx           # Homepage (Landing + Forms)
│   ├── globals.css        # Global styles + Tailwind config
│   ├── api/               # API Routes (Proxies)
│   └── horoscope/         # Horoscope Reading Pages
├── components/            # React Components
│   ├── ui/                # Reusable UI (Buttons, Inputs)
│   ├── DatePicker.tsx     # Native Date Picker Wrapper
│   ├── TimeSelect.tsx     # Native Time Picker Wrapper
│   └── ...
├── lib/                   # Utilities
│   ├── astroapi.ts        # API Client Logic
│   └── signs.ts           # Zodiac Static Data
└── public/                # Static Assets (Fonts, Images)
```

## License

MIT License. Free to use and modify.
