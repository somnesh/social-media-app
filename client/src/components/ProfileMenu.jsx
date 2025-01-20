import {
  LogOut,
  Settings,
  User,
  SunMoon,
  Moon,
  Sun,
  MessageSquareWarning,
  CircleCheck,
  CircleX,
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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import useTheme from "../contexts/theme";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { DialogFooter } from "./ui/dialog";
import { useToastHandler } from "../contexts/ToastContext";

export function ProfileMenu({ setPageLoading }) {
  const { theme, darkTheme, lightTheme } = useTheme();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState("");

  const toastHandler = useToastHandler();

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!localStorage.name) {
      handleLogout();
    }
  }, [navigate]);

  const switchTheme = (e) => {
    if (theme === "white") {
      darkTheme(e);
    } else {
      lightTheme(e);
    }
  };
  const handleLogout = async () => {
    try {
      setPageLoading(true);
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
      localStorage.removeItem("avatar");
      localStorage.removeItem("avatarBg");
      localStorage.removeItem("id");
      localStorage.removeItem("name");
      localStorage.removeItem("username");
      navigate("/login");
      setPageLoading(false);
    } catch (error) {
      console.error("Error during logout: ", error);
    }
  };

  const handleFeedback = async () => {
    try {
      setIsSubmitting(true);

      await axios.post(
        `${API_URL}/feedback`,
        { feedback },
        { withCredentials: true }
      );

      toastHandler(
        <div className="flex gap-2 items-center">
          <CircleCheck className="bg-green-600 rounded-full text-white dark:text-[#242526]" />
          <span>Feedback submitted successfully</span>
        </div>,
        false
      );
    } catch (error) {
      console.error(error);
      let msg = "";
      if (error.response) {
        msg = error.response.data.msg;
      }

      toastHandler(
        <div className="flex gap-2 items-center">
          <CircleX className="bg-red-600 rounded-full text-white dark:text-[#7f1d1d]" />
          <span>{msg || "Something went wrong"}</span>
        </div>,
        true
      );
    } finally {
      setIsSubmitting(false);
      setOpen(false);
    }
  };

  return (
    <>
      {localStorage.name && (
        <>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer hover:bg-[#e3e5e9] active:bg-[#d0d2d6] dark:hover:bg-[#414141] dark:active:bg-[#313131] active:scale-95 select-none px-1 sm:pl-3 sm:pr-1 py-1 rounded-full">
                <span className="dark:text-white bg-inherit hover:bg-inherit font-medium hidden sm:block">
                  {localStorage.name.split(" ")[0]}
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
                <Link to={`/user/${localStorage.username}`}>
                  <DropdownMenuItem className="dark:focus:bg-[#414141] dark:focus:text-white cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </Link>
                <Link to={"/settings"}>
                  <DropdownMenuItem className="cursor-pointer dark:focus:bg-[#414141] dark:text-white">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </Link>
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
                <DropdownMenuItem
                  onClick={setOpen}
                  className="cursor-pointer dark:focus:bg-[#414141] dark:text-white"
                >
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

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger></DialogTrigger>
            <DialogContent className={"gap-0"}>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <DialogHeader>
                  <DialogTitle>Leave Feedback</DialogTitle>
                  <DialogDescription>
                    We'd love to hear what went well or how we can improve the
                    product experience.
                  </DialogDescription>
                </DialogHeader>
                <Textarea
                  className="min-h-[100px] resize-none bg-background"
                  placeholder="Your feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  required
                />
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button
                    type="submit"
                    onClick={handleFeedback}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Feedback"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
}
