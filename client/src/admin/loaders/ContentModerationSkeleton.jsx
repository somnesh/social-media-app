import { Skeleton } from "@/components/ui/skeleton";

export function ContentModerationSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <Skeleton className="h-9 w-[250px] bg-gray-300 dark:bg-muted" />
      <div className="dark:border rounded-lg bg-white dark:bg-inherit">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-8 w-[200px] bg-gray-300 dark:bg-muted" />
            <Skeleton className="h-8 w-[100px] bg-gray-300 dark:bg-muted" />
          </div>
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 bg-gray-300 dark:bg-muted" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[100px] bg-gray-300 dark:bg-muted" />
                    <Skeleton className="h-3 w-[200px] bg-gray-300 dark:bg-muted" />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full bg-gray-300 dark:bg-muted" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[100px] bg-gray-300 dark:bg-muted" />
                    <Skeleton className="h-3 w-[80px] bg-gray-300 dark:bg-muted" />
                  </div>
                </div>
                <Skeleton className="h-4 w-[50px] bg-gray-300 dark:bg-muted" />
                <Skeleton className="h-8 w-[100px] bg-gray-300 dark:bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
