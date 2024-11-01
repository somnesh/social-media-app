import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Ellipsis,
  FilePenLine,
  MessageCircleWarning,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function CommentStructure({ details }) {
  const [isHovered, setIsHovered] = useState(false);
  const [open, setOpen] = useState(false);

  const handleMouseOver = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setOpen(false);
  };

  const commentDate = new Date(details.createdAt);
  const currentDate = new Date();

  const diffInMilliseconds = currentDate - commentDate;

  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let commentDuration = "";
  if (diffInSeconds < 60) {
    commentDuration = `Just now`;
  } else if (diffInMinutes < 60) {
    commentDuration = `${diffInMinutes}m`;
  } else if (diffInHours < 24) {
    commentDuration = `${diffInHours}h`;
  } else if (diffInDays < 30) {
    commentDuration = `${diffInDays}d`;
  } else {
    commentDuration = `${commentDate.getDate()} ${
      monthNames[commentDate.getMonth()]
    }`;
  }

  const handleMenu = (e) => {};
  return (
    <div
      onMouseEnter={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      className="flex gap-2 m-2"
    >
      <Avatar>
        <AvatarImage
          src={
            details.user.avatar ||
            "https://yt3.googleusercontent.com/g3j3iOUOPhNxBCNAArBqiYGzHzCBIzr_Al8mdvtBJeZMGFDblnU5rlVUt6GY01AUwm7Cp70J=s900-c-k-c0x00ffffff-no-rj"
          }
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <div className="flex flex-col bg-[#f0f2f5] dark:bg-[#3a3b3c] px-3 py-2 rounded-xl min-w-44">
          <span className="font-semibold text-sm">{details.user.name}</span>
          <span>{details.content}</span>
        </div>
        <div className="flex text-xs gap-5 font-medium ml-2">
          <span>{commentDuration}</span>
          <span className="hover:underline cursor-pointer">Like</span>
          <span className="hover:underline cursor-pointer">Reply</span>
        </div>
      </div>
      <div
        className={`flex items-center pb-3 transition-opacity duration-300 `}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div
              className={`py-1 px-1 hover:bg-[#F0F2F5] dark:hover:bg-[#414141] rounded-full cursor-pointer transition ${
                isHovered ? "block" : "hidden"
              }`}
            >
              <Ellipsis size={20} />
            </div>
          </PopoverTrigger>
          <PopoverContent
            side={"right"}
            className="w-48 dark:bg-[#242526] border dark:border-[#3a3b3c] p-1 text-sm select-none"
          >
            {localStorage.id === details.user._id ? (
              <>
                <div className="flex flex-col gap-1">
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <div className="flex hover:bg-[#f3f4f6] dark:hover:bg-[#414141] cursor-pointer py-1.5 p-2 rounded-sm items-center m-auto">
                        <Trash2 className="mr-2 h-5 w-5" />
                        <span>Delete comment</span>
                      </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="dark:bg-[#242526] dark:border-[#3a3b3c]">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete this post.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white text-black dark:hover:bg-gray-300 dark:hover:text-black">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 text-white hover:bg-red-700">
                          Delete comment
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                <div className="flex hover:bg-[#f3f4f6] dark:hover:bg-[#414141] cursor-pointer p-2 py-1.5 rounded-sm items-center">
                  <FilePenLine className="mr-2 h-5 w-5" />
                  <span>Edit comment</span>
                </div>
              </>
            ) : (
              <div className="flex hover:bg-[#f3f4f6] dark:hover:bg-[#414141] cursor-pointer p-2 py-1.5 rounded-sm items-center">
                <MessageCircleWarning className="mr-2 h-5 w-5" />
                <span>Report comment</span>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
