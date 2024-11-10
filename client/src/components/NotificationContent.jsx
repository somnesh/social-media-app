import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function NotificationContent({ message }) {
  console.log(message);

  return (
    <a
      href={message.link}
      className="flex items-center gap-2 hover:bg-[#f2f2f2] dark:hover:bg-[#414141] dark:active:bg-[#383838] p-2 rounded-md cursor-pointer"
    >
      <div className="">
        <Avatar>
          <AvatarImage src={message.sender.avatar || ""} />
          <AvatarFallback className={message.sender.avatarBg}>
            {message.sender.name[0]}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex">
        {/* <h2 className="font-medium">{details.user_id.name}</h2> */}
        <span>
          <span className="font-medium">{message.sender.name}</span>{" "}
          {" " + message.message}
        </span>
      </div>
    </a>
  );
}
