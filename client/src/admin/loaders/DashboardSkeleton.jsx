import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <Skeleton className="h-9 w-[200px] bg-gray-300 dark:bg-muted" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 border rounded-lg">
            <Skeleton className="h-6 w-[100px] mb-2 bg-gray-300 dark:bg-muted" />
            <Skeleton className="h-10 w-36 mb-2 bg-gray-300 dark:bg-muted" />
            <Skeleton className="h-4 w-[100px] bg-gray-300 dark:bg-muted" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="border rounded-lg p-4">
          <Skeleton className="h-6 w-[150px] mb-4 bg-gray-300 dark:bg-muted" />
          <Skeleton className="h-104 bg-gray-300 dark:bg-muted" />
        </div>
        <div className="border rounded-lg p-4">
          <Skeleton className="h-6 w-[150px] mb-6 bg-gray-300 dark:bg-muted" />
          <div className="flex flex-col gap-7">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center">
                <Skeleton className="h-10 w-10 rounded-full mr-4 bg-gray-300 dark:bg-muted" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px] bg-gray-300 dark:bg-muted" />
                  <Skeleton className="h-3 w-[150px] bg-gray-300 dark:bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
