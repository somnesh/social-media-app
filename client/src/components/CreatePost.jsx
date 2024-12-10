import {
  CircleAlert,
  CircleCheck,
  Clapperboard,
  FileVideo,
  Globe,
  Image,
  ImagePlus,
  ListTodo,
  Lock,
  Users,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { CreatePostSubmitLoader } from "./loaders/CreatePostSubmitLoader";
import { useToastHandler } from "../contexts/ToastContext";

export function CreatePost({
  createPostPopUp,
  setCreatePostPopUp,
  setPosts,
  imageFlag,
  setImageFlag,
  setPollFlag,
  pollFlag,
  setUploadProgress,
}) {
  const toastHandler = useToastHandler();
  const [visibility, setVisibility] = useState("public");
  const [isLoading, setIsLoading] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadImagePopUp, setUploadImagePopUp] = useState(false);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [uploadVideoPopUp, setUploadVideoPopUp] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [openPollPopUp, setOpenPollPopUp] = useState(false);
  // for poll
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [duration, setDuration] = useState("1");
  // end poll

  const imageRef = useRef(null);
  const videoRef = useRef(null);

  // const location = useLocation();
  // const res = location.state;

  // const authToken = res.result.accessToken;
  // const decodedToken = jwtDecode(authToken);

  const API_URL = import.meta.env.VITE_API_URL;
  const CLOUD_API = import.meta.env.VITE_CLOUDINARY_CLOUD_API;

  const uploadToCloudinary = async (file) => {
    setUploadProgress(1);
    // Step 1: Get the upload signature from the backend
    const signatureResponse = await axios.get(
      `${API_URL}/cloudinary/cloudinary-signature`
    );
    const { signature, timestamp, cloudName } = signatureResponse.data;

    // Step 2: Create a FormData object with the file and upload details
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", CLOUD_API);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);

    // Step 3: Upload the file to Cloudinary
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      formData,
      {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted); // Update progress bar
        },
      }
    );

    return response.data;
  };

  const closePopup = () => {
    if (createPostPopUp) {
      setCreatePostPopUp(false);
    }
    document.body.classList.remove("overflow-hidden");
  };

  const createPost = async () => {
    const postFormData = new FormData();
    closePopup();

    postFormData.append("content", postContent);
    postFormData.append("visibility", visibility);

    try {
      if (uploadedImage) {
        const file = imageRef.current.files[0];
        const cloudinaryResponse = await uploadToCloudinary(file);
        postFormData.append("image_url", cloudinaryResponse.secure_url);
        postFormData.append("media_type", cloudinaryResponse.resource_type);
      }
      if (uploadedVideo) {
        const file = videoRef.current.files[0];
        const cloudinaryResponse = await uploadToCloudinary(file);
        postFormData.append("image_url", cloudinaryResponse.secure_url);
        postFormData.append("media_type", cloudinaryResponse.resource_type);
      }

      const response = await axios.post(`${API_URL}/post`, postFormData, {
        withCredentials: true,
      });

      setPosts((prev) => [response.data.post, ...prev]);

      toastHandler(
        <div className="flex gap-2 items-center">
          <CircleCheck className="bg-green-600 rounded-full text-white dark:text-[#242526]" />
          <span>Post created</span>
        </div>,
        false
      );
    } catch (error) {
      console.error("Form submission failed : ", error);
      toastHandler(
        <div className="flex gap-2 items-center">
          <CircleAlert className="bg-red-600 rounded-full text-white dark:text-[#7f1d1d]" />
          <span>Something went wrong</span>
        </div>,
        true
      );
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    if (openPollPopUp) {
      createPoll();
    } else {
      createPost();
    }
  };

  const uploadImage = () => {
    imageRef.current.click();
  };

  const uploadVideo = () => {
    videoRef.current.click();
  };

  const togglePopupUploadImage = () => {
    setUploadVideoPopUp(false);
    setOpenPollPopUp(false);
    setUploadImagePopUp(!uploadImagePopUp);
  };

  const togglePopupUploadVideo = () => {
    setOpenPollPopUp(false);
    setUploadImagePopUp(false);
    setUploadVideoPopUp(!uploadVideoPopUp);
    setUploadedVideo(null);
    setPreviewUrl(null);
  };

  const togglePopupPoll = () => {
    setUploadImagePopUp(false);
    setUploadVideoPopUp(false);
    setOpenPollPopUp(!openPollPopUp);
  };

  useEffect(() => {
    if (imageFlag) {
      togglePopupUploadImage();
      setImageFlag(false);
    }

    if (pollFlag) {
      togglePopupPoll();
      setPollFlag(false);
    }
  }, [imageFlag, setImageFlag, pollFlag, setPollFlag]);

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

  const handleVideoChange = (event) => {
    const file = videoRef.current.files[0];
    if (file && file.type.includes("video")) {
      // Create a temporary URL for the video
      const url = URL.createObjectURL(file);
      setUploadedVideo(file);
      setPreviewUrl(url);
    }
  };

  const createPoll = async () => {
    // Basic validation
    if (!question.trim() || options.some((option) => !option.trim())) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true); // Start loading state

      const pollData = {
        question,
        options: options.filter((option) => option.trim()), // Remove empty options
        expiresAt: parseInt(duration, 10), // Convert duration to a number
      };

      const response = await axios.post(`${API_URL}/post/polls`, pollData, {
        withCredentials: true,
      });

      closePopup();
      setPosts((prev) => [response.data.post, ...prev]);

      toastHandler(
        <div className="flex gap-2 items-center">
          <CircleCheck className="bg-green-600 rounded-full text-white dark:text-[#242526]" />
          <span>Post created</span>
        </div>,
        false
      );

      // Reset form after successful creation
      setQuestion("");
      setOptions(["", ""]);
      setDuration("1");
    } catch (error) {
      console.error(
        "Error creating poll:",
        error.response?.data || error.message
      );
      toastHandler(
        <div className="flex gap-2 items-center">
          <CircleAlert className="bg-red-600 rounded-full text-white dark:text-[#7f1d1d]" />
          <span>Something went wrong</span>
        </div>,
        true
      );
    } finally {
      setIsLoading(false); // End loading state
    }
  };

  const addOption = () => {
    if (options.length < 5) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
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
            <TooltipProvider delayDuration="100" disabled={true}>
              <Tooltip>
                <Select
                  onValueChange={(value) => {
                    setVisibility(value);
                  }}
                  name="visibility"
                  defaultValue="public"
                >
                  <TooltipTrigger>
                    <SelectTrigger className="w-[180px] dark:bg-[#3a3c3d]">
                      <SelectValue />
                    </SelectTrigger>
                  </TooltipTrigger>
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

                <TooltipContent>
                  <p>Post visibility</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="my-4">
            {!openPollPopUp && (
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
            )}
            {uploadImagePopUp && (
              <div
                id="uploadPopUp"
                onClick={uploadImage}
                className="relative min-h-52 w-full border-2 border-dashed border-indigo-700 rounded-lg dark:bg-[#212121] flex items-center justify-center cursor-pointer dark:hover:bg-[#181818]"
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
                    togglePopupUploadImage();
                  }}
                  className="py-1 px-1 top-1 right-1 absolute hover:bg-[#F0F2F5] dark:hover:bg-[#414141] rounded-full cursor-pointer"
                >
                  <X />
                </div>
              </div>
            )}
            {uploadVideoPopUp && (
              <div
                id="uploadPopUp"
                onClick={uploadVideo}
                className="relative min-h-52 w-full border-2 border-dashed border-indigo-700 rounded-lg dark:bg-[#212121] flex items-center justify-center cursor-pointer dark:hover:bg-[#181818]"
              >
                <input
                  ref={videoRef}
                  type="file"
                  name="files"
                  accept="video/*"
                  className="hidden"
                  onChange={handleVideoChange}
                />

                {uploadedVideo ? (
                  <video width="440" className="sm:max-h-96 max-h-60" controls>
                    <source src={previewUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <>
                    <Clapperboard />
                    <span>&nbsp;Add video</span>
                  </>
                )}

                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePopupUploadVideo();
                  }}
                  className="py-1 px-1 top-1 right-1 absolute hover:bg-[#F0F2F5] dark:hover:bg-[#414141] rounded-full cursor-pointer"
                >
                  <X />
                </div>
              </div>
            )}
            {openPollPopUp && (
              <div className="w-full max-w-2xl mx-auto">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div>
                      <Label>Question</Label>
                      <Textarea
                        placeholder="Ask a question..."
                        className="min-h-[80px] dark:bg-[#333536]"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                      />
                    </div>
                    <Label>Poll Options</Label>
                    {options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          className={"dark:bg-[#333536]"}
                          placeholder={`Option ${index + 1}`}
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                        />
                        {options.length > 2 && (
                          <Button
                            type={"button"}
                            variant="ghost"
                            size="icon"
                            onClick={() => removeOption(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {options.length < 5 && (
                      <div className="flex justify-center m-auto">
                        <Button
                          type={"button"}
                          variant="outline"
                          className="bg-transparent dark:hover:bg-indigo-900 rounded-full"
                          onClick={addOption}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Option
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Poll Duration</Label>
                    <Select value={duration} onValueChange={setDuration}>
                      <SelectTrigger className={"dark:bg-[#333536]"}>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent className={"dark:bg-[#333536]"}>
                        <SelectItem value="1">1 Day</SelectItem>
                        <SelectItem value="3">3 Days</SelectItem>
                        <SelectItem value="7">1 Week</SelectItem>
                        <SelectItem value="14">2 Weeks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-between my-4 items-center">
            <div className="w-full flex justify-between items-center border border-[#ced0d4] dark:border-[#3e4042] pl-3 pr-2 py-1 mr-2 rounded-md">
              <span className="">Add to your post</span>
              <div>
                <TooltipProvider delayDuration="100" disabled={true}>
                  <Tooltip>
                    <TooltipTrigger
                      onClick={() => {
                        togglePopupUploadImage();
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
                      onClick={() => {
                        togglePopupUploadVideo();
                      }}
                      type="button"
                      className="p-2 rounded-full hover:bg-[#d3d5d8] dark:hover:bg-[#414141]"
                    >
                      <FileVideo />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Video</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger
                      onClick={() => togglePopupPoll()}
                      type="button"
                      className="p-2 rounded-full hover:bg-[#d3d5d8] dark:hover:bg-[#414141]"
                    >
                      <ListTodo />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Poll</p>
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
