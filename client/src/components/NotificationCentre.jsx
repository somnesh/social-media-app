import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Bell } from "lucide-react";
import { NotificationContent } from "./NotificationContent";

import useNotifications from "./hooks/useNotifications";

export function NotificationCentre() {
  const notifications = useNotifications();

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger
          className={
            "bg-[#ffffff] dark:bg-[#303030] hover:bg-[#faf8f8] dark:hover:bg-[#535353] dark:active:bg-[#303030] p-3 rounded-t-md"
          }
        >
          <div className="flex items-center gap-2">
            <Bell />
            Notifications
          </div>
        </AccordionTrigger>
        <AccordionContent className={"bg-white dark:bg-[#242526] rounded-b-md"}>
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
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
