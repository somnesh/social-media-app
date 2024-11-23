import { Skeleton } from "../ui/skeleton";
import { SkeletonLoader } from "./SkeletonLoader";

export function FeedSkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Create Post Section */}
      <div className="px-4 pb-3 pt-4 space-y-4 mb-2 sm:rounded-lg dark:bg-[#282828] bg-gray-200">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full bg-gray-300 dark:bg-[#59595e]" />
          <Skeleton className="h-10 flex-1 rounded-full bg-gray-300 dark:bg-[#59595e]" />
        </div>
        <div className="flex items-center gap-4 justify-between border-t dark:border-[#3a3b3c] border-[#cbcbcb] pt-3">
          <Skeleton className="w-full h-8 bg-gray-300 dark:bg-[#59595e]" />
          <Skeleton className="w-full h-8 bg-gray-300 dark:bg-[#59595e]" />
          <Skeleton className="w-full h-8 bg-gray-300 dark:bg-[#59595e]" />
        </div>
      </div>

      {/* Feed Posts */}
      {[1, 2].map((post) => (
        <div
          key={post}
          className="p-4 space-y-4 mb-2 sm:rounded-lg dark:bg-[#282828] bg-gray-200"
        >
          {/* Post Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="bg-gray-300 dark:bg-[#59595e] w-10 h-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="bg-gray-300 dark:bg-[#59595e] w-32 h-4" />
                <Skeleton className="bg-gray-300 dark:bg-[#59595e] w-24 h-3" />
              </div>
            </div>
            <Skeleton className="bg-gray-300 dark:bg-[#59595e] w-8 h-8" />
          </div>

          {/* Post Content */}
          <div className="space-y-3">
            <Skeleton className="bg-gray-300 dark:bg-[#59595e] w-3/4 h-4" />
            <Skeleton className="bg-gray-300 dark:bg-[#59595e] w-full h-96 rounded-lg" />
          </div>

          {/* Engagement Stats */}
          <div className="flex justify-between gap-4 text-sm">
            <Skeleton className="bg-gray-300 dark:bg-[#59595e] w-16 h-4" />
            <div className="flex gap-2 text-sm">
              <Skeleton className="bg-gray-300 dark:bg-[#59595e] w-16 h-4" />
              <Skeleton className="bg-gray-300 dark:bg-[#59595e] w-12 h-4" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 justify-between border-t dark:border-[#3a3b3c] border-[#cbcbcb] pt-3">
            <Skeleton className="bg-gray-300 dark:bg-[#59595e] w-full h-8" />
            <Skeleton className="bg-gray-300 dark:bg-[#59595e] w-full h-8" />
            <Skeleton className="bg-gray-300 dark:bg-[#59595e] w-full h-8" />
          </div>
        </div>
      ))}
    </div>
  );
}
