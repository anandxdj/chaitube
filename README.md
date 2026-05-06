# ☕ ChaiTube

A high-performance, **NeoBrutalist** YouTube clone built with React 19, Vite, and Tailwind CSS v4.

![ChaiTube](https://img.shields.io/badge/Chai-Tube-FF4500?style=for-the-badge&logo=youtube&logoColor=white)
![NeoBrutalism](https://img.shields.io/badge/Design-NeoBrutalism-yellow?style=for-the-badge)

## ✨ Features

- **🎯 Rebranding:** Fully rebranded as **ChaiTube** with a custom tea emoji (☕) favicon.
- **🎨 NeoBrutalist UI:** Bold borders, high contrast, and offset shadows using the **RetroUI** component library.
- **📱 Responsive Layout:** YouTube-style sticky navbar and toggleable sidebar.
- **🏷️ Category Bar:** Horizontal scrollable pill navigation with smooth transitions and edge-fade effects.
- **🎞️ Video Grid:** Clean, YouTube-inspired video cards with channel avatars and view/date metadata.
- **🎥 Premium Player:** Integrated YouTube video player with motion animations and full-screen support.
- **📜 Playlists:** Dedicated pages for browsing and viewing channel playlists.

## 🛠️ Tech Stack

- **Core:** [React 19](https://react.dev/), [Vite 8](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **Components:** [RetroUI](https://retroui.com/), [Lucide React](https://lucide.dev/)
- **Data:** [FreeAPI](https://freeapi.app/) (YouTube Public Endpoints)
- **State/Routing:** React Router DOM v7

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Start the development server:
   ```bash
   bun run dev
   ```

## 📂 Project Structure

```
src/
├── components/       # UI Components (Navbar, Sidebar, VideoCard, CategoryBar)
├── hooks/            # Custom hooks (useFetch)
├── lib/              # API wrappers and utilities
├── pages/            # Page components (Home, Watch, Playlists)
└── assets/           # Static assets
```

## 📝 License

MIT
