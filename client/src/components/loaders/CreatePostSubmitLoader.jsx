import { Loader2 } from "lucide-react";

export function CreatePostSubmitLoader(){
    return (
      <div className="fixed inset-0 flex justify-center bg-opacity-30 backdrop-brightness-[.3] items-center z-[1]">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Please wait
      </div>
    );
}