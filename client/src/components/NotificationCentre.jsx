import { NotificationContent } from "./NotificationContent";

import useNotifications from "./hooks/useNotifications";
import NotificationsSkeleton from "./loaders/NotificationsSkeleton";

export function NotificationCentre({ mobileFlag }) {
  const { notifications, loading } = useNotifications();
  return (
    <div>
      {mobileFlag && loading ? (
        <NotificationsSkeleton />
      ) : (
        <>
          {mobileFlag && (
            <div className="my-4 ml-2">
              <span className="text-2xl font-bold">Notifications</span>
            </div>
          )}

          <div className="sm:max-h-screen h-auto overflow-y-auto">
            {notifications.length !== 0 ? (
              notifications.map((notification, index) => (
                <NotificationContent
                  key={notification._id}
                  message={notification}
                />
              ))
            ) : (
              <span className="block p-3 font-medium w-full text-center">
                Nothing here right now.
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
