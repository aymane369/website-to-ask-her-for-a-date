# Project: "Will You Go Out With Me?"

A single-purpose static website: an interactive, playful page for asking someone
on a date, with a design that intentionally does **not** look AI-generated —
sharp corners, thick borders, hard offset shadows ("neo-brutalist"), bold flat
colors, and real micro-interactions instead of soft pastel/glassmorphism.

Live repo: https://github.com/aymane369/website-to-ask-her-for-a-date

## Hard constraints (do not break these)

- **Must stay a plain static site.** No build step, no bundler, no framework,
  no `node_modules` committed. Just `index.html` + `styles.css` + `script.js`
  (+ `audio.mp3`). This is deliberate so it deploys straight to GitHub Pages
  by pointing Pages at the `master` branch — no CI/build pipeline.
- **No external JS/CSS dependencies** other than the Google Fonts `<link>`
  tags in `<head>`, **and Leaflet** (map library, loaded via `<link>`/`<script>`
  from the unpkg CDN with SRI `integrity` hashes — see the place picker below).
  Everything else (confetti, sound effects, canvas image export, calendar
  export, icons) is hand-rolled in `script.js`/inline SVG with zero libraries.
  Leaflet was an explicit, deliberate exception the owner asked for (they
  first tried a hand-drawn/static map, decided it wasn't good enough for
  actually picking a real meeting spot, and approved adding Leaflet
  specifically — don't read this as an opening to add other dependencies).
- Files, referenced from `index.html`:
  - `index.html` — markup for all three "pages" (they're really one document;
    see Architecture below)
  - `styles.css` — all styling, the neo-brutalist design system
  - `script.js` — one big IIFE with all interactivity, no modules/imports
  - `audio.mp3` — user-provided background music file (~6.8MB, ~2:49 long,
    looped)

## Architecture: single-page, three "pages"

There's no routing/framework. `index.html` contains three `<section class="page">`
elements (`#page-ask`, `#page-details`, `#page-confirm`) inside one `.shell`.
`script.js` toggles a `.active` class to show/hide them and mirrors the current
page in `location.hash` (`#ask` / `#details` / `#confirm`) so back/forward and
reload roughly work. The `showPage()` function in `script.js` is the router.

Flow: **ask** (Yes/No question) → **details** (date/time/vibe/excitement) →
**confirm** (summary + actions).

## Design system (styles.css)

CSS custom properties in `:root`, overridden under `html[data-theme="dark"]`:
- `--ink` / `--paper` / `--panel` — text / page background / card background
- `--pink` `--yellow` `--blue` `--mint` `--violet` — the flat accent palette
- `--border-w: 3px`, `--radius: 0px` (sharp corners everywhere), hard
  drop-shadow via `--shadow` / `--shadow-lg` (offset, no blur — e.g.
  `8px 8px 0 0 var(--ink)`), no soft/blurred box-shadows anywhere
- Fonts: `Archivo Black` (headings), `Space Grotesk` (body), `Space Mono`
  (labels/badges/ticker/mono accents) — loaded via Google Fonts in `<head>`
- Buttons (`.btn`) lift on hover (`translate(-3px,-3px)` + bigger shadow) and
  press flat on `:active` (`translate(3px,3px)` + shadow collapses to ~0) —
  that press/lift physicality is the core "not vibe-coded" tell, keep it
  consistent on any new interactive element.
- A generic `.icon-btn` (46×46 square) + attached popover pattern
  (`.sound-panel`, `.time-picker-panel`) is reused for both the sound
  controls and the time picker — sharp-bordered box, hard shadow, opacity/
  transform transition, positioned `absolute` under its trigger button.
  Follow this pattern for any new popover.

## Features (what's already built)

**Ask page**
- Yes button; No button that dodges the cursor on hover/tap and cycles
  through increasingly desperate `noPhrases[]` text, then "surrenders"
  (becomes a normal Yes-equivalent button) after a random 5–8 attempts.
- Visible "Attempts to escape" counter.
- Scrolling ticker banner of funny "reasons to say yes" (`reasons[]` array).

**Details page**
- Native `<input type="date">` / `<input type="time">`, plus a **custom
  mouse-only time picker**: a clock-icon button next to the time field opens
  a popover with Hour (0–23) and Minute (0–59) range sliders. This exists
  *because* the native time-picker icon is inconsistent across browsers and
  can visually disappear against a dark background in dark mode (icon color
  isn't theme-aware) — the custom picker sidesteps that entirely.
- Vibe picker: 6 selectable cards (Pizza Night, Sushi Date, Movie Night, Cozy
  Café, Adventure Day, Ice Cream Walk), each with a hand-rolled inline SVG
  icon (see the icon sprite in `index.html`'s `<body>` — a `<symbol>`-based
  sheet reused via `<use href="#icon-x">`). `data-emoji` is kept on each
  card purely for the Konami-code emoji rain, which still uses actual emoji
  as confetti.
- **Place picker**: a real Leaflet map (`#leafletMap`) with OpenStreetMap
  tiles. She can click the map, drag the dropped pin, or use the search box
  (Nominatim geocoding) to jump to an address/city. Reverse-geocodes the
  clicked point to a short label (`shortenPlaceLabel()` keeps just the
  first two comma-separated segments of Nominatim's `display_name`).
  Entirely optional — doesn't gate the confirm button.
- Excitement meter: a slider (0–4) with a matching face/label from
  `excitementLevels[]` (kept as real emoji — expressive faces, not chrome).
- Confirm button disabled until date + time + vibe are all valid (place is
  optional and not part of this check).

**Confirm page**
- Summary rendered as a "ticket" (`.ticket`) with punched-hole notches.
- Live countdown (days/hrs/min/sec) to the chosen date+time.
- **Add to Calendar** — generates a real `.ics` file client-side (see
  `downloadCalendarInvite()`) and downloads it via a Blob URL.
- **Download Date Card** — draws a PNG summary card on a hidden `<canvas>`
  (`downloadDateCard()`) and downloads it.
- **Share** — uses `navigator.share()` if available, else copies the summary
  text to the clipboard.
- Reset button clears `sessionStorage` and reloads.

**Global / cross-page**
- **Dark mode toggle** (🌙/☀️), persisted in `localStorage`.
- **Background music**: loops `audio.mp3` via a real `<audio>` element.
  Volume slider + Mute button live in a popover under the 🔊 icon in the
  corner (`#soundPanel`). Both volume and mute are persisted to
  `localStorage` and also gate the Web Audio–based UI sound effects (see
  Audio section below).
- **UI sound effects**: short synthesized blips/chimes via the Web Audio API
  (`playTone()`, `playSuccessChime()`) — no audio files, just oscillators.
  These are separate from the background music but share the mute setting.
- **Konami code easter egg**: ↑↑↓↓←→←→BA anywhere on the page triggers a
  banner + a rain of the selected vibe's emoji (falls back to 🎉✨💫🥳 if no
  vibe picked yet).
- Ambient floating shapes drifting up the background continuously; a bigger
  confetti/heart burst plays when reaching the confirm page.
- **EN/FR localization**: a language toggle (`#langToggle`) swaps every
  `data-i18n`/`data-i18n-label`/`data-i18n-placeholder` string via the
  `translations` table in `script.js` and re-runs the few dynamically
  generated bits (ticker, No-button phrase, excitement label, confirm
  summary) through `t()`/`applyLocale()`. Persisted to
  `localStorage['date-ask-lang']`. Confirm-message copy is a per-locale
  *function*, not a shared template with swapped words, since French word
  order differs. `Intl.DateTimeFormat` also switches locale (`en-US`/`fr-FR`)
  for date/time formatting.

## State & persistence

- `sessionStorage['date-ask-state-v2']` — a JSON blob with the "session"
  state: chosen date/time/vibe/excitement, `placeLat`/`placeLng`/`placeLabel`
  (the map pin, all optional), No-button attempt count/surrender status,
  whether details/confirm have been reached, last known pointer position
  (used to steer the No button away from the cursor). Cleared by the Reset
  button. This is intentionally `sessionStorage`, not `localStorage` — each
  new visit/tab starts the ask flow fresh.
- `localStorage['date-ask-theme']` — `"dark"` or absent/`"light"`.
- `localStorage['date-ask-lang']` — `"fr"` or absent/`"en"`.
- `localStorage['date-ask-muted']` — `"1"` or `"0"`.
- `localStorage['date-ask-volume']` — `"0"`–`"100"` (string). **Careful**:
  when reading this, `localStorage.getItem()` returns `null` if unset, and
  `Number(null)` is `0` (not `NaN`) — a real bug hit once already. Always
  check for `null` explicitly before defaulting, don't rely on
  `Number.isFinite()` alone.

## Known browser gotchas already fixed here (don't reintroduce them)

1. **`position: fixed` containing block trap.** `.page` animates in with a
   CSS `transform` (slide/scale). Per spec, a `transform` on *any* ancestor
   becomes the containing block for `position: fixed` descendants — so a
   naively-fixed element inside `.page` is NOT actually fixed to the browser
   viewport, it's fixed relative to `.page`. The dodging No button works
   around this by reparenting itself to `document.body` for the duration of
   the dodge (see `escapeNoButton()` / `parkNoButton()`). If you add any other
   "escapes to a random screen position" behavior, reparent to `<body>` too,
   or you'll get the same "flies off past the edge of the screen" bug.
2. **Don't leave escaped elements behind on page navigation.** Because the
   No button gets reparented to `<body>` while dodging, hiding `#page-ask`
   alone doesn't hide it anymore. `showPage()` calls `parkNoButton()`
   whenever navigating to anything other than "ask" to move it back home
   first. Any other element that ever gets reparented for a `position:fixed`
   escape needs the same "park it before leaving the page" treatment.
3. **Mid-transition re-triggering.** The No button's dodge uses a CSS
   `transition` on `top`/`left`. Browsers can refire `mouseenter` while an
   element is still moving under a stationary cursor, causing runaway
   repeat-triggers. Fixed with an `isDodging` lock (~300ms) in
   `handleNoAttempt()`. Keep this guard if you touch that code.
4. **Re-measure, don't cache, a resizing element's box.** The No button's
   text (and therefore its natural width) changes every attempt. The escape
   math re-reads `getBoundingClientRect()` fresh on every dodge instead of
   reusing a size captured on the first dodge — otherwise later, longer
   phrases overflow a box sized for the first, shorter phrase.
5. **Audio autoplay policy.** No browser allows audio-with-sound before the
   visitor interacts with the page at least once. `initMusic()` calls
   `bgMusic.play()` immediately (browsers just ignore/reject it silently)
   and again on the very first `pointerdown`/`keydown`/`touchstart` anywhere
   on the page. This is the best a static site can do — there is no way to
   truly autoplay with sound before a gesture.
6. **iOS Safari ignores `<audio>.volume`.** `applyMusicVolume()` sets both
   `.volume` (respected by most browsers) and `.muted` (the one iOS actually
   honors) so mute at least works everywhere even if fine-grained volume
   doesn't on iOS.
7. **Function-scoped `const` temporal dead zone.** Music-related `const`
   data arrays must be declared *before* any code that might synchronously
   read them runs (they're declared near the top of the IIFE, before
   `initMusic()` is called) — declaring big data tables right next to the
   function that uses them, but *after* the call site, throws
   `ReferenceError: Cannot access '...' before initialization` and silently
   kills the entire script (very easy mistake to reintroduce when moving
   code around).
8. **Leaflet needs a *visible* container to measure.** `#page-details` is
   `display: none` until you navigate to it, so `L.map(el)` cannot be
   called at page load — it'll size itself against a 0×0 box and render
   blank/broken tiles. `initLeafletMap()` is instead called lazily from
   `showPage()` the first time `"details"` becomes active, after a short
   `setTimeout` (the `.page` slide-in transition means even *then* the
   container may not have its final layout box on the very same tick).
   `leafletMap.invalidateSize()` is also called on every return to the
   details page, in case the viewport changed size while elsewhere.

## Testing workflow used during development

There's no test suite. Changes were verified by actually running the site:
- A tiny throwaway Node static server (plain `http` + `fs`, no deps) was used
  via the `Launch preview` panel, because the project lives under a path with
  a space in it (`New folder`) which broke some tool argument-passing when
  pointed at the directory directly — a custom `.claude/preview-server.js`
  with the path hardcoded inside the script (not passed as a CLI arg)
  sidesteps that.
- Test across at least: a small phone width (~320–375px), a tablet width
  (~768–1024px), and desktop, plus both light and dark theme, before calling
  a change done — several real bugs (overflow, invisible icons, wrong
  containing block) only showed up at specific sizes/themes.
- Check the browser console for errors after every reload — a silent full
  script failure (e.g. the TDZ bug above) can leave the static HTML/CSS
  looking fine while zero JS behavior works.

## Ideas / natural next steps (not built yet)

- A way to preview/change the background music without editing the file
  directly (e.g. a small set of alternate tracks to choose from).
- More languages beyond EN/FR — the `translations` table in `script.js` and
  `data-i18n`/`data-i18n-label`/`data-i18n-placeholder` attributes in
  `index.html` are the two places to extend.
- More vibe options, or letting the "reasons to say yes" ticker text be
  customized per-recipient.
- The Konami code is currently the only easter egg — could add more hidden
  triggers (e.g. a specific vibe + excitement combo).
- The place picker has no default/suggested pins anymore (pure click/search
  now) — could add a couple of quick-pick buttons for known favorite spots
  if that turns out to be more convenient than always searching.
