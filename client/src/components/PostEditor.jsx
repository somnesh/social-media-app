import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "./ui/button";
import { DialogFooter } from "./ui/dialog";
import { useState } from "react";
import axios from "axios";
import { useToastHandler } from "../contexts/ToastContext";
import { CircleCheck, CircleX } from "lucide-react";

export function PostEditor({
  openPostEditor,
  setOpenPostEditor,
  postCaption,
  setPostCaption,
  details,
}) {
  const [postContent, setPostContent] = useState(postCaption);
  const API_URL = import.meta.env.VITE_API_URL;
  const toastHandler = useToastHandler();

  const handleEditPost = async () => {
    try {
      const response = await axios.patch(
        `${API_URL}/post/${details._id}`,
        { content: postContent },
        { withCredentials: true }
      );
      console.log(response.data);

      setPostCaption(postContent);
      toastHandler(
        <div className="flex gap-2 items-center">
          <CircleCheck className="bg-green-600 rounded-full text-white dark:text-[#242526]" />
          <span>{`Post caption updated`}</span>
        </div>,
        false
      );
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
      setOpenPostEditor(false);
    }
  };

  return (
    <Dialog open={openPostEditor} onOpenChange={setOpenPostEditor}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="sm:max-w-md dark:bg-[#242526] dark:border-[#3a3b3c]">
        <DialogHeader>
          <DialogTitle>Edit post caption</DialogTitle>
          <DialogDescription>
            Make changes to your post here. Click save changes when you're done.
          </DialogDescription>
        </DialogHeader>

        <textarea
          autoFocus
          className="min-w-full min-h-32 p-2 rounded-md border bg-[#F0F2F5] dark:bg-[#333536] resize-none outline-none"
          name="content"
          id="content"
          placeholder="Start writing here ..."
          value={postContent}
          onChange={(e) => {
            setPostContent(e.target.value);
          }}
          ref={(textarea) => {
            if (textarea) {
              // Set the cursor to the end of the content
              textarea.setSelectionRange(
                postContent.length,
                postContent.length
              );
            }
          }}
        ></textarea>
        <DialogFooter>
          <Button
            onClick={handleEditPost}
            type="submit"
            size="sm"
            className="px-3 bg-transparent border hover:bg-slate-200 dark:bg-white dark:hover:bg-slate-200"
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
