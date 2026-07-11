import React from "react";

const LoadingState = ({
  type = "table", // "table" | "grid" | "list"
  count = 4,
  className = "",
}) => {
  const shimmerClass = "animate-pulse bg-[#1f2937]/75 rounded-xl";

  if (type === "grid") {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-[#111827] border border-white/8 p-5 rounded-2xl h-32 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <div className={`${shimmerClass} w-24 h-3`} />
              <div className={`${shimmerClass} w-7 h-7`} />
            </div>
            <div className={`${shimmerClass} w-16 h-8 mt-4`} />
          </div>
        ))}
      </div>
    );
  }

  if (type === "list") {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-[#111827] border border-white/8 p-5 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className={`${shimmerClass} w-9 h-9 rounded-full`} />
              <div className="space-y-2 flex-1 max-w-sm">
                <div className={`${shimmerClass} w-full h-3`} />
                <div className={`${shimmerClass} w-2/3 h-2`} />
              </div>
            </div>
            <div className={`${shimmerClass} w-16 h-6`} />
          </div>
        ))}
      </div>
    );
  }

  // Default: Table skeleton
  return (
    <div className={`w-full bg-[#111827] border border-white/8 rounded-2xl overflow-hidden shadow-xl ${className}`}>
      <div className="px-6 py-4 bg-[#0c0b10] border-b border-white/8">
        <div className={`${shimmerClass} w-40 h-4`} />
      </div>
      <div className="p-6 space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex justify-between gap-4 items-center border-b border-white/5 pb-4 last:border-b-0 last:pb-0">
            <div className={`${shimmerClass} w-1/4 h-3`} />
            <div className={`${shimmerClass} w-1/5 h-3`} />
            <div className={`${shimmerClass} w-1/6 h-3`} />
            <div className={`${shimmerClass} w-10 h-3`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingState;
