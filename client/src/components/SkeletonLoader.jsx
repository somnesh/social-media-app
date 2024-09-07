import { Skeleton } from "./ui/skeleton";

export function SkeletonLoader({ width = "100%", height = "20px", className = "" }) {
  return (
    <Skeleton
      className={`bg-gray-300 ${className}`}
      style={{ width, height }}
    />
  );
}
