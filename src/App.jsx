import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import HomePage from "@/pages/HomePage";
import WatchPage from "@/pages/WatchPage";
import PlaylistsPage from "@/pages/PlaylistsPage";
import PlaylistDetailPage from "@/pages/PlaylistDetailPage";
import "./App.css";

/** Inner shell — uses useLocation, must live inside BrowserRouter */
function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Hide sidebar when watching a video
  const isWatchPage = location.pathname.startsWith("/watch/");

  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col">
      <Navbar onToggleSidebar={() => setSidebarOpen((o) => !o)} />

      <div className="flex flex-1 relative">
        {/* Sidebar: hidden entirely on watch pages */}
        {!isWatchPage && (
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}

        <div className="flex-1 min-w-0 overflow-x-hidden">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/watch/:videoId" element={<WatchPage />} />
            <Route path="/playlists" element={<PlaylistsPage />} />
            <Route path="/playlists/:playlistId" element={<PlaylistDetailPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
