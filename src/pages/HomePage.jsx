import { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { VideoCard } from "@/components/VideoCard";
import { VideoGridSkeleton, ErrorBox, FilterPills } from "@/components/ui/Primitives";
import { CategoryBar } from "@/components/CategoryBar";
import { useFetch } from "@/hooks/useFetch";
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

  const fetchVideos = useCallback(
    () => getVideos({ page: 1, limit: 24, query, sortBy }),
    [query, sortBy]
  );

  const { data, loading, error, refetch } = useFetch(fetchVideos, [query, sortBy]);

  // API shape: { data: { data: [ { items: { id, snippet, statistics, contentDetails } } ] } }
  const rawItems = data?.data?.data || [];
  const videos = rawItems.map((entry) => entry.items || entry).filter(Boolean);

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
              {data?.data?.totalItems || videos.length} videos
            </p>
          )}
        </div>
        <FilterPills options={SORT_OPTIONS} selected={sortBy} onSelect={setSortBy} />
      </div>

      {/* Content */}
      {loading ? (
        <VideoGridSkeleton count={12} />
      ) : error ? (
        <ErrorBox message={error} onRetry={refetch} />
      ) : videos.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">📭</p>
          <p className="font-bold text-lg">No videos found</p>
          {query && (
            <p className="text-gray-500 mt-1">Try a different search term</p>
          )}
        </div>
      ) : (
        <div
          id="video-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8"
        >
          {videos.map((video) => (
            <VideoCard key={video.id || video._id} video={video} />
          ))}
        </div>
      )}
    </main>
    </>
  );
}
