import {
  LogOut,
  Settings,
  User,
  SunMoon,
  Moon,
  Sun,
  MessageSquareWarning,
} from "lucide-react";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function ProfileMenu() {
  const { theme, darkTheme, lightTheme } = useTheme();

  const navigate = useNavigate();

  const switchTheme = (e) => {
    if (theme === "white") {
      darkTheme(e);
    } else {
      lightTheme(e);
    }
  };
  const API_URL = import.meta.env.VITE_API_URL;
  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
      navigate("/login");
    } catch (error) {
      console.log("Error during logout: ", error);
    }
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer hover:bg-[#e3e5e9] active:bg-[#d0d2d6] dark:hover:bg-[#414141] dark:active:bg-[#313131] active:scale-95 select-none pl-3 pr-1 py-1 rounded-full">
          <span className="dark:text-white bg-inherit hover:bg-inherit font-medium">
            {localStorage.name}
          </span>
          <Avatar>
            <AvatarImage src={localStorage.avatar} />
            <AvatarFallback className={localStorage.avatarBg}>
              {localStorage.name[0]}
            </AvatarFallback>
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

        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer dark:focus:bg-[#414141] dark:text-white"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
