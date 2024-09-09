import {
  LogOut,
  Settings,
  User,
  SunMoon,
  Moon,
  Sun,
  MessageSquareWarning,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useTheme from "../contexts/theme";
import { jwtDecode } from "jwt-decode";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ProfileMenu() {
  const { theme, darkTheme, lightTheme } = useTheme();

  const authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmE0YTViNzZmZWNhM2JmNGU0OTA1ZmUiLCJuYW1lIjoiSm9obiBEb2UiLCJyb2xlIjoidXNlciIsImF2YXRhciI6bnVsbCwiaWF0IjoxNzI1NzkwNTU5LCJleHAiOjE3MjY2NTQ1NTl9.W9wL3vbaVVcZqHn8tT9oujSZcxy8qHrqGEfgPdc0CYA";
  const decodedToken = jwtDecode(authToken);

  const switchTheme = (e) => {
    if (theme === "white") {
      darkTheme(e);
    } else {
      lightTheme(e);
    }
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer hover:bg-[#e3e5e9] active:bg-[#d0d2d6] dark:hover:bg-[#414141] dark:active:bg-[#313131] active:scale-95 select-none pl-3 pr-1 py-1 rounded-full">
          <span className="dark:text-white bg-inherit hover:bg-inherit">
            {decodedToken.name}
          </span>
          <Avatar>
            <AvatarImage
              src={
                decodedToken.avatar ||
                "https://yt3.googleusercontent.com/g3j3iOUOPhNxBCNAArBqiYGzHzCBIzr_Al8mdvtBJeZMGFDblnU5rlVUt6GY01AUwm7Cp70J=s900-c-k-c0x00ffffff-no-rj"
              }
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48 dark:bg-[#242526]  dark:text-white dark:border-none">
        <DropdownMenuGroup>
          <DropdownMenuItem className="dark:focus:bg-[#414141] dark:focus:text-white cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer dark:focus:bg-[#414141] dark:text-white">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuGroup>
          <DropdownMenuSub className="dark:hover:text-black dark:focus:bg-[#414141]">
            <DropdownMenuSubTrigger className="cursor-pointer dark:focus:bg-[#414141]">
              <SunMoon className="mr-2 h-4 w-4" />
              <span>Themes</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="dark:bg-[#242526] dark:text-white dark:border-none">
                {theme === "dark" && (
                  <>
                    <DropdownMenuItem
                      disabled={true}
                      className="cursor-pointer dark:text-white dark:bg-blue-400 data-[disabled]:opacity-100 mb-1"
                    >
                      <Moon className="mr-2 h-4 w-4" />
                      <span>Dark Mode</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={switchTheme}
                      className="cursor-pointer dark:focus:bg-[#414141] dark:text-white"
                    >
                      <Sun className="mr-2 h-4 w-4" />
                      <span>Light Mode</span>
                    </DropdownMenuItem>
                  </>
                )}
                {theme === "white" && (
                  <>
                    <DropdownMenuItem
                      onClick={switchTheme}
                      className="cursor-pointer dark:focus:bg-[#414141] dark:text-white mb-1"
                    >
                      <Moon className="mr-2 h-4 w-4" />
                      <span>Dark Mode</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      disabled={true}
                      className="cursor-pointer text-white dark:focus:bg-[#414141] dark:text-white bg-blue-400 data-[disabled]:opacity-100"
                    >
                      <Sun className="mr-2 h-4 w-4" />
                      <span>Light Mode</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem className="cursor-pointer dark:focus:bg-[#414141] dark:text-white">
            <MessageSquareWarning className="mr-2 h-4 w-4" />
            <span>Feedback</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuItem className="cursor-pointer dark:focus:bg-[#414141] dark:text-white">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
