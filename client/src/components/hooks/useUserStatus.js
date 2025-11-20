import { useEffect, useState } from "react";
import socket from "../../services/socket";

/**
 * Hook to track online/offline status of users
 * @param {string|string[]} userIds - Single userId or array of userIds to monitor
 * @returns {Object} - Object with userId as key and status as value
 */
export function useUserStatus(userIds) {
  const [statuses, setStatuses] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userIds) {
      setIsLoading(false);
      return;
    }

    // Normalize to array
    const userIdArray = Array.isArray(userIds) ? userIds : [userIds];

    if (userIdArray.length === 0) {
      setIsLoading(false);
      return;
    }

    // Subscribe to users
    socket.emit("subscribe_to_users", { userIds: userIdArray });

    // Handle initial batch status
    const handleBatchStatus = (batchStatuses) => {
      setStatuses(batchStatuses);
      setIsLoading(false);
    };

    // Handle real-time status changes
    const handleStatusChange = ({ userId, status }) => {
      setStatuses((prev) => ({
        ...prev,
        [userId]: status,
      }));
    };

    socket.on("users_status_batch", handleBatchStatus);
    socket.on("user_status_changed", handleStatusChange);

    // Cleanup
    return () => {
      socket.emit("unsubscribe_from_users", { userIds: userIdArray });
      socket.off("users_status_batch", handleBatchStatus);
      socket.off("user_status_changed", handleStatusChange);
    };
  }, [JSON.stringify(userIds)]); // Use JSON.stringify to properly compare arrays

  // If single userId was passed, return just that status
  if (!Array.isArray(userIds) && userIds) {
    // console.log("Returning status for single user:", userIds, statuses);
    return {
      status: statuses[userIds] || "offline",
      isLoading,
      allStatuses: statuses,
    };
  }

  // If array was passed, return all statuses
  return {
    statuses,
    isLoading,
  };
}

// Optional: Hook for single user status
export function useSingleUserStatus(userId) {
  const { status, isLoading } = useUserStatus(userId);
  return { status, isLoading };
}

// Optional: Hook for multiple users status
export function useMultipleUserStatus(userIds) {
  const { statuses, isLoading } = useUserStatus(userIds);
  return { statuses, isLoading };
}
