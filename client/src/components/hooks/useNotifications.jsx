// src/hooks/useNotifications.js
import { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import socket from "@/services/socket";
import { useToastHandler } from "@/contexts/ToastContext";
const API_URL = import.meta.env.VITE_API_URL;

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const toastHandler = useToastHandler();

  useEffect(() => {
    const fetchInitialNotifications = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/user/fetch/notification`, {
          withCredentials: true,
        });
        setNotifications(response.data.notificationDetails);
      } catch (error) {
        console.error("useNotification: failed to fetch notification :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialNotifications();
    // Register the user once the socket connects
    // const userId = localStorage.id;
    // const userName = localStorage.name;
    // socket.emit("register_user", { userId, userName });

    // Listen for notifications
    socket.on("receiveNotification", (notification) => {
      // console.log("useNotification: ", notification);

      // Show toast notification
      notify(notification.message, toastHandler);
      setNotifications((prevNotifications) => [
        notification.message,
        ...prevNotifications,
      ]);
    });

    // Clean up event listener on unmount
    return () => {
      socket.off("receiveNotification");
    };
  }, [toastHandler]);

  return { notifications, loading };
};

const notify = (message, toastHandler) => {
  toastHandler(
    <div className="flex gap-2 items-center">
      <Avatar>
        <AvatarImage src={message.sender.avatar || ""} />
        <AvatarFallback className={message.sender.avatarBg}>
          {message.sender.name[0]}
        </AvatarFallback>
      </Avatar>
      <span>
        <span className="font-medium">{message.sender.name}</span>{" "}
        {" " + message.message}
      </span>
    </div>,
    false
  );
};

export default useNotifications;
