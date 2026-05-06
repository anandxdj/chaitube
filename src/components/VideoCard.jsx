import { Link } from "react-router-dom";

/* ─── Helpers ──────────────────────────────────────────────── */
function formatCount(n) {
  if (!n && n !== 0) return "0";
  const num = Number(n);
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return String(num);
}

function timeAgo(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  const mo = Math.floor(d / 30);
  const y = Math.floor(d / 365);
  if (y >= 1) return `${y} year${y > 1 ? "s" : ""} ago`;
  if (mo >= 1) return `${mo} month${mo > 1 ? "s" : ""} ago`;
  if (d >= 1) return `${d} day${d > 1 ? "s" : ""} ago`;
  if (h >= 1) return `${h} hour${h > 1 ? "s" : ""} ago`;
  if (m >= 1) return `${m} minute${m > 1 ? "s" : ""} ago`;
  return "Just now";
}

function formatDuration(iso) {
  if (!iso) return "";
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "";
  const h = parseInt(match[1] || "0");
  const m = parseInt(match[2] || "0");
  const s = parseInt(match[3] || "0");
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** Channel avatar placeholder — initial letter with a hashed colour */
function ChannelAvatar({ name }) {
  const colors = [
    "bg-red-400", "bg-orange-400", "bg-yellow-500", "bg-green-500",
    "bg-teal-500", "bg-blue-500", "bg-indigo-500", "bg-purple-500",
  ];
  const idx = (name?.charCodeAt(0) || 0) % colors.length;
  return (
    <span
      className={`h-9 w-9 rounded-full shrink-0 flex items-center justify-center text-white text-sm font-black border-2 border-black ${colors[idx]}`}
    >
      {(name?.[0] || "?").toUpperCase()}
    </span>
  );
}

/**
 * VideoCard — YouTube-style: thumbnail → [avatar | title + channel + meta]
 */
export function VideoCard({ video }) {
  const snippet = video?.snippet || {};
  const stats   = video?.statistics || {};
  const videoId = video?.id || video?.videoId || snippet?.resourceId?.videoId;
  const duration = video?.contentDetails?.duration;
  const thumb =
    snippet?.thumbnails?.high?.url ||
    snippet?.thumbnails?.medium?.url ||
    snippet?.thumbnails?.default?.url ||
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  const channel = snippet.channelTitle || snippet.videoOwnerChannelTitle || "Unknown";

  return (
    <Link
      to={`/watch/${videoId}`}
      id={`video-card-${videoId}`}
      className="group block focus:outline-none"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden rounded-none bg-gray-100 border-2 border-black"
           style={{ boxShadow: "3px 3px 0 #000" }}>
        <img
          src={thumb}
          alt={snippet.title || "Video thumbnail"}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {duration && (
          <span className="absolute bottom-1.5 right-1.5 bg-black/90 text-white text-xs font-mono px-1.5 py-0.5 rounded-sm leading-none">
            {formatDuration(duration)}
          </span>
        )}
      </div>

      {/* Meta row */}
      <div className="flex gap-2.5 pt-2.5 px-0.5">
        <ChannelAvatar name={channel} />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm leading-snug line-clamp-2 text-gray-900 mb-0.5 group-hover:text-black">
            {snippet.title || "Untitled"}
          </h3>
          <p className="text-xs text-gray-500 truncate">{channel} {stats.viewCount ? `${formatCount(stats.viewCount)} views` : ""}
            {stats.viewCount && snippet.publishedAt ? " · " : ""}
            {snippet.publishedAt ? timeAgo(snippet.publishedAt) : ""}</p>
          <p className="text-xs text-gray-500">
           
          </p>
        </div>
      </div>
    </Link>
  );
}
