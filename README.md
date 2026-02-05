# EasyStudy

AI-powered step-by-step study helper for high school and university students.

## Features

- **Ask Anything** — Get step-by-step explanations for Math, Physics, Chemistry, Biology, History & more
- **Practice Mode** — AI-generated practice questions with timed mode and difficulty levels
- **Topic Browser** — Browse subjects with theory summaries and worked examples
- **Progress Tracking** — Mastery levels, activity charts, and weakest topic identification
- **Study Plans** — AI-generated personalized daily study schedules
- **Spaced Repetition** — SM-2 algorithm schedules reviews at optimal intervals
- **Streak System** — Daily goals, streak tracking, and heatmap visualization
- **Achievements** — 12 badges that unlock as you study
- **Multi-language** — English, Spanish, Hungarian, French, German
- **Offline Support** — Download topic packs, queue questions for when you're back online
- **PWA** — Installable on any device, works offline
- **Dark Mode** — Full light/dark theme support

## Tech Stack

- React 18 + Vite 7
- Tailwind CSS v4
- Firebase Auth + Firestore
- Claude API (via Netlify Functions)
- Framer Motion
- Recharts
- KaTeX (math rendering)
- react-i18next (i18n)
- IndexedDB via idb (offline storage)
- vite-plugin-pwa (Workbox)

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in your Firebase and Anthropic API keys

# Start dev server
npm run dev

# Build for production
npm run build
```

## Environment Variables

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
ANTHROPIC_API_KEY=
```

## Project Structure

```
src/
  components/    # Reusable UI components
  context/       # React context providers (Auth, Theme)
  data/          # Static topic content (JSON)
  hooks/         # Custom React hooks
  i18n/          # Translation files (en, es, hu, fr, de)
  lib/           # Firebase config
  pages/         # Route pages
  services/      # Firestore CRUD, sync service
  utils/         # Utility functions
netlify/
  functions/     # Serverless API endpoints
public/          # Static assets, PWA icons
```

## Deployment

Deployed on Netlify with automatic builds from the main branch. Serverless functions handle AI requests and Stripe payments.
