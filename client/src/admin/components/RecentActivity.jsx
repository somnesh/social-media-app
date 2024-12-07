import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const activities = [
  { user: "Alice", action: "posted a new photo", time: "2 minutes ago" },
  { user: "Bob", action: "commented on a post", time: "15 minutes ago" },
  { user: "Charlie", action: "liked a post", time: "1 hour ago" },
  { user: "David", action: "shared a post", time: "3 hours ago" },
  { user: "Eve", action: "joined the platform", time: "5 hours ago" },
];

export function RecentActivity() {
  return (
    <div className="space-y-8">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={`/avatars/${activity.user.toLowerCase()}.png`}
              alt={activity.user}
            />
            <AvatarFallback>{activity.user[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.user}</p>
            <p className="text-sm text-muted-foreground">{activity.action}</p>
          </div>
          <div className="ml-auto font-medium text-sm text-muted-foreground">
            {activity.time}
          </div>
        </div>
      ))}
    </div>
  );
}
