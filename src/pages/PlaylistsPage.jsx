import { useCallback } from "react";
import { Link } from "react-router-dom";
import { ListVideo, PlayCircle } from "lucide-react";
import { useFetch } from "@/hooks/useFetch";
import { getPlaylists } from "@/lib/api";
import { ErrorBox } from "@/components/ui/Primitives";

function PlaylistSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border-2 border-black bg-white animate-pulse" style={{ boxShadow: "4px 4px 0 #000" }}>
          <div className="aspect-video bg-gray-200" />
          <div className="p-3 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-100 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

function PlaylistCard({ playlist }) {
  const snippet = playlist?.snippet || {};
  const id = playlist?.id;
  const thumb =
    snippet?.thumbnails?.standard?.url ||
    snippet?.thumbnails?.high?.url ||
    snippet?.thumbnails?.medium?.url ||
    snippet?.thumbnails?.default?.url;

  return (
    <Link to={`/playlists/${id}`} id={`playlist-card-${id}`} className="group block focus:outline-none">
      <article
        className="border-2 border-black bg-white overflow-hidden transition-transform duration-200 group-hover:-translate-y-1 group-hover:-translate-x-0.5"
        style={{ boxShadow: "4px 4px 0 #000" }}
      >
        <div className="relative aspect-video overflow-hidden bg-gray-100">
          {thumb ? (
            <img src={thumb} alt={snippet.title || "Playlist"} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-yellow-100">
              <ListVideo className="h-12 w-12 text-gray-400" />
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
            <PlayCircle className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
          </div>
          <span className="absolute bottom-1.5 right-1.5 bg-black text-white text-xs font-bold px-2 py-0.5 flex items-center gap-1">
            <ListVideo className="h-3 w-3" /> Playlist
          </span>
        </div>
        <div className="p-3">
          <h3 className="font-black text-sm leading-tight line-clamp-2 mb-1">{snippet.title || "Untitled Playlist"}</h3>
          <p className="text-xs text-gray-600 font-medium truncate">{snippet.channelTitle || "Unknown Channel"}</p>
          {snippet.description && (
            <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-snug">{snippet.description}</p>
          )}
        </div>
      </article>
    </Link>
  );
}

export default function PlaylistsPage() {
  const fetchPlaylists = useCallback(() => getPlaylists({ page: 1, limit: 20 }), []);
  const { data, loading, error, refetch } = useFetch(fetchPlaylists, []);
  const rawItems = data?.data?.data || [];
  const playlists = rawItems.filter(Boolean);

  return (
    <main id="playlists-page" className="mx-auto max-w-screen-xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
          <ListVideo className="h-7 w-7 text-yellow-500" /> Playlists
        </h1>
        {!loading && playlists.length > 0 && (
          <p className="text-sm text-gray-500 mt-0.5 font-medium">{data?.data?.totalItems || playlists.length} playlists</p>
        )}
      </div>
      {loading ? (
        <PlaylistSkeleton count={8} />
      ) : error ? (
        <ErrorBox message={error} onRetry={refetch} />
      ) : playlists.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">📂</p>
          <p className="font-bold text-lg">No playlists found</p>
        </div>
      ) : (
        <div id="playlists-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {playlists.map((pl) => (
            <PlaylistCard key={pl.id} playlist={pl} />
          ))}
        </div>
      )}
    </main>
  );
}
