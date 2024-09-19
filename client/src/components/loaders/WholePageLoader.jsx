import { Loader2 } from "lucide-react";

export function WholePageLoader() {
  return (
    <div className="flex h-screen w-screen justify-center items-center gap-1">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      <span>Please wait</span>
    </div>
  );
}
