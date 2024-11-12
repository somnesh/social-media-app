import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import axios from "axios";
import { useToastHandler } from "../contexts/ToastContext";
import { useState } from "react";
import { CircleCheck, CircleX } from "lucide-react";

export function ProfileCard({ details, followingBack }) {
  const [isFollowingBack, setIsFollowingBack] = useState(followingBack);
  const [unfollowFlag, setUnfollowFlag] = useState(false);
  const [followerRemovedFlag, setFollowerRemovedFlag] = useState(false);

  const toastHandler = useToastHandler();
  const API_URL = import.meta.env.VITE_API_URL;
  const APP_URL = import.meta.env.VITE_APP_URL;

  const handleUnfollow = async () => {
    try {
      const response = await axios.delete(
        `${API_URL}/user/unfollow/${details._id}`,
        { withCredentials: true }
      );

      if (followingBack !== null) {
        setIsFollowingBack(false);
      }
      setUnfollowFlag(true);
      toastHandler(
        <div className="flex gap-2 items-center">
          <CircleCheck className="bg-green-600 rounded-full text-white dark:text-[#242526]" />
          <span>User unfollowed</span>
        </div>,
        false
      );
    } catch (error) {
      console.error("Unfollow Failed: ", error);
      toastHandler(
        <div className="flex gap-2 items-center">
          <CircleX className="bg-red-600 rounded-full text-white dark:text-[#7f1d1d]" />
          <span>Something went wrong</span>
        </div>,
        true
      );
    }
  };

  const handleFollow = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/user/follow/${details._id}`,
        {},
        { withCredentials: true }
      );

      if (followingBack !== null) {
        setIsFollowingBack(true);
      }
      setUnfollowFlag(false);
      toastHandler(
        <div className="flex gap-2 items-center">
          <CircleCheck className="bg-green-600 rounded-full text-white dark:text-[#242526]" />
          <span>User followed</span>
        </div>,
        false
      );
    } catch (error) {
      console.error("Follow Failed: ", error);
      toastHandler(
        <div className="flex gap-2 items-center">
          <CircleX className="bg-red-600 rounded-full text-white dark:text-[#7f1d1d]" />
          <span>Something went wrong</span>
        </div>,
        true
      );
    }
  };

  const handleRemoveFollower = async () => {
    try {
      const response = await axios.delete(
        `${API_URL}/user/remove-follower/${details._id}`,
        { withCredentials: true }
      );

      setFollowerRemovedFlag(true);
      toastHandler(
        <div className="flex gap-2 items-center">
          <CircleCheck className="bg-green-600 rounded-full text-white dark:text-[#242526]" />
          <span>Follower removed</span>
        </div>,
        false
      );
    } catch (error) {
      console.error(error);

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
    <>
      {details && (
        <div className="flex basis-1/2 flex-col gap-5 bg-white dark:bg-[#242526] px-4 py-3 transition-all drop-shadow-sm rounded-md">
          <div className="flex gap-3 items-center">
            <a
              href={`${APP_URL}/user/${details.username}`}
              className="hover:contrast-50"
            >
              <Avatar>
                <AvatarImage src={details?.avatar} />
                <AvatarFallback className={details?.avatarBg}>
                  {details?.name[0]}
                </AvatarFallback>
              </Avatar>
            </a>
            <div className="flex flex-col justify-center">
              <a
                href={`${APP_URL}/user/${details.username}`}
                className="hover:underline"
              >
                <span className="font-medium ">{details?.name}</span>
              </a>
              <span className="text-sm ">@{details?.username}</span>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            {isFollowingBack === null ? (
              <>
                {!unfollowFlag ? (
                  <Button onClick={handleUnfollow}>Unfollow</Button>
                ) : (
                  <Button onClick={handleFollow}>Follow</Button>
                )}
              </>
            ) : (
              <>
                {!followerRemovedFlag && (
                  <Button onClick={handleRemoveFollower}>Remove</Button>
                )}
                {isFollowingBack ? (
                  <Button onClick={handleUnfollow}>Unfollow</Button>
                ) : (
                  <Button onClick={handleFollow}>Follow back</Button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
