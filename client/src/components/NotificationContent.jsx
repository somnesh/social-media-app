import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { formatDistanceToNow, format } from "date-fns";
import { useEffect, useState } from "react";

export function NotificationContent({ message }) {
  const [timeAgo, setTimeAgo] = useState("");
  const APP_URL = import.meta.env.VITE_APP_URL;

  useEffect(() => {
    const updateTimeAgo = () => {
      const now = new Date();
      const pastDate = new Date(message.createdAt);
      const diffInSeconds = Math.floor((now - pastDate) / 1000);

      if (diffInSeconds < 60) {
        setTimeAgo("Just now");
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        setTimeAgo(`${minutes}m`);
      } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        setTimeAgo(`${hours}h`);
      } else if (diffInSeconds < 2592000) {
        const days = Math.floor(diffInSeconds / 86400);
        setTimeAgo(`${days}d`);
      } else if (diffInSeconds < 31536000) {
        setTimeAgo(format(pastDate, "dd MMM")); // Example: 09 Sep
      } else {
        setTimeAgo(format(pastDate, "MMM yyyy")); // Example: Sep 2024
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 60000); // Update every minute

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <Link
      to={`${APP_URL || ""}/${message.link}`}
      className="flex items-center gap-4 hover:bg-[#f2f2f2] dark:hover:bg-[#414141] dark:active:bg-[#383838] p-2 mr-1 rounded-md cursor-pointer"
    >
      <div className="">
        <Avatar className={"h-14 w-14"}>
          <AvatarImage src={message.sender.avatar || ""} />
          <AvatarFallback className={message.sender.avatarBg}>
            {message.sender.name[0]}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col">
        <div>
          <span>
            <span className="font-medium">{message.sender.name}</span>{" "}
            {" " + message.message}
          </span>
        </div>
        <div>
          <span className="text-xs">{timeAgo}</span>
        </div>
      </div>
    </Link>
  );
}
