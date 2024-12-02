import { Bell, Bookmark, Home, UserCheck, Users } from "lucide-react";
import { useState } from "react";

export function Sidebar({ variant, setCurrentPage }) {
  const selectColor = "#0866ff";
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  return (
    <section
      className={`flex sm:flex-col justify-around sm:justify-normal sticky z-10 sm:z-0 top-0 p-2 sm:p-0 bg-white sm:border-none border-b shadow-sm dark:bg-black sm:bg-inherit basis-1/4 sm:h-screen lg:sticky sm:top-[4.5rem] overflow-y-auto sm:rounded-md gap-1 sm:max-w-80 transition-transform ${
        isSidebarVisible ? "translate-x-0" : "-translate-x-0"
      } lg:translate-x-0`}
    >
      <div className={`flex`}>
        <div
          onClick={() => {
            if (variant !== "home") setCurrentPage("home");
          }}
          className={`flex items-center gap-2 py-3 px-4 cursor-pointer rounded-full ${
            variant !== "home"
              ? "hover:bg-[#e3e5e9] dark:hover:bg-[#414141]"
              : "dark:bg-blue-950 bg-blue-200"
          }`}
        >
          {variant === "home" ? (
            <svg viewBox="0 0 24 24" width="24" height="24" fill={selectColor}>
              <path d="M9.464 1.286C10.294.803 11.092.5 12 .5c.908 0 1.707.303 2.537.786.795.462 1.7 1.142 2.815 1.977l2.232 1.675c1.391 1.042 2.359 1.766 2.888 2.826.53 1.059.53 2.268.528 4.006v4.3c0 1.355 0 2.471-.119 3.355-.124.928-.396 1.747-1.052 2.403-.657.657-1.476.928-2.404 1.053-.884.119-2 .119-3.354.119H7.93c-1.354 0-2.471 0-3.355-.119-.928-.125-1.747-.396-2.403-1.053-.656-.656-.928-1.475-1.053-2.403C1 18.541 1 17.425 1 16.07v-4.3c0-1.738-.002-2.947.528-4.006.53-1.06 1.497-1.784 2.888-2.826L6.65 3.263c1.114-.835 2.02-1.515 2.815-1.977zM10.5 13A1.5 1.5 0 0 0 9 14.5V21h6v-6.5a1.5 1.5 0 0 0-1.5-1.5h-3z"></path>
            </svg>
          ) : (
            <Home />
          )}
          <span
            className={`${
              variant === "home" ? `font-bold text-[${selectColor}]` : ""
            } hidden sm:block`}
          >
            Home
          </span>
        </div>
      </div>
      <div className={`flex`}>
        <div
          onClick={() => {
            if (variant !== "followers") setCurrentPage("followers");
          }}
          className={`flex items-center gap-2 py-3 px-4 cursor-pointer rounded-full ${
            variant !== "followers"
              ? "hover:bg-[#e3e5e9] dark:hover:bg-[#414141]"
              : "dark:bg-blue-950 bg-blue-200"
          }`}
        >
          {variant === "followers" ? (
            <Users fill={selectColor} stroke={selectColor} />
          ) : (
            <Users />
          )}
          <span
            className={`${
              variant === "followers" ? `font-bold text-[${selectColor}]` : ""
            } hidden sm:block`}
          >
            Followers
          </span>
        </div>
      </div>
      <div className={`flex`}>
        <div
          onClick={() => {
            if (variant !== "following") setCurrentPage("following");
          }}
          className={`flex items-center gap-2 py-3 px-4 cursor-pointer rounded-full ${
            variant !== "following"
              ? "hover:bg-[#e3e5e9] dark:hover:bg-[#414141]"
              : "dark:bg-blue-950 bg-blue-200"
          }`}
        >
          {variant === "following" ? (
            <UserCheck fill={selectColor} stroke={selectColor} />
          ) : (
            <UserCheck />
          )}
          <span
            className={`${
              variant === "following" ? `font-bold text-[${selectColor}]` : ""
            } hidden sm:block`}
          >
            Following
          </span>
        </div>
      </div>
      <div className="flex sm:hidden">
        <div
          onClick={() => {
            if (variant !== "notification") setCurrentPage("notification");
          }}
          className={`flex items-center gap-2 py-3 px-4 cursor-pointer rounded-full ${
            variant !== "notification"
              ? "hover:bg-[#e3e5e9] dark:hover:bg-[#414141]"
              : "dark:bg-blue-950 bg-blue-200"
          }`}
        >
          {variant === "notification" ? (
            <Bell fill={selectColor} stroke={selectColor} />
          ) : (
            <Bell />
          )}
          <span
            className={`${
              variant === "notification"
                ? `font-bold text-[${selectColor}]`
                : ""
            } hidden sm:block`}
          >
            Notification
          </span>
        </div>
      </div>
      <div className={`flex`}>
        <div
          onClick={() => {
            if (variant !== "saved") setCurrentPage("saved");
          }}
          className={`flex items-center gap-2 py-3 px-4 cursor-pointer rounded-full ${
            variant !== "saved"
              ? "hover:bg-[#e3e5e9] dark:hover:bg-[#414141]"
              : "dark:bg-blue-950 bg-blue-200"
          }`}
        >
          {variant === "saved" ? (
            <Bookmark fill={selectColor} stroke={selectColor} />
          ) : (
            <Bookmark />
          )}
          <span
            className={`${
              variant === "saved" ? `font-bold text-[${selectColor}]` : ""
            } hidden sm:block`}
          >
            Saved
          </span>
        </div>
      </div>
    </section>
  );
}
