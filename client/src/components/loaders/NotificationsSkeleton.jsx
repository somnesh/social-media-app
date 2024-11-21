import React from "react";

export default function NotificationsSkeleton() {
  return (
    <div className="p-4 bg-black text-white">
      <div className="h-6 dark:bg-[#59595e] rounded w-1/2 mb-4 animate-pulse"></div>
      <div className="space-y-4">
        {Array.from({ length: 14 }).map((_, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-10 h-10 dark:bg-[#59595e] rounded-full animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 dark:bg-[#59595e] rounded w-3/4 animate-pulse"></div>
              <div className="h-4 dark:bg-[#59595e] rounded w-1/2 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
