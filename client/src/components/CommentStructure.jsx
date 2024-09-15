import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function CommentStructure({ details }) {
  console.log(details);

  const commentDate = new Date(details.createdAt);
  const currentDate = new Date();

  const diffInMilliseconds = currentDate - commentDate;

  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let commentDuration = "";
  if (diffInSeconds < 60) {
    commentDuration = `Just now`;
  } else if (diffInMinutes < 60) {
    commentDuration = `${diffInMinutes}m`;
  } else if (diffInHours < 24) {
    commentDuration = `${diffInHours}h`;
  } else if (diffInDays < 30) {
    commentDuration = `${diffInDays}d`;
  } else {
    commentDuration = `${commentDate.getDate()} ${
      monthNames[commentDate.getMonth()]
    }`;
  }
  return (
    <div className="flex gap-2 m-2">
      <Avatar>
        <AvatarImage
          src={
            details.user.avatar ||
            "https://yt3.googleusercontent.com/g3j3iOUOPhNxBCNAArBqiYGzHzCBIzr_Al8mdvtBJeZMGFDblnU5rlVUt6GY01AUwm7Cp70J=s900-c-k-c0x00ffffff-no-rj"
          }
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <div className="flex flex-col bg-[#f0f2f5] dark:bg-[#3a3b3c] px-3 py-2 rounded-xl min-w-44">
          <span className="font-semibold text-sm">{details.user.name}</span>
          <span>{details.content}</span>
        </div>
        <div className="flex text-xs gap-5 font-medium ml-2">
          <span>{commentDuration}</span>
          <span className="hover:underline cursor-pointer">Like</span>
          <span className="hover:underline cursor-pointer">Reply</span>
        </div>
      </div>
    </div>
  );
}
