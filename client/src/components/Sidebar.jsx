import { Bookmark, Gem, Home, UserPlus, Users } from "lucide-react";

export function Sidebar(params) {
  return (
    <section className="  basis-1/4 h-screen sticky top-[4.5rem] overflow-y-auto rounded-md gap-1 mr-auto max-w-80">
      <div className="flex items-center gap-1 p-3 hover:bg-[#e3e5e9] dark:hover:bg-[#414141] cursor-pointer rounded-md">
        <Home />
        <span>Home</span>
      </div>
      <div className="flex items-center gap-1 p-3 hover:bg-[#e3e5e9] dark:hover:bg-[#414141] cursor-pointer rounded-md">
        <Users />
        <span>Friends</span>
      </div>
      <div className="flex items-center gap-1 p-3 hover:bg-[#e3e5e9] dark:hover:bg-[#414141] cursor-pointer rounded-md">
        <UserPlus />
        <span>Friend Requests</span>
      </div>
      <div className="flex items-center gap-1 p-3 hover:bg-[#e3e5e9] dark:hover:bg-[#414141] cursor-pointer rounded-md">
        <Bookmark />
        <span>Saved</span>
      </div>
      <div className="flex items-center gap-1 p-3 hover:bg-[#e3e5e9] dark:hover:bg-[#414141] cursor-pointer rounded-md">
        <Gem />
        <span>Premium</span>
      </div>
    </section>
  );
}
