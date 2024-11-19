import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function ProfilePageLoader() {
  return (
    <div className="w-full h-full bg-background px-10">
      <div className="w-full max-w-6xl mx-auto overflow-hidden bg-background rounded-b-md">
        {/* Cover Photo Skeleton */}
        <Skeleton className="h-80 w-full dark:bg-[#59595e]" />

        {/* Profile Section */}
        <div className="px-4 pb-4 pt-0 md:px-6 relative">
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-6">
            {/* Profile Picture Skeleton */}
            <Skeleton className="relative -mt-12 h-32 w-32 rounded-full border-4 border-background animate-[wiggle_1s_ease-in-out_infinite] dark:bg-[#59595e]" />

            {/* Profile Info Skeleton */}
            <div className="flex-1 md:w-full">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-8 w-40 dark:bg-[#59595e]" />
                  <Skeleton className="h-4 w-24 dark:bg-[#59595e]" />
                </div>
                <Skeleton className="h-10 w-24 dark:bg-[#59595e]" />
              </div>
            </div>
          </div>

          {/* Stats Skeleton */}
          <div className="mt-4 flex gap-4">
            <Skeleton className="h-4 w-20 dark:bg-[#59595e]" />
            <Skeleton className="h-4 w-20 dark:bg-[#59595e]" />
          </div>

          {/* Bio Skeleton */}
          <Skeleton className="mt-4 h-4 w-3/4 dark:bg-[#59595e]" />

          <div className="mt-6 flex flex-col md:flex-row gap-6">
            {/* About section - left column */}
            <Card className="md:w-1/3 h-fit p-4 bg-background/80 backdrop-blur-sm rounded-xl">
              <Skeleton className="h-6 w-20 mb-4 dark:bg-[#59595e]" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full dark:bg-[#59595e]" />
                <Skeleton className="h-4 w-full dark:bg-[#59595e]" />
                <Skeleton className="h-4 w-3/4 dark:bg-[#59595e]" />
              </div>
            </Card>

            {/* Posts section - right column */}
            <div className="md:w-2/3">
              <Tabs defaultValue="posts">
                <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 sticky h-auto">
                  <TabsTrigger
                    value="posts"
                    className="rounded-none border-b-2 border-transparent px-4 pb-2 pt-2 font-semibold data-[state=active]:border-primary"
                  >
                    Posts
                  </TabsTrigger>
                  <TabsTrigger
                    value="photos"
                    className="rounded-none border-b-2 border-transparent px-4 pb-2 pt-2 font-semibold data-[state=active]:border-primary"
                  >
                    Photos
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="posts" className="mt-6 space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <Card key={index} className="p-4 space-y-4">
                      <div className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full dark:bg-[#59595e]" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[200px] dark:bg-[#59595e]" />
                          <Skeleton className="h-4 w-[150px] dark:bg-[#59595e]" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-full dark:bg-[#59595e]" />
                      <Skeleton className="h-4 w-full dark:bg-[#59595e]" />
                      <Skeleton className="h-40 w-full dark:bg-[#59595e]" />
                    </Card>
                  ))}
                </TabsContent>
                <TabsContent value="photos" className="mt-6">
                  <div className="grid grid-cols-3 gap-4">
                    {[...Array(9)].map((_, index) => (
                      <Skeleton
                        key={index}
                        className="aspect-square rounded-lg dark:bg-[#59595e]"
                      />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
