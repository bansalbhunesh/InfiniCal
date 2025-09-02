# InfiniCal (Vite + React)

InfiniCal is a modern, high-performance infinite calendar and journaling app. This repo contains:
- A production-ready Vite + React implementation with feature parity to the standalone HTML.
- A standalone reference file: `infinite-calendar-final.html`.

## Quick Start

Prerequisites: Node 18+

Install and run:
```bash
npm install
npm run dev
```
Build and preview:
```bash
npm run build
npm run preview
```

## App Structure

- `index.html`: Vite entry
- `src/`
  - `main.jsx`: App bootstrap (+ optional dataset seeding)
  - `App.jsx`: App root
  - `styles.css`: Global styles (gradients, scrollbars, chips, etc.)
  - `components/`
    - `InfiniteCalendar.jsx`: Main calendar view
    - `JournalOverlay.jsx`: 5-card swipable overlay across entries
    - `AddEntryModal.jsx`: Add/Edit entry modal
    - `YearPicker.jsx`: Year selector overlay
    - `MonthYearPicker.jsx`: Month+Year selector overlay
    - `Toast.js`: Success notifications
  - `state/`
    - `journalStore.js`: Local storage–backed journal store (CRUD)
    - `seed.js`: Optional demo dataset seeding
  - `utils/`
    - `date.js`: Date helpers and grid generation

## Features (React Implementation)

- Infinite month navigation (lazy spans with scroll sentinels)
- Sticky month headers with weekday labels
- Quick navigation controls
  - Prev/Next Month, Prev/Next Year, Today
  - Keyboard: Ctrl+←/→ (month), Ctrl+↑/↓ (year), Ctrl+T (today), Esc closes overlays
- Day grid states: outside-month, today, selected; entry count badges
- Right journal panel for the selected date
  - List of entries with rating stars, category pills, View/Edit/Delete actions
  - Add Entry opens modal (description, rating slider, categories, optional image URL)
  - LocalStorage persistence; entries sorted by rating (desc)
- Journal overlay (global)
  - 5-card carousel window (far-prev, prev, current, next, far-next)
  - Touch swipe and Arrow keys to navigate
  - Header shows entry counter and formatted date
  - Image, rating stars, description, category pills
- Month + Year picker overlay
  - Jump directly to any month/year
- Visual polish to match the standalone file
  - Gradient header, rounded chips, subtle shadows
  - Custom scrollbars and sticky elements

## Data Persistence

All entries are stored in `localStorage` under the `journalEntries` key via `src/state/journalStore.js`.
- `seedIfEmpty()` (called in `main.jsx`) optionally pre-populates demo entries if storage is empty. Remove or comment out if not desired.

## Standalone File (Reference)

We keep one standalone reference file:
- `infinite-calendar-final.html` — the original, single-file version that inspired this React app.

This React version mirrors the final HTML’s behavior while providing a componentized, maintainable architecture suitable for production.

## Development Notes

- Date operations powered by `date-fns`
- UI components are plain React with inline styles + `src/styles.css` for global polish
- The store is intentionally simple (localStorage). You can swap it with an API later.

## Keyboard Shortcuts

- Ctrl + Left/Right: Previous/Next Month
- Ctrl + Up/Down: Previous/Next Year
- Ctrl + T: Today
- Escape: Close overlays/modals

## Scripts

- `npm run dev`: Start dev server on port 3000
- `npm run build`: Create production build in `dist/`
- `npm run preview`: Preview the production build

## Roadmap / Customization

- Backend persistence: Replace localStorage with REST/GraphQL
- Theming: Extract inline styles to CSS modules/Tailwind for theming
- Animations: Add Framer Motion for richer transitions where desired

## License

MIT
