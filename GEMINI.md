# GEMINI.md — g-videos Project Wiki

> **Wiki-style, LLM-readable.** This file is the single source of truth.
> The agent MUST proactively update relevant sections after every architectural decision.

---

## 1. Project Overview

| Field | Value |
|-------|-------|
| **Name** | ChaiTube |
| **Type** | React SPA (Vite 8, React 19) |
| **Goal** | YouTube clone using `freeapi.app` static data |
| **Design System** | NeoBrutalism (RetroUI) |
| **Status** | Phase 2 — Sidebar + Playlists + CategoryBar complete |

---

## 2. Architecture

### 2.1 Directory Structure

```
src/
├── components/
│   ├── Navbar.jsx            # Sticky top nav with search + hamburger toggle
│   ├── Sidebar.jsx           # YouTube-style left sidebar + channel subscription card
│   ├── VideoCard.jsx         # Video thumbnail + meta card
│   ├── CategoryBar.jsx       # Horizontal scrollable category pill bar
│   ├── retroui/
│   │   └── Button.jsx        # RetroUI neobrutalist button
│   └── ui/
│       ├── button.jsx        # shadcn/ui base button (used by cult-ui)
│       ├── youtube-video-player.jsx  # cult-ui YouTube player
│       └── Primitives.jsx    # Skeleton, ErrorBox, FilterPills
├── hooks/
│   └── useFetch.js           # Generic data-fetching hook
├── lib/
│   ├── api.js                # All freeapi.app API calls
│   └── utils.js              # cn() helper (clsx + tailwind-merge)
├── pages/
│   ├── HomePage.jsx          # / → video grid + sort filters
│   ├── WatchPage.jsx         # /watch/:videoId → player + comments + related
│   ├── PlaylistsPage.jsx     # /playlists → playlist card grid
│   └── PlaylistDetailPage.jsx # /playlists/:id → playlist header + video grid
├── App.jsx                   # BrowserRouter + sidebar layout + routes
├── App.css                   # Global resets, scrollbar, selection
└── index.css                 # Tailwind v4 + shadcn CSS tokens
```

### 2.2 Routing

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `HomePage` | Video grid, search results, sort filter |
| `/watch/:videoId` | `WatchPage` | Player, info, comments, related |
| `/playlists` | `PlaylistsPage` | Channel playlist card grid |
| `/playlists/:playlistId` | `PlaylistDetailPage` | Playlist header + item video grid |

### 2.3 Data Flow

```
freeapi.app API
      ↓
  lib/api.js   (thin fetch wrappers, no state)
      ↓
  hooks/useFetch.js  (loading / error / data states)
      ↓
  Pages (HomePage, WatchPage)
      ↓
  Components (VideoCard, YouTubePlayer, etc.)
```

---

## 3. External APIs

**Base URL:** `https://api.freeapi.app/api/v1/public/youtube`

| Endpoint | Params | Purpose |
|----------|--------|---------|
| `GET /videos` | page, limit, query, sortBy | Video list / search |
| `GET /videos/:id` | — | Single video details |
| `GET /comments/:id` | — | Video comments |
| `GET /related/:id` | page, limit | Related videos |
| `GET /playlists` | page, limit | Channel playlists |
| `GET /playlists/:id` | — | Playlist + items |
| `GET /channel` | — | Channel details (snippet, statistics, brandingSettings) |

> **Note:** Static data only. No API key required.

### Response Shapes (Critical — non-standard nesting!)

**`GET /videos` list:**
```json
{ "data": { "totalItems": 96, "data": [ { "kind": "...", "items": { "id": "...", "snippet": {}, "statistics": {}, "contentDetails": {} } } ] } }
```
→ Extract: `response.data.data.map(e => e.items)`

**`GET /videos/:id`:**
```json
{ "data": { "video": { "items": { "id": "...", "snippet": {}, "statistics": {} } }, "channel": { "info": {} } } }
```
→ Extract: `response.data.video.items`

**`GET /comments/:id`:** ⚠️ Flat array — NOT paginated
```json
{ "data": [ { "id": "...", "snippet": { "topLevelComment": { "snippet": { "textDisplay": "", "authorDisplayName": "", ... } } } } ] }
```
→ Extract: `response.data` (direct array)

**`GET /related/:id`:**  
Same paginated list shape as `/videos` — extract `response.data.data.map(e => e.items)`

