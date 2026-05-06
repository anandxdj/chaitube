import { useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Eye, ThumbsUp, MessageCircle, Share2 } from "lucide-react";
import { YouTubePlayer } from "@/components/ui/youtube-video-player";
import { VideoCard } from "@/components/VideoCard";
import { VideoGridSkeleton, ErrorBox } from "@/components/ui/Primitives";
import { Button } from "@/components/retroui/Button";
import { useFetch } from "@/hooks/useFetch";
import { getVideoById, getVideoComments, getRelatedVideos } from "@/lib/api";

function formatCount(n) {
  if (!n && n !== 0) return "—";
  const num = Number(n);
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return String(num);
}

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function WatchPage() {
  const { videoId } = useParams();

  const fetchVideo = useCallback(() => getVideoById(videoId), [videoId]);
  const fetchComments = useCallback(() => getVideoComments(videoId), [videoId]);
  const fetchRelated = useCallback(
    () => getRelatedVideos(videoId, { limit: 10 }),
    [videoId]
  );

  const { data: videoData, loading: vLoading, error: vError } = useFetch(fetchVideo, [videoId]);
  const { data: commentsData, loading: cLoading } = useFetch(fetchComments, [videoId]);
  const { data: relatedData, loading: rLoading } = useFetch(fetchRelated, [videoId]);

  // Single video: { data: { video: { items: { id, snippet, statistics, contentDetails } }, channel: {...} } }
  const video = videoData?.data?.video?.items || videoData?.data;
  const snippet = video?.snippet || {};
  const stats = video?.statistics || {};
  const channelInfo = videoData?.data?.channel?.info || {};
  // Related videos: same shape as /videos list
  const rawRelated = relatedData?.data?.data || [];
  const relatedVideos = rawRelated.map((e) => e.items || e).filter(Boolean);
  // Comments: flat array at data.data (not paginated)
  const comments = commentsData?.data || [];

  if (vError) {
    return (
      <main className="mx-auto max-w-screen-xl px-4 py-8">
        <ErrorBox message={vError} />
        <div className="text-center mt-6">
          <Link to="/">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main id="watch-page" className="mx-auto max-w-screen-xl px-4 py-6">


      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main column */}
        <div className="flex-1 min-w-0">
          {/* YouTube Player */}
          {vLoading ? (
            <div
              className="aspect-video bg-gray-200 animate-pulse border-2 border-black"
              style={{ boxShadow: "4px 4px 0 #000" }}
            />
          ) : (
            <YouTubePlayer
              videoId={videoId}
              title={snippet.title}
              containerClassName="border-2 border-black"
              playerClassName=""
            />
          )}

          {/* Video info */}
          <div
            className="mt-4 border-2 border-black bg-white p-4"
            style={{ boxShadow: "4px 4px 0 #000" }}
          >
            {vLoading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
              </div>
            ) : (
              <>
                <h1 className="text-xl font-black leading-snug mb-2">
                  {snippet.title || "Untitled"}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                  <span className="font-bold">{snippet.channelTitle}</span>
                  <span className="font-mono">{formatDate(snippet.publishedAt)}</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Eye className="h-4 w-4" /> {formatCount(stats.viewCount)} views
                  </span>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 flex-wrap mb-4">
                  <Button variant="secondary" size="sm" className="gap-1.5">
                    <ThumbsUp className="h-4 w-4" />
                    {formatCount(stats.likeCount)}
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <MessageCircle className="h-4 w-4" />
                    {formatCount(stats.commentCount)}
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Share2 className="h-4 w-4" /> Share
                  </Button>
                </div>

                {/* Description */}
                {snippet.description && (
                  <details className="group">
                    <summary className="cursor-pointer font-bold text-sm select-none list-none flex items-center gap-1 hover:text-yellow-600 transition-colors">
                      Description
                      <span className="group-open:rotate-180 transition-transform">▾</span>
                    </summary>
                    <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {snippet.description}
                    </p>
                  </details>
                )}
              </>
            )}
          </div>

          {/* Comments */}
          <div
            className="mt-4 border-2 border-black bg-white p-4"
            style={{ boxShadow: "4px 4px 0 #000" }}
          >
            <h2 className="font-black text-lg mb-4">
              Comments{" "}
              {stats.commentCount && (
                <span className="font-mono text-sm text-gray-500">
                  ({formatCount(stats.commentCount)})
                </span>
              )}
            </h2>

            {cLoading ? (
              <div className="space-y-3 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-200 shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-gray-200 rounded w-1/4" />
                      <div className="h-3 bg-gray-100 rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : comments.length === 0 ? (
              <p className="text-gray-500 text-sm">No comments yet.</p>
            ) : (
              <ul className="space-y-4" id="comments-list">
                {comments.slice(0, 20).map((c) => {
                  const top = c?.snippet?.topLevelComment?.snippet || {};
                  return (
                    <li key={c.id} className="flex gap-3">
                      <img
                        src={top.authorProfileImageUrl || "https://api.dicebear.com/7.x/thumbs/svg?seed=" + c.id}
                        alt={top.authorDisplayName}
                        className="h-8 w-8 rounded-full border-2 border-black shrink-0 object-cover"
                      />
                      <div>
                        <p className="font-bold text-xs mb-0.5">
                          {top.authorDisplayName}{" "}
                          <span className="font-mono text-gray-400 font-normal">
                            · {formatCount(top.likeCount)} ❤
                          </span>
                        </p>
                        <p className="text-sm text-gray-700 leading-snug">{top.textDisplay}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Sidebar — Related videos */}
        <aside id="related-sidebar" className="w-full lg:w-80 shrink-0">
          <h2 className="font-black text-lg mb-4 border-b-2 border-black pb-2">
            Related Videos
          </h2>
          {rLoading ? (
            <VideoGridSkeleton count={5} />
          ) : (
            <div className="flex flex-col gap-4">
              {relatedVideos.map((v) => (
                <VideoCard key={v.id || v._id} video={v} />
              ))}
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
