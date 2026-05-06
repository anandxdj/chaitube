import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { VideoCard } from "@/components/VideoCard";
import { VideoGridSkeleton, ErrorBox, FilterPills } from "@/components/ui/Primitives";
import { CategoryBar } from "@/components/CategoryBar";
import { Button } from "@/components/retroui/Button";
import { getVideos } from "@/lib/api";

const SORT_OPTIONS = [
  { label: "Latest", value: "latest" },
  { label: "Oldest", value: "oldest" },
  { label: "Most Viewed", value: "mostViewed" },
  { label: "Most Liked", value: "mostLiked" },
];

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [sortBy, setSortBy] = useState("latest");
  const [category, setCategory] = useState("All");

  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [totalItems, setTotalItems] = useState(0);

  // Combine search query and category
  const effectiveQuery = category !== "All" 
    ? (query ? `${query} ${category}` : category) 
    : query;

  const loadVideos = useCallback(async (pageNum, isAppend = false) => {
    if (isAppend) setLoadingMore(true);
    else {
      setLoading(true);
      setError(null);
    }

    try {
      const response = await getVideos({ 
        page: pageNum, 
        limit: 12, 
        query: effectiveQuery, 
        sortBy 
      });
      
      const rawItems = response?.data?.data || [];
      const newVideos = rawItems.map((entry) => entry.items || entry).filter(Boolean);
      
      setVideos(prev => isAppend ? [...prev, ...newVideos] : newVideos);
      setTotalItems(response?.data?.totalItems || 0);
      setPage(pageNum);
    } catch (err) {
      setError(err.message || "Failed to load videos");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [effectiveQuery, sortBy]);

  // Reset and fetch when filters change
  useEffect(() => {
    loadVideos(1, false);
  }, [loadVideos]);

  const handleLoadMore = () => {
    loadVideos(page + 1, true);
  };

  const hasMore = videos.length < totalItems;

  return (
    <>
      {/* Category filter bar — sticky below the navbar */}
      <CategoryBar selected={category} onSelect={setCategory} />

      <main id="home-page" className="mx-auto max-w-screen-xl px-4 py-6">
      {/* Page header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">
            {query ? (
              <>
                Results for{" "}
                <span
                  className="border-b-4 border-yellow-400"
                >
                  "{query}"
                </span>
              </>
            ) : (
              "Chill Videos"
            )}
          </h1>
          {!loading && videos.length > 0 && (
            <p className="text-sm text-gray-500 mt-0.5 font-medium">
              {totalItems || videos.length} videos
            </p>
          )}
        </div>
        <FilterPills options={SORT_OPTIONS} selected={sortBy} onSelect={setSortBy} />
      </div>

      {/* Content */}
      {loading ? (
        <VideoGridSkeleton count={12} />
      ) : error ? (
        <ErrorBox message={error} onRetry={() => loadVideos(1, false)} />
      ) : videos.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">📭</p>
          <p className="font-bold text-lg">No videos found</p>
          {query && (
            <p className="text-gray-500 mt-1">Try a different search term</p>
          )}
        </div>
      ) : (
        <>
          <div
            id="video-grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8"
          >
            {videos.map((video, idx) => (
              <VideoCard key={`${video.id || video._id}-${idx}`} video={video} />
            ))}
          </div>

          {/* Pagination */}
          {hasMore && (
            <div className="mt-12 flex justify-center pb-12">
              <Button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="min-w-[200px] text-lg py-6"
              >
                {loadingMore ? "CHURNING..." : "LOAD MORE VIDEOS"}
              </Button>
            </div>
          )}
          
          {!hasMore && videos.length > 0 && (
            <p className="text-center text-gray-500 mt-12 italic">You've reached the end of the tea party ☕</p>
          )}
        </>
      )}
    </main>
    </>
  );
}
