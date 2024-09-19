import { ShieldX } from "lucide-react";

export function BadRequest() {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center gap-2">
      <div className="flex items-center text-3xl text-red-500 font-semibold gap-1">
        <ShieldX size={40} />
        <span>400.</span>
        <span className="dark:text-white text-black font-normal">
          That's an error.
        </span>
      </div>
      <div className="text-sm text-gray-400">
        <span>
          Your client has issued a malformed or illegal request. That's all we
          know.
        </span>
      </div>
    </div>
  );
}
