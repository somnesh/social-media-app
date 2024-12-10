import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Menu, Moon, Sun, SunMoon } from "lucide-react";
import useTheme from "@/contexts/theme";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function AdminHeader({ onMenuButtonClick, setPageLoading }) {
  const { theme, darkTheme, lightTheme } = useTheme();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const switchTheme = (e) => {
    if (theme === "white") {
      darkTheme(e);
    } else {
      lightTheme(e);
    }
  };

  const handleLogout = async () => {
    setPageLoading(true);
    localStorage.clear();

    try {
      await axios.post(
        `${API_URL}/admin/logout`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error(error);
    } finally {
      navigate("/admin");
      setPageLoading(false);
    }
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-black border-b">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuButtonClick}
          className="mr-4 lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative w-10 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={localStorage?.avatar || ""} />
                <AvatarFallback
                  className={localStorage.avatarBg || "bg-purple-500"}
                >
                  {localStorage.name ? localStorage.name[0] : "#"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {localStorage.name || "#"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {localStorage.email || "#"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
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
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
