# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AtomAlias** — a web-based Alias party game (Ukrainian language) played on a single shared device (phone passed between teams). Features 4 themed rounds with swipe mechanics, timer, scoring, and leaderboard.

Full spec: `desctription.md` (Ukrainian)

## Tech Stack

- **React** (SPA) — likely Vite-based for Vercel deployment
- **Tailwind CSS** — styling with cyber-neon dark theme (`#0f172a` background, cyan `#06b6d4` / pink `#ec4899` accents)
- **Framer Motion** — card swipe animations, screen transitions, confetti
- **localStorage** — game state persistence (survives page refresh)
- **PWA** — manifest + service worker for offline play and "Add to Home Screen"
- **Web Audio API** — timer tick sounds and alarm (no external audio files)
- **No external APIs** — all data (word dictionaries) hardcoded in-app

## Build & Development Commands

```bash
npm install        # install dependencies
npm run dev        # start dev server
npm run build      # production build
npm run preview    # preview production build locally
```

Deploy target: **Vercel**

## Architecture

### Game Flow (Screen Sequence)

1. **Setup** — team count, names (with random generator), timer duration, round toggles
2. **Round Rules** — shown before each round
3. **Word Input** (Round 1 only) — each team enters words, all shuffled into one shared pool
4. **Play** — Tinder-style swipe cards (up = correct +1, down = skip), countdown timer
5. **Leaderboard** — shown between rounds
6. **Final Screen** — winner announcement with confetti

### Four Rounds

| Round | Name | Task | Word Source |
|-------|------|------|-------------|
| 1 | «Дай рєспєкт» | Explain any way | Player-submitted words (shared pool) |
| 2 | «Запускаю атомне» | Pantomime only | Built-in Ukrainian nouns (1000+) |
| 3 | «Проектор-Ж» | Classic Alias (words only) | Built-in Ukrainian words (1000+) |
| 4 | «Ухилянт» | Explain in English only | Built-in English nouns, elementary level (1000+) |

**Round 3 special rule:** When timer expires, the current word becomes "global" — any team can guess it. A team-picker UI appears on swipe-up.

### Key Design Decisions

- **Mobile-first** — primary device is a phone, touch/swipe optimized
- **Single-device multiplayer** — phone passed between teams, turn-based
- Word dictionaries are hardcoded arrays (3 dictionaries, 1000+ words each)
- Team name generator: 30+ funny Ukrainian team names
- Timer last 10 seconds: red pulsing digits + tick sound each second
- After timer expires: one final swipe allowed on the current word
- Words can repeat between games (shuffled per game, no usage tracking)

## Language

UI and word dictionaries are in **Ukrainian**. Round 4 uses English words but UI remains Ukrainian. Spec document is in Ukrainian.
