import { CirclePlus, ImagePlus } from "lucide-react";
import { Post } from "./Post";

export function Feed() {
  return (
    <section className="basis-1/2 mx-auto max-w-[680px] select-none gap-2">
      <div className="create-new-post bg-white dark:bg-[#242526] px-4 py-2 rounded-lg">
        <div className="flex items-center py-2 gap-3">
          <div className="">
            <img
              className="rounded-full "
              src="https://via.placeholder.com/50"
              alt="photo"
            />
          </div>
          <div className=" bg-[#414141] active:bg-[#6e6e6e] hover:bg-[#535353] rounded-lg py-3 px-4 cursor-pointer w-full">
            what's happening?
          </div>
        </div>

        <div className="flex items-center text-center pt-2">
          <div className="flex basis-1/3 items-center justify-center p-2 gap-1 cursor-pointer hover:bg-[#414141] rounded-md">
            <ImagePlus />
            <span>add image</span>
          </div>
          <div className="flex basis-1/3 items-center justify-center p-2 gap-1 cursor-pointer hover:bg-[#414141] rounded-md">
            <span className="material-symbols-outlined">ballot</span>
            <span>add poll</span>
          </div>
          <div className="flex basis-1/3 items-center justify-center p-2 gap-1 cursor-pointer hover:bg-[#414141] rounded-md">
            <CirclePlus />
            <span>more</span>
          </div>
        </div>
      </div>

      {/* Main feed starts from here */}
      <div>
        <Post />
      </div>
    </section>
  );
}
