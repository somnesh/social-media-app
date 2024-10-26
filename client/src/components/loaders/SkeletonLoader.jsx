import { Skeleton } from "../ui/skeleton";

export function SkeletonLoader({ width, height, className = "" }) {
  return (
    <Skeleton
      className={`bg-gray-300 ${className}`}
      style={{ width, height }}
    />
  );
}
