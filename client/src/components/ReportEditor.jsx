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

export function ReportEditor({
  openReportEditor,
  setOpenReportEditor,
  details,
}) {
  const toastHandler = useToastHandler();
  const API_URL = import.meta.env.VITE_API_URL;
  const [reportContent, setReportContent] = useState("");
  const handleReportPost = async () => {
    try {
      await axios.post(
        `${API_URL}/report/${details._id}`,
        { content_type: details.contentType, report_content: reportContent },
        { withCredentials: true }
      );
      toastHandler(
        <div className="flex gap-2 items-center">
          <CircleCheck className="bg-green-600 rounded-full text-white dark:text-[#242526]" />
          <span>Report submitted successfully</span>
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
      setOpenReportEditor(false);
    }
  };

  return (
    <Dialog open={openReportEditor} onOpenChange={setOpenReportEditor}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="sm:max-w-md dark:bg-[#242526] dark:border-[#3a3b3c]">
        <DialogHeader>
          <DialogTitle>Report</DialogTitle>
          <DialogDescription>
            Tell us what's wrong, you can check your report status in help
            center. Click Report post when you're done.
          </DialogDescription>
        </DialogHeader>

        <textarea
          autoFocus
          className="min-w-full min-h-32 p-2 rounded-md border bg-[#F0F2F5] dark:bg-[#333536] resize-none outline-none"
          name="content"
          id="content"
          placeholder="Tell us your problem..."
          value={reportContent}
          onChange={(e) => {
            setReportContent(e.target.value);
          }}
        ></textarea>
        <DialogFooter>
          <Button
            onClick={handleReportPost}
            type="submit"
            size="sm"
            className="px-3 bg-transparent border hover:bg-slate-200 dark:bg-white dark:hover:bg-slate-200"
          >
            Report post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