**`GET /playlists`:** ⚠️ Items have NO `.items` sub-key unlike videos
```json
{ "data": { "data": [ { "kind": "youtube#playlist", "id": "...", "snippet": {} } ] } }
```
→ Extract: `response.data.data` (plain objects, no `.items`)

**`GET /playlists/:id`:**
```json
{ "data": { "playlist": { "id": "...", "snippet": {} }, "playlistItems": [ { "snippet": { "resourceId": { "videoId": "..." }, "thumbnails": {} } } ], "channel": { "info": {}, "statistics": {} } } }
```
→ Extract: `response.data.playlist`, `response.data.playlistItems`, `response.data.channel`

**`GET /channel`:**
```json
{ "data": { "kind": "youtube#channelListResponse", "info": { "snippet": {}, "statistics": {}, "brandingSettings": {} } } }
```
→ Extract: `response.data.info.snippet`, `response.data.info.statistics`


---

## 4. Component Library — RetroUI (NeoBrutalism)

- **Style:** NeoBrutalism — thick black borders, offset box-shadows (`box-shadow: 4px 4px 0 #000`), bold fonts, hover lift effects
- **Install pattern:** `bunx shadcn@latest add @retroui/<component>`
- **Installed:** `Button` → `src/components/retroui/Button.jsx`
- **Convention:** Always import RetroUI components from `@/components/retroui/`

### RetroUI Design Tokens (custom inline, not CSS vars)
- Border: `border-2 border-black`
- Shadow: `style={{ boxShadow: "4px 4px 0 #000" }}`
- Hover lift: `hover:-translate-y-1`
- Accent: `bg-yellow-400`

---

## 5. Special Components

### 5.1 cult-ui — YouTube Player
- **Source:** `https://cult-ui.com/r/youtube-video-player.json`
- **File:** `src/components/ui/youtube-video-player.jsx`
- **Dependencies:** `motion`, `lucide-react`
- **Usage:**
  ```jsx
  import { YouTubePlayer } from "@/components/ui/youtube-video-player";
  <YouTubePlayer videoId="EQwmQLU1S6I" title="My Video" />
  ```
- **Features:** Thumbnail preview, play on click, expand to fullscreen, Escape key to close

---

## 6. Tooling & Config

| Tool | Config File | Notes |
|------|------------|-------|
| Vite 8 | `vite.config.js` | `@tailwindcss/vite` plugin + `@` alias |
| Tailwind CSS v4 | `src/index.css` | `@import "tailwindcss"` + `@theme {}` block |
| shadcn/ui | `components.json` | Manual init (bypasses Tailwind v4 detection bug) |
| Path alias | `jsconfig.json` | `@/*` → `./src/*` |
| Package manager | `bun` | Use `bun add`, `bunx` |

---

## 7. Conventions

### Styling
- **Primary approach:** Tailwind utility classes via `cn()`
- **NeoBrutalism specifics:** Inline `style` for `boxShadow` (Tailwind v4 doesn't support arbitrary shadow strings well)
- **No Tailwind config file** — v4 uses `@theme {}` in CSS

### State Management
- **Local state:** `useState` for UI-only state
- **Data fetching:** `useFetch` hook from `@/hooks/useFetch.js`
- **No global state yet** (Zustand / Context to be added when needed)

### File Naming
- Components: `PascalCase.jsx`
- Hooks: `camelCase.js` with `use` prefix
- Pages: `PascalCasePage.jsx`
- Utils/lib: `camelCase.js`

### Import Alias
- Always use `@/` prefix (maps to `./src/`)
- Never use relative paths across directory boundaries

---

## 8. Planned Features (Backlog)

- [x] Playlists page (`/playlists`)
- [x] Playlist detail page (`/playlists/:id`)
- [x] Left sidebar with YouTube-style navigation
- [x] Channel subscription card in sidebar (`GET /channel`)
- [ ] Search page with advanced filters
- [ ] Dark mode toggle
- [ ] Infinite scroll / pagination on Home
- [ ] Channel page
- [ ] Keyboard shortcuts overlay

---

## 9. Wiki Update Rules

> The agent MUST follow these rules before ending any session:

1. **Update this file** when: new routes added, new components installed, API endpoints used, conventions established, or tooling changed.
2. **Keep it lean** — only high-signal facts. No session-specific commentary.
3. **Update the Status** in Section 1 to reflect the current phase.
4. **Add to Backlog** when user mentions new features.
5. **Never delete** existing architecture without replacing it.
