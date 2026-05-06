import { useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ListVideo, PlayCircle, User } from "lucide-react";
import { useFetch } from "@/hooks/useFetch";
import { getPlaylistById } from "@/lib/api";
import { VideoCard } from "@/components/VideoCard";
import { ErrorBox } from "@/components/ui/Primitives";
import { Button } from "@/components/retroui/Button";

function DetailSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-2/3" />
      <div className="h-4 bg-gray-100 rounded w-1/3" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border-2 border-black bg-white" style={{ boxShadow: "4px 4px 0 #000" }}>
            <div className="aspect-video bg-gray-200" />
            <div className="p-3 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PlaylistDetailPage() {
  const { playlistId } = useParams();
  const fetchPlaylist = useCallback(() => getPlaylistById(playlistId), [playlistId]);
  const { data, loading, error, refetch } = useFetch(fetchPlaylist, [playlistId]);

  // Shape: { data: { playlist: { id, snippet }, playlistItems: [...], channel: { info, statistics } } }
  const playlist = data?.data?.playlist || {};
  const playlistSnippet = playlist?.snippet || {};
  const items = data?.data?.playlistItems || [];
  const channelInfo = data?.data?.channel?.info || {};
  const channelStats = data?.data?.channel?.statistics || {};
  const channelThumb = channelInfo?.thumbnails?.default?.url;

  // Convert playlistItems to VideoCard-compatible shape
  // snippet.resourceId.videoId is the actual YouTube video ID
  const videoCards = items.map((item) => ({
    id: item?.snippet?.resourceId?.videoId || item.id,
    snippet: {
      title: item?.snippet?.title,
      channelTitle: item?.snippet?.videoOwnerChannelTitle || item?.snippet?.channelTitle,
      publishedAt: item?.snippet?.publishedAt,
      thumbnails: item?.snippet?.thumbnails,
    },
  }));

  const bannerThumb =
    playlistSnippet?.thumbnails?.maxres?.url ||
    playlistSnippet?.thumbnails?.standard?.url ||
    playlistSnippet?.thumbnails?.high?.url;

  if (error) {
    return (
      <main className="mx-auto max-w-screen-xl px-4 py-8">
        <ErrorBox message={error} onRetry={refetch} />
        <div className="text-center mt-6">
          <Link to="/playlists">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Playlists
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main id="playlist-detail-page" className="mx-auto max-w-screen-xl px-4 py-6">
      {/* Back button */}
      <Link to="/playlists" id="back-playlists-btn" className="inline-flex mb-6">
        <Button variant="outline" size="sm" className="gap-1.5">
          <ArrowLeft className="h-4 w-4" /> All Playlists
        </Button>
      </Link>

      {loading ? (
        <DetailSkeleton />
      ) : (
        <>
          {/* Playlist header */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            {/* Thumbnail */}
            <div
              className="shrink-0 w-full md:w-72 border-2 border-black overflow-hidden"
              style={{ boxShadow: "5px 5px 0 #000" }}
            >
              {bannerThumb ? (
                <img src={bannerThumb} alt={playlistSnippet.title} className="w-full aspect-video object-cover" />
              ) : (
                <div className="w-full aspect-video bg-yellow-100 flex items-center justify-center">
                  <ListVideo className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* Playlist info */}
            <div className="flex flex-col justify-between gap-4 flex-1">
              <div>
                <span className="inline-block bg-yellow-400 border-2 border-black text-xs font-black px-2 py-0.5 mb-2" style={{ boxShadow: "2px 2px 0 #000" }}>
                  PLAYLIST
                </span>
                <h1 className="text-3xl font-black tracking-tight leading-tight mb-2">
                  {playlistSnippet.title || "Untitled Playlist"}
                </h1>
                {playlistSnippet.description && (
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {playlistSnippet.description}
                  </p>
                )}
              </div>

              {/* Channel info row */}
              <div className="flex items-center gap-3 flex-wrap">
                {channelThumb ? (
                  <img src={channelThumb} alt={channelInfo.title} className="h-9 w-9 rounded-full border-2 border-black object-cover" />
                ) : (
                  <div className="h-9 w-9 rounded-full border-2 border-black bg-gray-200 flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                )}
                <div>
                  <p className="font-black text-sm">{channelInfo.title || playlistSnippet.channelTitle || "Channel"}</p>
                  {channelStats.subscriberCount && (
                    <p className="text-xs text-gray-500 font-mono">
                      {Number(channelStats.subscriberCount).toLocaleString()} subscribers
                    </p>
                  )}
                </div>
                <div className="flex gap-2 mt-1 md:mt-0 ml-auto">
                  <span
                    className="border-2 border-black bg-yellow-50 px-3 py-1 text-xs font-bold flex items-center gap-1"
                    style={{ boxShadow: "2px 2px 0 #000" }}
                  >
                    <PlayCircle className="h-3.5 w-3.5" />
                    {items.length} video{items.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Videos grid */}
          <div className="border-t-2 border-black pt-6">
            <h2 className="font-black text-lg mb-4">Videos in this playlist</h2>
            {videoCards.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-5xl mb-4">📭</p>
                <p className="font-bold text-lg">No videos in this playlist</p>
              </div>
            ) : (
              <div
                id="playlist-videos-grid"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
              >
                {videoCards.map((video, i) => (
                  <div key={video.id || i} className="relative">
                    {/* Position badge */}
                    <span className="absolute top-2 left-2 z-10 bg-black text-white text-xs font-mono px-1.5 py-0.5">
                      #{i + 1}
                    </span>
                    <VideoCard video={video} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </main>
  );
}
