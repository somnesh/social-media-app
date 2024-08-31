import { Bookmark, Gem, Home, UserPlus, Users } from "lucide-react";

export function Sidebar(params) {
  return (
    <section className="dark:bg-[18191a] basis-1/4">
      <div className="flex items-center gap-1 p-2">
        <Home/>
        <span>Home</span>
      </div>
      <div className="flex items-center gap-1 p-2">
        <Users/>
        <span>Friends</span>
      </div>
      <div className="flex items-center gap-1 p-2">
        <UserPlus/>
        <span>Friend Requests</span>
      </div>
      <div className="flex items-center gap-1 p-2">
        <Bookmark/>
        <span>Saved</span>
      </div>
      <div className="flex items-center gap-1 p-2">
        <Gem/>
        <span>Premium</span>
      </div>
    </section>
  );
}
