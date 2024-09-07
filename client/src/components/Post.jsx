import axios from "axios";
import { Globe, Heart, Lock, MessageCircle, Repeat2, Users } from "lucide-react";
import { useEffect, useState } from "react";

export function Post({ details }) {
  const [userInfo, setUserInfo] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/user/${details.user_id}`,
          {
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmE0YTViNzZmZWNhM2JmNGU0OTA1ZmUiLCJuYW1lIjoiam9obiBkb2UiLCJyb2xlIjoidXNlciIsImF2YXRhciI6bnVsbCwiaWF0IjoxNzI1Njk1MDIwLCJleHAiOjE3MjU3ODE0MjB9.mP6kU-iTTNaM30LsH17dZHiebJ_Xxcc9NsXA9MzzPi4",
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
  } else if (diffInHours < 60) {
    postDuration = `${diffInHours} hours ago`;
  } else if (diffInDays < 30) {
    postDuration = `${diffInDays} days ago`;
  } else {
    postDuration = `${postDate.getDate()} ${monthNames[postDate.getMonth()]}`;
  }
  return (
    <div className="bg-white dark:bg-[#242526] px-4 py-2 rounded-lg mb-4">
      <div className="flex items-center gap-3 pt-2">
        <div className="">
          <img
            className="rounded-full "
            src="https://via.placeholder.com/40"
            alt="photo"
          />
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
            <span>{postDuration}</span>
          </div>
        </div>
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
