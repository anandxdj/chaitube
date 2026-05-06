import { cn } from "@/lib/utils";

/**
 * Loading skeleton for video grid
 */
export function VideoGridSkeleton({ count = 9 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-video bg-gray-200 border-2 border-black" style={{ boxShadow: "3px 3px 0 #000" }} />
          <div className="flex gap-2.5 pt-2.5">
            <div className="h-9 w-9 rounded-full bg-gray-200 border-2 border-black shrink-0" />
            <div className="flex-1 space-y-2 pt-0.5">
              <div className="h-3.5 bg-gray-200 rounded w-full" />
              <div className="h-3.5 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Error display
 */
export function ErrorBox({ message, onRetry }) {
  return (
    <div
      className="border-2 border-black bg-red-50 p-6 text-center max-w-md mx-auto mt-12"
      style={{ boxShadow: "4px 4px 0 #000" }}
    >
      <p className="font-bold text-red-700 mb-3">⚠️ {message || "Something went wrong"}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="border-2 border-black bg-yellow-400 px-4 py-1.5 font-bold text-sm hover:bg-yellow-500 transition-colors"
          style={{ boxShadow: "3px 3px 0 #000" }}
        >
          Try Again
        </button>
      )}
    </div>
  );
}

/**
 * Filter/Sort pill tabs
 */
export function FilterPills({ options, selected, onSelect }) {
  return (
    <div id="filter-pills" className="flex gap-2 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt.value}
          id={`filter-${opt.value}`}
          onClick={() => onSelect(opt.value)}
          className={cn(
            "border-2 border-black px-3 py-1 text-sm font-bold transition-all duration-150",
            selected === opt.value
              ? "bg-black text-white -translate-y-0.5"
              : "bg-white hover:bg-yellow-400 hover:-translate-y-0.5"
          )}
          style={{ boxShadow: "3px 3px 0 #000" }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
