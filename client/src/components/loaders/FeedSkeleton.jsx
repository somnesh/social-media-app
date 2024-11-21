import { SkeletonLoader } from "./SkeletonLoader";

export function FeedSkeleton() {
  return (
    <div>
      <div className="flex flex-col gap-3 mt-2 dark:bg-[#282828] bg-gray-200 p-4 rounded-md">
        {/* <SkeletonLoader width="680px" height="137px" className="" /> */}
        <div className="flex gap-3">
          <SkeletonLoader
            width="12%"
            height="50px"
            className="rounded-full dark:bg-[#59595e]"
          />
          <SkeletonLoader
            width="100%"
            height="48px"
            className="dark:bg-[#59595e] w-fit"
          />
        </div>
        <div className="flex gap-2">
          <SkeletonLoader
            width="216px"
            height="40px"
            className="dark:bg-[#59595e]"
          />
          <SkeletonLoader
            width="216px"
            height="40px"
            className="dark:bg-[#59595e]"
          />
          <SkeletonLoader
            width="216px"
            height="40px"
            className="dark:bg-[#59595e]"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-4 dark:bg-[#282828] bg-gray-200 p-4 rounded-md">
        <div className="flex gap-3">
          <SkeletonLoader
            width="50px"
            height="50px"
            className="rounded-full dark:bg-[#59595e]"
          />
          <div className="flex flex-col gap-1">
            <SkeletonLoader
              width="88px"
              height="24px"
              className="dark:bg-[#59595e]"
            />
            <SkeletonLoader
              width="88px"
              height="24px"
              className="dark:bg-[#59595e]"
            />
          </div>
        </div>
        <SkeletonLoader
          width="100%"
          height="32px"
          className="dark:bg-[#59595e]"
        />
        <SkeletonLoader
          width="100%"
          height="648px"
          className="dark:bg-[#59595e]"
        />
        <div className="flex gap-2">
          <SkeletonLoader
            width="216px"
            height="40px"
            className="dark:bg-[#59595e]"
          />
          <SkeletonLoader
            width="216px"
            height="40px"
            className="dark:bg-[#59595e]"
          />
          <SkeletonLoader
            width="216px"
            height="40px"
            className="dark:bg-[#59595e]"
          />
        </div>
      </div>
    </div>
  );
}
