import {
  LogOut,
  Settings,
  User,
  SunMoon,
  Moon,
  Sun,
  MessageSquareWarning
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ProfileMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span className="dark:text-white bg-inherit hover:bg-inherit cursor-pointer py-4">
          Username
        </span>
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

        {/* <DropdownMenuSeparator className="dark:border-none"/> */}

        <DropdownMenuGroup>
          <DropdownMenuSub className="dark:hover:text-black dark:focus:bg-[#414141]">
            <DropdownMenuSubTrigger className="cursor-pointer dark:focus:bg-[#414141]">
              <SunMoon className="mr-2 h-4 w-4" />
              <span>Themes</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="dark:bg-[#242526] dark:text-white dark:border-none">
                <DropdownMenuItem className="cursor-pointer dark:focus:bg-[#414141] dark:text-white">
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Dark Mode</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer dark:focus:bg-[#414141] dark:text-white">
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Light Mode</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem className="cursor-pointer dark:focus:bg-[#414141] dark:text-white">
            <MessageSquareWarning className="mr-2 h-4 w-4" />
            <span>Feedback</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {/* <DropdownMenuSeparator /> */}

        <DropdownMenuItem className="cursor-pointer dark:focus:bg-[#414141] dark:text-white">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
