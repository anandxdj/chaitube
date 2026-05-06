import { useRef, useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "All",
  "Music",
  "News",
  "Mixes",
  "R. D. Burman",
  "Source code",
  "AI",
  "Jukebox",
  "Indian classical music",
  "Computer Hardware",
  "Lo-fi",
  "Indian pop music",
  "Bollywood",
  "Jazz",
  "Podcasts",
  "Live",
  "Gaming",
  "Recently uploaded",
];

export function CategoryBar({ selected, onSelect }) {
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 8);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    checkScroll();
    return () => el.removeEventListener("scroll", checkScroll);
  }, []);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 300, behavior: "smooth" });
  };

  return (
    <div
      id="category-bar"
      className="sticky top-1 z-40 bg-white border-b-2 border-black"
      style={{ boxShadow: "0 2px 0 #000" }}
    >
      <div className="relative flex items-center max-w-screen-xl mx-auto">
        {/* Left fade + chevron */}
        {showLeft && (
          <div className="absolute left-0 z-10 flex items-center h-full pointer-events-none">
            <div className="w-10 h-full bg-gradient-to-r from-white to-transparent" />
            <button
              onClick={() => scroll(-1)}
              className="pointer-events-auto absolute left-0 flex items-center justify-center h-9 w-9 border-2 border-black bg-white hover:bg-yellow-400 transition-colors shrink-0 ml-1"
              style={{ boxShadow: "2px 2px 0 #000" }}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Scrollable pills */}
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-2.5"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              id={`category-${cat.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => onSelect(cat)}
              className={cn(
                "shrink-0 px-3.5 py-1 text-sm font-bold border-2 border-black transition-all duration-150 whitespace-nowrap",
                selected === cat
                  ? "bg-black text-white -translate-y-0.5"
                  : "bg-white hover:bg-yellow-400 hover:-translate-y-0.5"
              )}
              style={{ boxShadow: "3px 3px 0 #000" }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Right fade + chevron */}
        {showRight && (
          <div className="absolute right-0 z-10 flex items-center h-full pointer-events-none">
            <div className="w-10 h-full bg-gradient-to-l from-white to-transparent" />
            <button
              onClick={() => scroll(1)}
              className="pointer-events-auto absolute right-0 flex items-center justify-center h-9 w-9 border-2 border-black bg-white hover:bg-yellow-400 transition-colors shrink-0 mr-1"
              style={{ boxShadow: "2px 2px 0 #000" }}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
