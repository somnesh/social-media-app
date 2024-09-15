import { Loader2 } from "lucide-react";

export function CommentsLoader() {
  return (
    <div className="flex justify-center items-center mt-2">
      <Loader2 className="mr-1 h-4 w-4 animate-spin" />
      Loading comments
    </div>
  );
}
