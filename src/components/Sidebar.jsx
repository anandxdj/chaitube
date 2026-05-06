import { useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Clapperboard,
  History,
  ListVideo,
  Clock,
  ThumbsUp,
  PlaySquare,
  Download,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Music2,
  Film,
  Flame,
  Bell,
  Users,
} from "lucide-react";
import { useFetch } from "@/hooks/useFetch";
import { getChannel } from "@/lib/api";
import { cn } from "@/lib/utils";

/* ─── Nav item ─────────────────────────────────────────────── */
function NavItem({ to, icon: Icon, label, active }) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-4 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 group",
        active
          ? "bg-yellow-400 font-black border-2 border-black"
          : "hover:bg-yellow-100 hover:font-black"
      )}
      style={active ? { boxShadow: "2px 2px 0 #000" } : {}}
    >
      <Icon
        className={cn(
          "h-5 w-5 shrink-0 transition-transform group-hover:scale-110",
          active ? "text-black" : "text-gray-700"
        )}
      />
      <span className="truncate">{label}</span>
    </Link>
  );
}

/* ─── Section heading ───────────────────────────────────────── */
function SectionHeading({ label }) {
  return (
    <p className="px-3 pt-4 pb-1 text-xs font-black uppercase tracking-widest text-gray-500 border-t-2 border-black/10 mt-2">
      {label}
    </p>
  );
}

/* ─── Channel subscription card ────────────────────────────── */
function ChannelCard() {
  const [subscribed, setSubscribed] = useState(true);
  const fetchChannel = useCallback(() => getChannel(), []);
  const { data, loading } = useFetch(fetchChannel, []);

  const info = data?.data?.info?.snippet || {};
  const stats = data?.data?.info?.statistics || {};
  const thumb = info?.thumbnails?.default?.url;

  function formatSubs(n) {
    const num = Number(n);
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return String(num || "");
  }

  if (loading) {
    return (
      <div className="mx-3 mt-4 border-2 border-black bg-white p-3 animate-pulse space-y-2"
        style={{ boxShadow: "3px 3px 0 #000" }}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-200 shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 bg-gray-200 rounded w-3/4" />
            <div className="h-2.5 bg-gray-100 rounded w-1/2" />
          </div>
        </div>
        <div className="h-8 bg-gray-200 rounded" />
      </div>
    );
  }

  return (
    <div
      className="mx-3 mt-4 border-2 border-black bg-white p-3"
      style={{ boxShadow: "3px 3px 0 #000" }}
    >
      {/* Channel avatar + name */}
      <div className="flex items-center gap-2.5 mb-3">
        {thumb ? (
          <img
            src={thumb}
            alt={info.title}
            className="h-10 w-10 rounded-full border-2 border-black object-cover shrink-0"
          />
        ) : (
          <div className="h-10 w-10 rounded-full border-2 border-black bg-gray-200 shrink-0" />
        )}
        <div className="min-w-0">
          <p className="font-black text-sm truncate leading-tight">{info.title || "Channel"}</p>
          <p className="text-xs text-gray-500 font-mono truncate">
            {info.customUrl || ""} · {formatSubs(stats.subscriberCount)} subs
          </p>
        </div>
      </div>

      {/* Subscribe / Subscribed toggle */}
      <button
        onClick={() => setSubscribed((s) => !s)}
        className={cn(
          "w-full flex items-center justify-center gap-2 border-2 border-black py-1.5 text-sm font-black transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0",
          subscribed
            ? "bg-gray-100 text-black hover:bg-gray-200"
            : "bg-yellow-400 text-black hover:bg-yellow-500"
        )}
        style={{ boxShadow: "3px 3px 0 #000" }}
      >
        {subscribed ? (
          <>
            <Bell className="h-4 w-4" />
            Subscribed
          </>
        ) : (
          <>
            <Users className="h-4 w-4" />
            Subscribe
          </>
        )}
      </button>

      {/* Subscriber + video count */}
      <div className="mt-2 flex gap-3 text-xs text-gray-500 font-mono justify-center">
        <span>{formatSubs(stats.viewCount)} views</span>
        <span>·</span>
        <span>{stats.videoCount} videos</span>
      </div>
    </div>
  );
}

/* ─── Main Sidebar ──────────────────────────────────────────── */
export function Sidebar({ open, onClose }) {
  const location = useLocation();
  const path = location.pathname;

  const [showMoreYou, setShowMoreYou] = useState(false);
  const [showMoreExplore, setShowMoreExplore] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        id="sidebar"
        className={cn(
          "fixed top-14 left-0 z-40 h-[calc(100vh-3.5rem)] w-60 overflow-y-auto bg-yellow-50 border-r-2 border-black transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:static lg:h-auto lg:z-auto lg:shrink-0"
        )}
      >
        <nav className="py-2 pb-8">
          {/* Main nav */}
          <div className="px-1 space-y-0.5">
            <NavItem to="/" icon={Home} label="Home" active={path === "/"} />
            <NavItem to="/" icon={ListVideo} label="Shorts" active={path === "/shorts"} />
          </div>

          {/* You section */}
          <SectionHeading label="You" />
          <div className="px-1 space-y-0.5">
            <NavItem to="/" icon={Clapperboard} label="Your channel" active={false} />
            <NavItem to="/" icon={History} label="History" active={false} />
            <NavItem to="/playlists" icon={ListVideo} label="Playlists" active={path.startsWith("/playlists")} />
            <NavItem to="/" icon={Clock} label="Watch later" active={false} />
            <NavItem to="/" icon={ThumbsUp} label="Liked videos" active={false} />
            {showMoreYou && (
              <>
                <NavItem to="/" icon={PlaySquare} label="Your videos" active={false} />
                <NavItem to="/" icon={Download} label="Downloads" active={false} />
              </>
            )}
          </div>
          <button
            onClick={() => setShowMoreYou((s) => !s)}
            className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-600 hover:text-black hover:bg-yellow-100 rounded-lg w-full transition-colors"
          >
            {showMoreYou ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {showMoreYou ? "Show less" : "Show more"}
          </button>

          {/* Explore section */}
          <SectionHeading label="Explore" />
          <div className="px-1 space-y-0.5">
            <NavItem to="/?q=trending" icon={Flame} label="Trending" active={false} />
            <NavItem to="/?q=shopping" icon={ShoppingBag} label="Shopping" active={false} />
            <NavItem to="/?q=music" icon={Music2} label="Music" active={false} />
            {showMoreExplore && (
              <NavItem to="/?q=movies" icon={Film} label="Movies" active={false} />
            )}
          </div>
          <button
            onClick={() => setShowMoreExplore((s) => !s)}
            className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-600 hover:text-black hover:bg-yellow-100 rounded-lg w-full transition-colors"
          >
            {showMoreExplore ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {showMoreExplore ? "Show less" : "Show more"}
          </button>

          {/* Subscriptions / Channel card */}
          <SectionHeading label="Subscriptions" />
          <ChannelCard />
        </nav>
      </aside>
    </>
  );
}
