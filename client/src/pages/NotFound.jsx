import { PawPrint, TriangleAlert } from "lucide-react";

export function NotFound() {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center gap-2">
      <div className="flex items-center text-3xl text-red-500 font-semibold gap-1">
        <TriangleAlert size={40} />
        <span>404.</span>
        <span className="dark:text-white text-black font-normal">
          That's an error.
        </span>
      </div>
      <div className="text-sm text-gray-400">
        <span>
          The requested resource was not found on this server. That's all we
          know.
        </span>
      </div>
    </div>
  );
}