import { Loader2 } from "lucide-react";
import { SkeletonLoader } from "./SkeletonLoader";
export function LoginPageImageLoader() {
  return (
    <div className="relative flex w-full h-full justify-center items-center rounded-lg">
      <div className="rounded-lg animate-pulse bg-gray-300 dark:bg-muted absolute inset-0"></div>
      <Loader2 className="mr-2 h-4 w-4 animate-spin relative" />
      <span className="relative">Loading picture of the moment</span>
    </div>
  );
}
