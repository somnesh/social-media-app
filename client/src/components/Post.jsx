import axios from "axios";
import {
  BookmarkPlus,
  CircleCheck,
  CircleX,
  Ellipsis,
  FilePenLine,
  Globe,
  Heart,
  Lock,
  MessageCircle,
  Repeat2,
  Trash2,
  UserCog,
  Users,
} from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "../components/hooks/use-toast";
import { useEffect, useState } from "react";

export function Post({ details, refreshFeed, setRefreshFeed }) {
  const { toast } = useToast();
  const [userInfo, setUserInfo] = useState([]);

  const authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmE0YTViNzZmZWNhM2JmNGU0OTA1ZmUiLCJuYW1lIjoiSm9obiBEb2UiLCJyb2xlIjoidXNlciIsImF2YXRhciI6bnVsbCwiaWF0IjoxNzI1NzkwNTU5LCJleHAiOjE3MjY2NTQ1NTl9.W9wL3vbaVVcZqHn8tT9oujSZcxy8qHrqGEfgPdc0CYA";

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/user/${details.user_id}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setUserInfo(response.data);
        // console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  // console.log(details.visibility);

  const postDate = new Date(details.createdAt);
  const currentDate = new Date();

  const diffInMilliseconds = currentDate - postDate;

  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let postDuration = "";
  if (diffInSeconds < 60) {
    postDuration = `Just now`;
  } else if (diffInMinutes < 60) {
    postDuration = `${diffInMinutes} minutes ago`;
  } else if (diffInHours < 24) {
    postDuration =
      diffInHours === 1 ? `about an hour ago` : `${diffInHours} hours ago`;
  } else if (diffInDays < 30) {
    postDuration = diffInDays === 1 ? `a day ago` : `${diffInDays} days ago`;
  } else {
    postDuration = `${postDate.getDate()} ${monthNames[postDate.getMonth()]}`;
  }

  const toastHandler = (msg, vari) => {
    toast({
      variant: vari ? "destructive" : "default",
      description: msg,
    });
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/v1/post/${details._id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log(response.data);
      setRefreshFeed(!refreshFeed);

      toastHandler(
        <div className="flex gap-2 items-center">
          <CircleCheck className="bg-green-600 rounded-full text-white dark:text-[#242526]" />
          <span>Post deleted</span>
        </div>
      );
    } catch (error) {
      console.log(error);
      toastHandler(
        <div className="flex gap-2 items-center">
          <CircleX className="bg-red-600 rounded-full text-white dark:text-[#7f1d1d]" />
          <span>Something went wrong</span>
        </div>,
        true
      );
    }
  };
  return (
    <div className="bg-white dark:bg-[#242526] px-4 py-2 rounded-lg mb-4 relative">
      <div className="flex items-center gap-3 pt-2">
        <div className="">
          <Avatar>
            <AvatarImage
              src={
                details.avatar ||
                "https://yt3.googleusercontent.com/g3j3iOUOPhNxBCNAArBqiYGzHzCBIzr_Al8mdvtBJeZMGFDblnU5rlVUt6GY01AUwm7Cp70J=s900-c-k-c0x00ffffff-no-rj"
              }
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div className="">
          <h2 className="font-medium">{userInfo.name}</h2>
          <div className="flex gap-1 items-center">
            <span>
              {details.visibility === "public" ? (
                <Globe size={16} strokeWidth={1.25} />
              ) : details.visibility === "friends" ? (
                <Users size={16} strokeWidth={1.25} />
              ) : (
                <Lock size={16} strokeWidth={1.25} />
              )}
            </span>
            <span> · {postDuration}</span>
          </div>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <div className="py-1 px-1 top-2 right-2 absolute hover:bg-[#F0F2F5] dark:hover:bg-[#414141] rounded-full cursor-pointer">
              <Ellipsis />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-48 dark:bg-[#242526] border dark:border-[#3a3b3c] p-2 text-sm select-none">
            <div className="flex flex-col gap-1">
              <div className="flex hover:bg-[#f3f4f6] dark:hover:bg-[#414141] cursor-pointer px-2 py-1.5 rounded-sm items-center">
                <BookmarkPlus className="mr-2 h-5 w-5" />
                <span>Save post</span>
              </div>
              <div className="flex hover:bg-[#f3f4f6] dark:hover:bg-[#414141] cursor-pointer p-2 py-1.5 rounded-sm items-center">
                <FilePenLine className="mr-2 h-5 w-5" />
                <span>Edit</span>
              </div>
              <div className="flex hover:bg-[#f3f4f6] dark:hover:bg-[#414141] cursor-pointer p-2 py-1.5 rounded-sm items-center">
                <UserCog className="mr-2 h-5 w-5" />
                <span>Change visibility</span>
              </div>
              <AlertDialog>
                <AlertDialogTrigger>
                  <div className="flex hover:bg-[#f3f4f6] dark:hover:bg-[#414141] cursor-pointer py-1.5 p-2 rounded-sm items-center">
                    <Trash2 className="mr-2 h-5 w-5" />
                    <span>Delete</span>
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent className="dark:bg-[#242526] dark:border-[#3a3b3c]">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      this post.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-white text-black dark:hover:bg-gray-300 dark:hover:text-black">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col py-2">
        <div className="pb-2">{details.content}</div>
        {details.image_url && <img src={details.image_url} alt="photo" />}
      </div>
      <div className="flex py-1 border-y dark:dark:border-y-[#3a3b3c]">
        <div className="flex basis-1/3 justify-center transition delay-75 ease-in gap-1 p-2 hover:bg-[#f9188110] hover:text-[#f91880] cursor-pointer rounded-md">
          <Heart />
          <span>React</span>
        </div>
        <div className="flex basis-1/3 justify-center gap-1 p-2 hover:bg-[#1d9cf010] cursor-pointer rounded-md transition delay-75 ease-in hover:text-[#1d9bf0]">
          <MessageCircle />
          <span>Comment</span>
        </div>
        <div className="flex basis-1/3 justify-center gap-1 p-2 hover:bg-[#00ba7c10] cursor-pointer rounded-md transition delay-75 ease-in hover:text-[#00ba7c]">
          <Repeat2 />
          <span>Share</span>
        </div>
      </div>
    </div>
  );
}
