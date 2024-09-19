import { BadgeAlert } from "lucide-react";

export function SomethingWentWrong() {
  return (
    <div className="h-screen flex flex-col justify-center items-center text-3xl gap-2">
      <div className="flex gap-2 font-semibold items-center text-red-500">
        <BadgeAlert size={40} />
        <span>500.</span>
        <span className="dark:text-white text-black font-normal">
          Oops! something went wrong
        </span>
      </div>
      <span className="text-sm text-gray-400">
        This may be because of a technical error that we're working to get
        fixed.
      </span>
    </div>
  );
}
