import {
  CircleAlert,
  CircleCheck,
  Globe,
  Image,
  ImagePlus,
  ListTodo,
  Lock,
  MapPin,
  Users,
  X,
} from "lucide-react";

import { Button } from "./ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRef, useState } from "react";
import axios from "axios";
import { CreatePostSubmitLoader } from "./loaders/CreatePostSubmitLoader";
// import { jwtDecode } from "jwt-decode";
import { useToastHandler } from "../contexts/ToastContext";
// import { useLocation } from "react-router-dom";

export function CreatePost({
  createPostPopUp,
  setCreatePostPopUp,
  refreshFeed,
  setRefreshFeed,
}) {
  const toastHandler = useToastHandler();
  const [visibility, setVisibility] = useState("public");
  const [isLoading, setIsLoading] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadImagePopUp, setUploadImagePopUp] = useState(false);
  const imageRef = useRef(null);

  // const location = useLocation();
  // const res = location.state;

  // const authToken = res.result.accessToken;
  // const decodedToken = jwtDecode(authToken);

  const API_URL = import.meta.env.VITE_API_URL;

  const closePopup = () => {
    if (createPostPopUp) {
      setCreatePostPopUp(false);
    }
    document.body.classList.remove("overflow-hidden");
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const formData = new FormData();

    formData.append("content", postContent);
    formData.append("visibility", visibility);

    if (uploadedImage) {
      formData.append("files", imageRef.current.files[0]);
    }
    console.log(formData.get("files"));
    try {
      const response = await axios.post(`${API_URL}/post`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      console.log("Form submitted : ", response);
      console.log(response.data);
      closePopup();
      setRefreshFeed(!refreshFeed);

      toastHandler(
        <div className="flex gap-2 items-center">
          <CircleCheck className="bg-green-600 rounded-full text-white dark:text-[#242526]" />
          <span>Post created</span>
        </div>,
        false
      );
    } catch (error) {
      console.log("Form submission failed : ", error);
      toastHandler(
        <div className="flex gap-2 items-center">
          <CircleAlert className="bg-red-600 rounded-full text-white dark:text-[#7f1d1d]" />
          <span>Something went wrong</span>
        </div>,
        true
      );
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImage = () => {
    imageRef.current.click();
  };

  const togglePopupUploadImage = (e) => {
    if (!uploadImagePopUp) {
      e.classList.remove("hidden");
    } else {
      e.classList.add("hidden");
      setUploadedImage(null);
    }
    setUploadImagePopUp(!uploadImagePopUp);
  };

  const handleFileChange = () => {
    const file = imageRef.current.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result); // Set the preview source to the image data
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center bg-opacity-30 backdrop-blur-[1px] backdrop-brightness-[.3] items-center z-50">
      <div className="bg-white dark:bg-[#242526] px-4 rounded-md md:min-w-[30rem] shadow-2xl pt-1">
        <div className="flex relative border-b items-center">
          <h2 className="text-xl py-2 grow text-center">Create Post</h2>
          <div
            onClick={closePopup}
            className="py-1 px-1 absolute right-0 hover:bg-[#F0F2F5] dark:hover:bg-[#414141] rounded-full cursor-pointer"
          >
            <X />
          </div>
        </div>
        {isLoading && <CreatePostSubmitLoader />}
        <form>
          <div className="flex justify-between items-center">
            <div className="flex gap-2 py-2 items-center">
              <Avatar>
                <AvatarImage src={localStorage.avatar} />
                <AvatarFallback className={localStorage.avatarBg}>
                  {localStorage.name[0]}
                </AvatarFallback>
              </Avatar>
              <span>{localStorage.name}</span>
            </div>
            <Select
              onValueChange={(value) => {
                setVisibility(value);
              }}
              name="visibility"
              defaultValue="public"
            >
              <SelectTrigger className="w-[180px] dark:bg-[#3a3c3d]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="dark:bg-[#242526]">
                <SelectItem value="public">
                  <div className="flex items-center gap-1">
                    <Globe size={16} />
                    <span>Public</span>
                  </div>
                </SelectItem>
                <SelectItem value="friends">
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    <span>Friends</span>
                  </div>
                </SelectItem>
                <SelectItem value="private">
                  <div className="flex items-center gap-1">
                    <Lock size={16} />
                    <span>Private</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="my-4">
            <textarea
              autoFocus
              className="min-w-full min-h-32 p-2 rounded-md border bg-[#F0F2F5] dark:bg-[#333536] resize-none outline-none"
              name="content"
              id=""
              placeholder="Start writing here ..."
              value={postContent}
              onChange={(e) => {
                setPostContent(e.target.value);
              }}
            ></textarea>

            <div
              id="uploadPopUp"
              onClick={uploadImage}
              className="relative min-h-52 w-full border-2 border-dashed border-indigo-700 rounded-lg dark:bg-[#212121] flex items-center justify-center cursor-pointer dark:hover:bg-[#181818] hidden"
            >
              <input
                ref={imageRef}
                type="file"
                name="files"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              {uploadedImage ? (
                <img
                  src={uploadedImage}
                  alt="Preview"
                  className="max-h-52 w-auto object-contain"
                />
              ) : (
                <>
                  <ImagePlus />
                  <span>&nbsp;Add image</span>
                </>
              )}

              <div
                onClick={(e) => {
                  e.stopPropagation();
                  togglePopupUploadImage(e.currentTarget.parentElement);
                }}
                className="py-1 px-1 top-1 right-1 absolute right-0 hover:bg-[#F0F2F5] dark:hover:bg-[#414141] rounded-full cursor-pointer"
              >
                <X />
              </div>
            </div>
          </div>
          <div className="flex justify-between my-4 items-center">
            <div className="w-full flex justify-between items-center border border-[#ced0d4] dark:border-[#3e4042] pl-3 pr-2 py-1 mr-2 rounded-md">
              <span className="">Add to your post</span>
              <div>
                <TooltipProvider delayDuration="100" disabled={true}>
                  <Tooltip>
                    <TooltipTrigger
                      onClick={() => {
                        const e = document.getElementById("uploadPopUp");
                        togglePopupUploadImage(e);
                      }}
                      type="button"
                      className="p-2 rounded-full hover:bg-[#d3d5d8] dark:hover:bg-[#414141]"
                    >
                      <Image />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Image</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger
                      type="button"
                      className="p-2 rounded-full hover:bg-[#d3d5d8] dark:hover:bg-[#414141]"
                    >
                      <ListTodo />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Poll</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger
                      type="button"
                      className="p-2 rounded-full hover:bg-[#d3d5d8] dark:hover:bg-[#414141]"
                    >
                      <MapPin />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Location</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <div>
              <Button
                onClick={handleSubmit}
                className="bg-indigo-500 dark:text-white  dark:hover:bg-indigo-600 px-8"
              >
                Post
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
