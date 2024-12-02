import { ShieldX } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

export function BadRequest() {
  return (
    <div className="h-screen w-screen p-3 flex flex-col justify-center items-center gap-2">
      <div className="flex items-center text-3xl text-red-500 font-semibold gap-1">
        <ShieldX size={40} />
        <span>400.</span>
        <span className="dark:text-white text-black font-normal">
          That's an error.
        </span>
      </div>
      <div className="text-sm text-center text-gray-400">
        <span>
          Your client has issued a malformed or illegal request. That's all we
          know.
        </span>
      </div>
      <Link to={"/"} className="mt-2">
        <Button>Go to home</Button>
      </Link>
    </div>
  );
}
