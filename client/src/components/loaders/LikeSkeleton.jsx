import { SkeletonLoader } from "./SkeletonLoader";

export function LikeSkeleton() {
  return (
    <div className="mt-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <SkeletonLoader
          width="50px"
          height="50px"
          className="rounded-full dark:bg-[#59595e]"
        />
        <SkeletonLoader
          width="300px"
          height="30px"
          className="dark:bg-[#59595e]"
        />
      </div>
      <div className="flex items-center gap-2">
        <SkeletonLoader
          width="50px"
          height="50px"
          className="rounded-full dark:bg-[#59595e]"
        />
        <SkeletonLoader
          width="300px"
          height="30px"
          className="dark:bg-[#59595e]"
        />
      </div>
      <div className="flex items-center gap-2">
        <SkeletonLoader
          width="50px"
          height="50px"
          className="rounded-full dark:bg-[#59595e]"
        />
        <SkeletonLoader
          width="300px"
          height="30px"
          className="dark:bg-[#59595e]"
        />
      </div>
    </div>
  );
}
