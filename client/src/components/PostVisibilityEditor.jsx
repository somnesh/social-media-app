import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import {
  CircleAlert,
  CircleCheck,
  CircleX,
  Globe,
  Loader2,
  Lock,
  Users,
} from "lucide-react";

import { useState } from "react";
import axios from "axios";
import { useToastHandler } from "../contexts/ToastContext";

export function PostVisibilityEditor({
  openPostVisibilityEditor,
  setOpenPostVisibilityEditor,
  setVisibility,
  visibility,
  details,
}) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [postVisibility, setPostVisibility] = useState(visibility);
  const [isLoading, setIsLoading] = useState(false);
  const toastHandler = useToastHandler();

  const handlePostVisibilityChange = async () => {
    setIsLoading(true);
    try {
      if (postVisibility !== visibility) {
        const response = await axios.patch(
          `${API_URL}/post/${details._id}`,
          { visibility: postVisibility },
          { withCredentials: true }
        );

        setVisibility(postVisibility);
        toastHandler(
          <div className="flex gap-2 items-center">
            <CircleCheck className="bg-green-600 rounded-full text-white dark:text-[#242526]" />
            <span>{`Post visibility updated to ${postVisibility}`}</span>
          </div>,
          false
        );
      } else {
        toastHandler(
          <div className="flex gap-2 items-center">
            <CircleAlert className="bg-yellow-500 rounded-full text-white dark:text-[#242526]" />
            <span>{`Post visibility already set to ${postVisibility}.`}</span>
          </div>,
          false
        );
      }
    } catch (error) {
      console.error(error);
      let msg = "";
      if (error.response) {
        msg = error.response.data.msg;
      }

      toastHandler(
        <div className="flex gap-2 items-center">
          <CircleX className="bg-red-600 rounded-full text-white dark:text-[#7f1d1d]" />
          <span>{msg || "Something went wrong"}</span>
        </div>,
        true
      );
    } finally {
      setOpenPostVisibilityEditor(false);
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={openPostVisibilityEditor}
      onOpenChange={setOpenPostVisibilityEditor}
    >
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="sm:max-w-md dark:bg-[#242526] dark:border-[#3a3b3c]">
        <DialogHeader>
          <DialogTitle>Change post visibility</DialogTitle>
          <DialogDescription>
            Change your post visibility. Click save changes when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-3 transition-all">
          <div
            onClick={() => setPostVisibility("public")}
            id="public"
            className={`flex gap-1 items-center border dark:border-gray-600 cursor-pointer px-12 py-2 rounded-md ${
              postVisibility === "public"
                ? "bg-blue-400 font-semibold"
                : "hover:bg-slate-200 hover:text-black"
            }`}
          >
            <Globe size={18} />
            <span>Public</span>
          </div>
          <div
            onClick={() => setPostVisibility("friends")}
            id="friends"
            className={`flex gap-1 items-center border dark:border-gray-600 cursor-pointer px-11 py-2 rounded-md ${
              postVisibility === "friends"
                ? "bg-blue-400 font-semibold"
                : "hover:bg-slate-200 hover:text-black"
            }`}
          >
            <Users size={18} />
            <span>Friends</span>
          </div>
          <div
            onClick={() => setPostVisibility("private")}
            id="private"
            className={`flex gap-1 items-center border dark:border-gray-600 cursor-pointer px-11 py-2 rounded-md
            ${
              postVisibility === "private"
                ? "bg-blue-400 font-semibold"
                : "hover:bg-slate-200 hover:text-black"
            }`}
          >
            <Lock size={18} />
            <span>Private</span>
          </div>
        </div>
        <DialogFooter className={"mt-5"}>
          <Button
            onClick={handlePostVisibilityChange}
            type="submit"
            size="sm"
            className="px-4 bg-transparent border bg-slate-100 text-black hover:bg-slate-200 dark:bg-white dark:hover:bg-slate-200"
          >
            {!isLoading && <span>Save changes</span>}
            {isLoading && (
              <>
                <span>Saving...</span>
                <Loader2 size={14} className="ml-1 animate-spin" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
