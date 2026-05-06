import { useState } from "react";
import { Search, Menu, Bell, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/retroui/Button";

export function Navbar({ onSearch, onToggleSidebar }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch?.(query.trim());
      navigate(`/?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header
      id="navbar"
      className="sticky top-0 z-50 w-full border-b-2 border-black bg-white"
      style={{ boxShadow: "0 2px 0 #000" }}
    >
      <div className="flex h-14 items-center gap-3 px-3">
        {/* Hamburger — toggles sidebar on all sizes */}
        <button
          id="sidebar-toggle-btn"
          onClick={onToggleSidebar}
          className="flex items-center justify-center h-9 w-9 border-2 border-black bg-white hover:bg-yellow-400 transition-colors shrink-0"
          style={{ boxShadow: "2px 2px 0 #000" }}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Logo */}
        <Link
          to="/"
          id="nav-logo"
          className="flex shrink-0 items-center gap-1 font-black text-lg tracking-tight"
        >
          {/* YouTube-style play icon */}
          <span className="flex items-center justify-center h-7 w-7 bg-red-600 border-2 border-black" style={{ boxShadow: "2px 2px 0 #000" }}>
            <svg viewBox="0 0 24 24" fill="white" className="h-4 w-4">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span>Chai<span className="text-red-600">Tube</span></span>
        </Link>

        {/* Search bar */}
        <form onSubmit={handleSubmit} className="flex flex-1 items-center max-w-xl mx-auto">
          <div
            className="flex flex-1 items-center border-2 border-black bg-white overflow-hidden"
            style={{ boxShadow: "3px 3px 0 #000" }}
          >
            <input
              id="search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search videos..."
              className="flex-1 px-3 py-1.5 text-sm outline-none font-medium"
            />
            <button
              id="search-btn"
              type="submit"
              className="flex items-center justify-center border-l-2 border-black px-3 py-1.5 bg-yellow-400 hover:bg-yellow-500 transition-colors"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </form>

        {/* Nav actions */}
        <div className="flex items-center gap-2">
          <button
            className="hidden md:flex items-center justify-center h-9 w-9 border-2 border-black bg-white hover:bg-yellow-100 transition-colors"
            style={{ boxShadow: "2px 2px 0 #000" }}
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>
          <button
            className="hidden md:flex items-center gap-1.5 border-2 border-black bg-white px-3 py-1 text-sm font-bold hover:bg-yellow-400 transition-colors"
            style={{ boxShadow: "2px 2px 0 #000" }}
          >
            <User className="h-4 w-4" />
            Sign in
          </button>
        </div>
      </div>
    </header>
  );
}
