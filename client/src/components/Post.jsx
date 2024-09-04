import { Globe, Heart, MessageCircle, Repeat2 } from "lucide-react";

export function Post() {
  return (
    <div className="bg-white dark:bg-[#242526] px-4 py-2 rounded-lg mb-4">
      <div className="flex items-center gap-3 pt-2">
        <div className="">
          <img
            className="rounded-full "
            src="https://via.placeholder.com/40"
            alt="photo"
          />
        </div>
        <div className="">
          <h2 className="font-medium">Atanu Malik</h2>
          <div className="flex gap-1 items-center">
            <span>
              <Globe size={16} strokeWidth={1.25} />
            </span>

            <span>2hrs</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col py-2">
        <div className="pb-2">caption</div>
        <img
          src="https://yt3.googleusercontent.com/g3j3iOUOPhNxBCNAArBqiYGzHzCBIzr_Al8mdvtBJeZMGFDblnU5rlVUt6GY01AUwm7Cp70J=s900-c-k-c0x00ffffff-no-rj"
          alt="photo"
        />
      </div>
      <div className="flex py-1 border-y dark:dark:border-y-[#3a3b3c]">
        <div className="flex basis-1/3 justify-center transition delay-75 ease-in gap-1 p-2 hover:bg-[#f9188110] hover:text-[#f91880] cursor-pointer rounded-md">
          <Heart />
          <span>React</span>
        </div>
        <div className="flex basis-1/3 justify-center gap-1 p-2 hover:bg-[#1d9cf010] cursor-pointer rounded-md transition delay-75 ease-in hover:text-[#1d9bf0]">
          <MessageCircle />
          <span>Comment</span>
        </div>
        <div className="flex basis-1/3 justify-center gap-1 p-2 hover:bg-[#00ba7c10] cursor-pointer rounded-md transition delay-75 ease-in hover:text-[#00ba7c]">
          <Repeat2 />
          <span>Share</span>
        </div>
      </div>
    </div>
  );
}
