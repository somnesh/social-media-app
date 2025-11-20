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

export function ContentEditor({
  openEditor,
  setOpenEditor,
  currentContent,
  setCurrentContent,
  details,
}) {
  const [newContent, setNewContent] = useState(currentContent);
  const API_URL = import.meta.env.VITE_API_URL;
  const toastHandler = useToastHandler();
  const contentType = details.contentType;

  const handleEdit = async () => {
    try {
      const response = await axios.patch(
        `${API_URL}/${contentType === "comment" ? "post/comment" : "post"}/${
          details._id
        }`,
        { content: newContent },
        { withCredentials: true }
      );

      setCurrentContent(newContent);
      toastHandler(
        <div className="flex gap-2 items-center">
          <CircleCheck className="bg-green-600 rounded-full text-white dark:text-[#242526]" />
          <span>{`${
            contentType === "comment" ? "comment" : "post"
          } updated`}</span>
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
      setOpenEditor(false);
    }
  };

  return (
    <Dialog open={openEditor} onOpenChange={setOpenEditor}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="sm:max-w-md dark:bg-[#242526] dark:border-[#3a3b3c]">
        <DialogHeader>
          <DialogTitle>Make changes </DialogTitle>
          <DialogDescription>
            Edit things here. Click save changes when you're done.
          </DialogDescription>
        </DialogHeader>

        <textarea
          autoFocus
          className="min-w-full min-h-32 p-2 rounded-md border bg-[#F0F2F5] dark:bg-[#333536] resize-none outline-hidden"
          name="content"
          id="content"
          placeholder="Start writing here ..."
          value={newContent}
          onChange={(e) => {
            setNewContent(e.target.value);
          }}
        ></textarea>
        <DialogFooter>
          <Button
            onClick={handleEdit}
            type="submit"
            size="sm"
            className="px-3 bg-indigo-500 border hover:bg-indigo-400 dark:bg-white dark:hover:bg-slate-200"
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
