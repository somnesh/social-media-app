import { CirclePlus, ImagePlus } from "lucide-react";
import { Post } from "./Post";

export function Feed() {
  return (
    <section className="basis-1/2 mx-auto max-w-[680px] select-none gap-2 overflow-y-auto">
      <div className="create-new-post bg-white dark:bg-[#242526] px-4 py-2 rounded-lg mb-4">
        <div className="flex items-center py-2 gap-3">
          <div className="">
            <img
              className="rounded-full "
              src="https://via.placeholder.com/50"
              alt="photo"
            />
          </div>
          <div className="bg-[#F0F2F5] hover:bg-[#e3e5e9] active:bg-[#dbdde0] dark:bg-[#414141] dark:active:bg-[#6e6e6e] dark:hover:bg-[#535353] rounded-lg py-3 px-4 cursor-pointer w-full">
            what's happening?
          </div>
        </div>

        <div className="flex items-center text-center pt-2 mt-2 border-t-[#e4e6eb] border-t-[1px] dark:border-t-[#3a3b3c]">
          <div className="flex basis-1/3 items-center justify-center p-2 gap-1 cursor-pointer hover:bg-[#F0F2F5] active:bg-[#e3e5e9] dark:hover:bg-[#414141] dark:active:bg-[#535353] rounded-md">
            <ImagePlus />
            <span>Image</span>
          </div>
          <div className="flex basis-1/3 items-center justify-center p-2 gap-1 cursor-pointer hover:bg-[#F0F2F5] active:bg-[#e3e5e9] dark:hover:bg-[#414141] dark:active:bg-[#535353] rounded-md">
            <span className="material-symbols-outlined">ballot</span>
            <span>Poll</span>
          </div>
          <div className="flex basis-1/3 items-center justify-center p-2 gap-1 cursor-pointer hover:bg-[#F0F2F5] active:bg-[#e3e5e9] dark:hover:bg-[#414141] dark:active:bg-[#535353] rounded-md">
            <CirclePlus />
            <span>More</span>
          </div>
        </div>
      </div>

      {/* Main feed starts from here */}
      <div>
        <Post />
        <Post />
        <Post />
      </div>
    </section>
  );
}
