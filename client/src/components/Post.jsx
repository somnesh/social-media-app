import axios from "axios";
import {
  BookmarkPlus,
  Check,
  CircleCheck,
  CircleX,
  Copy,
  Ellipsis,
  EyeOff,
  FilePenLine,
  FileSymlink,
  FileWarning,
  Globe,
  Heart,
  Loader2,
  Lock,
  MessageCircle,
  Repeat2,
  SendHorizonal,
  Trash2,
  UserCog,
  Users,
  X,
} from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { useToastHandler } from "../contexts/ToastContext";
import { CommentsLoader } from "./loaders/CommentsLoader";
import { CommentStructure } from "./CommentStructure";
import { LikeSkeleton } from "./loaders/LikeSkeleton";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import { ContentEditor } from "./ContentEditor";
import { PostVisibilityEditor } from "./PostVisibilityEditor";
import { ReportEditor } from "./ReportEditor";
import { useAuth } from "../contexts/AuthContext";

export function Post({ details, setPosts }) {
  const [isLoading, setIsLoading] = useState(false);
  const [commentBoxPopup, setCommentBoxPopup] = useState(false);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(details.interactions.like);
  const [likeDetails, setLikeDetails] = useState([]);
  const [isLiked, setIsLiked] = useState(details.isLiked);
  const [commentCounter, setCommentCounter] = useState(
    details.interactions.comment
  );
  const [shareCounter, setShareCounter] = useState(details.interactions.share);
  const [initialCommentLoad, setInitialCommentLoad] = useState(false);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [copyLinkSuccess, setCopyLinkSuccess] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [openMain, setOpenMain] = useState(false); // for shadcn dialog
  const [visibility, setVisibility] = useState("public"); // share post visibility
  const [openShareEditor, setOpenShareEditor] = useState(false);
  const [openPostMenu, setOpenPostMenu] = useState(false);
  const [openPostEditor, setOpenPostEditor] = useState(false);
  const [openReportPostEditor, setOpenReportPostEditor] = useState(false);
  const [openPostVisibilityEditor, setOpenPostVisibilityEditor] =
    useState(false);
  const [postCaption, setPostCaption] = useState(details.content);

  const limit = 4; // comment load limit

  const navigate = useNavigate();
  const toastHandler = useToastHandler();
  const { setIsAuthenticated, isAuthenticated } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL;
  const APP_URL = import.meta.env.VITE_APP_URL;

  const postDate = new Date(details.createdAt);

  const calculatePostDuration = (postDate) => {
    const currentDate = new Date();

    const diffInMilliseconds = currentDate - postDate;

    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    if (diffInSeconds < 60) {
      return `Just now`;
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return diffInHours === 1
        ? `about an hour ago`
        : `${diffInHours} hours ago`;
    } else if (diffInDays < 30) {
      return diffInDays === 1 ? `a day ago` : `${diffInDays} days ago`;
    } else {
      return `${postDate.getDate()} ${monthNames[postDate.getMonth()]}`;
    }
  };
  let postDuration = calculatePostDuration(postDate);

  useEffect(() => {
    if (!isAuthenticated) {
      try {
        (async () =>
          await axios.post(
            `${API_URL}/auth/refresh-token`,
            {},
            {
              withCredentials: true,
            }
          ))();
        setIsAuthenticated(true);
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${API_URL}/post/${details._id}`, {
        withCredentials: true,
      });

      toastHandler(
        <div className="flex gap-2 items-center">
          <CircleCheck className="bg-green-600 rounded-full text-white dark:text-[#242526]" />
          <span>Post deleted</span>
        </div>,
        false
      );
      setPosts((posts) =>
        posts.filter((post) => post._id !== response.data.post._id)
      );
    } catch (error) {
      console.error(error);
      toastHandler(
        <div className="flex gap-2 items-center">
          <CircleX className="bg-red-600 rounded-full text-white dark:text-[#7f1d1d]" />
          <span>Something went wrong</span>
        </div>,
        true
      );
    }
  };

  const handleCommentBoxPopup = () => {
    if (isAuthenticated) {
      setCommentBoxPopup(true);
    } else {
      navigate("/login");
    }
  };

  const postComment = async () => {
    if (isAuthenticated) {
      const commentContent = document.getElementById("comment").value;
      if (commentContent !== "") {
        try {
          const response = await axios.post(
            `${API_URL}/post/comment/${details._id}`,
            { content: commentContent },
            { withCredentials: true }
          );
          document.getElementById("comment").value = "";
          setCommentCounter((prev) => prev + 1);
          toastHandler(
            <div className="flex gap-2 items-center">
              <CircleCheck className="bg-green-600 rounded-full text-white dark:text-[#242526]" />
              <span>Comment posted</span>
            </div>,
            false
          );
          setComments((prev) => [...prev, response.data.comment]);

          handleCommentBoxPopup();
        } catch (error) {
          console.error(error);
          toastHandler(
            <div className="flex gap-2 items-center">
              <CircleX className="bg-red-600 rounded-full text-white dark:text-[#7f1d1d]" />
              <span>Something went wrong</span>
            </div>,
            true
          );
        }
      }
    } else {
      navigate("/login");
    }
  };

  const loadComments = async () => {
    try {
      if (isAuthenticated) {
        setCommentBoxPopup(true);
      }
      const response = await axios.get(
        `${API_URL}/post/comment/${details._id}`,
        {
          params: { limit, skip },
          withCredentials: true,
        }
      );

      console.log("response.data: ", response.data);

      const newComments = [...comments, ...response.data];
      setComments(newComments);

      if (response.data.length <= limit) {
        setHasMore(false);
      }
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
    } finally {
      setIsLoading(false);
      setLoadMoreLoading(false);
    }
  };

  useEffect(() => {
    if (initialCommentLoad) {
      loadComments();
    }
  }, [skip]);

  const handleLoadMore = () => {
    setLoadMoreLoading(true);
    setSkip((prevSkip) => prevSkip + limit);
  };

  const loadCommentsInitial = () => {
    if (!initialCommentLoad) {
      setIsLoading(true);
      loadComments();
      setInitialCommentLoad(true);
    }
  };

  const handleLike = async () => {
    console.log(isAuthenticated);

    if (isAuthenticated) {
      try {
        const response = await axios.patch(
          `${API_URL}/post/like/${details._id}`,
          {},
          {
            withCredentials: true,
          }
        );

        if (response.data.message.like) {
          setLikes(likes + 1);
          setIsLiked(true);
        } else {
          setLikes(likes - 1);
          setIsLiked(false);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      navigate("/login");
    }
  };

  const handleLikePopup = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get(`${API_URL}/post/like/${details._id}`, {
        withCredentials: true,
      });

      setLikeDetails(response.data);
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      try {
        const content = postContent;
        const response = await axios.post(
          `${API_URL}/post/share/${
            details.parent ? details.parent._id : details._id
          }`,
          { content: content, visibility: visibility },
          {
            withCredentials: true,
          }
        );

        const postDetails = await axios.get(
          `${API_URL}/post/${response.data.post[0]._id}`,
          {
            withCredentials: true,
          }
        );
        setPosts((prev) => [postDetails.data.post, ...prev]);
        setOpenShareEditor(false);
        toastHandler(
          <div className="flex gap-2 items-center">
            <CircleCheck className="bg-green-600 rounded-full text-white dark:text-[#242526]" />
            <span>Post shared</span>
          </div>,
          false
        );
        setPostContent("");
      } catch (error) {
        console.error("Failed to share post: ", error);
        toastHandler(
          <div className="flex gap-2 items-center">
            <CircleX className="bg-red-600 rounded-full text-white dark:text-[#7f1d1d]" />
            <span>Something went wrong</span>
          </div>,
          true
        );
      }
    } else {
      navigate("/login");
    }
  };

  const handleNotInterested = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/feed/post/dislike`,
        { postId: details._id },
        {
          withCredentials: true,
        }
      );

      toastHandler(
        <div className="flex gap-2 items-center">
          <CircleCheck className="bg-green-600 rounded-full text-white dark:text-[#242526]" />
          <span>Post hidden</span>
        </div>,
        false
      );
    } catch (error) {
      console.error(error);
      toastHandler(
        <div className="flex gap-2 items-center">
          <CircleX className="bg-red-600 rounded-full text-white dark:text-[#7f1d1d]" />
          <span>Something went wrong</span>
        </div>,
        true
      );
    }
  };

  const handleCopyLink = async () => {
    try {
      // encrypt the post id
      const ENCRYPTION_SECRET = import.meta.env.VITE_URL_ENCRYPTION_SECRET;
      const encryptedPostID = CryptoJS.AES.encrypt(
        details._id,
        ENCRYPTION_SECRET
      ).toString();

      const urlSafeEncryptedPostID = encryptedPostID
        .replace(/\+/g, "-")
        .replace(/\//g, "_");

      // adding the link to the clipboard
      await navigator.clipboard.writeText(
        `${APP_URL}/post/${urlSafeEncryptedPostID}`
      );
      setCopyLinkSuccess(true);
      setTimeout(() => {
        setCopyLinkSuccess(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy link: ", err);
    }
  };

  const handleSavePost = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/post/save/${details._id}`,
        {},
        { withCredentials: true }
      );

      toastHandler(
        <div className="flex gap-2 items-center">
          <CircleCheck className="bg-green-600 rounded-full text-white dark:text-[#242526]" />
          <span>Post Saved</span>
        </div>,
        false
      );
    } catch (error) {
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
      setOpenPostMenu(false);
    }
  };

  const handleEditPost = async () => {
    setOpenPostMenu(false);
    setOpenPostEditor(true);
  };

  const handleChangeVisibility = () => {
    setOpenPostMenu(false);
    setOpenPostVisibilityEditor(true);
  };

  const handleReportPost = async () => {
    setOpenPostMenu(false);
    setOpenReportPostEditor(true);
  };

  return (
    <>
      {details.recommended && (
        <div className="rounded-t-lg bg-gray-200 dark:bg-[#303233] px-3 py-1 text-xs">
          <span>Recommended for you</span>
        </div>
      )}
      <div
        className={`bg-white dark:bg-[#242526] px-4 py-2 ${
          details.recommended ? "rounded-b-lg" : "rounded-lg"
        } mb-4 relative transition-all drop-shadow-sm`}
      >
        <div className="flex items-center gap-3 pt-2">
          <div className="">
            <Avatar>
              <AvatarImage src={details.avatar} />
              <AvatarFallback>{details.user_id.name[0]}</AvatarFallback>
            </Avatar>
          </div>
          <div className="">
            <h2 className="font-medium">{details.user_id.name}</h2>
            <div className="flex gap-1 items-center">
              <span>
                {visibility === "public" ? (
                  <Globe size={16} strokeWidth={1.25} />
                ) : visibility === "friends" ? (
                  <Users size={16} strokeWidth={1.25} />
                ) : (
                  <Lock size={16} strokeWidth={1.25} />
                )}
              </span>
              <span> · {postDuration}</span>
            </div>
          </div>
          <Popover open={openPostMenu} onOpenChange={setOpenPostMenu}>
            <PopoverTrigger asChild>
              <div className="py-1 px-1 top-2 right-2 absolute hover:bg-[#F0F2F5] dark:hover:bg-[#414141] rounded-full cursor-pointer transition">
                <Ellipsis />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-48 dark:bg-[#242526] border dark:border-[#3a3b3c] p-1 text-sm select-none">
              <div className="flex flex-col gap-1">
                {details.recommended && (
                  <div
                    onClick={handleNotInterested}
                    className="flex hover:bg-[#f3f4f6] dark:hover:bg-[#414141] cursor-pointer px-2 py-1.5 rounded-sm items-center"
                  >
                    <EyeOff className="mr-2 h-5 w-5" />
                    <span>Not interested</span>
                  </div>
                )}
                {isAuthenticated && (
                  <div
                    onClick={handleSavePost}
                    className="flex hover:bg-[#f3f4f6] dark:hover:bg-[#414141] cursor-pointer px-2 py-1.5 rounded-sm items-center"
                  >
                    <BookmarkPlus className="mr-2 h-5 w-5" />
                    <span>Save post</span>
                  </div>
                )}
                {localStorage.id === details.user_id._id && (
                  <>
                    <div
                      onClick={handleEditPost}
                      className="flex hover:bg-[#f3f4f6] dark:hover:bg-[#414141] cursor-pointer p-2 py-1.5 rounded-sm items-center"
                    >
                      <FilePenLine className="mr-2 h-5 w-5" />
                      <span>Edit</span>
                    </div>
                    <div
                      onClick={handleChangeVisibility}
                      className="flex hover:bg-[#f3f4f6] dark:hover:bg-[#414141] cursor-pointer p-2 py-1.5 rounded-sm items-center"
                    >
                      <UserCog className="mr-2 h-5 w-5" />
                      <span>Change visibility</span>
                    </div>

                    <AlertDialog>
                      <AlertDialogTrigger className="outline-none">
                        <div className="flex hover:bg-[#f3f4f6] dark:hover:bg-[#414141] cursor-pointer py-1.5 p-2 rounded-sm items-center">
                          <Trash2 className="mr-2 h-5 w-5" />
                          <span>Delete</span>
                        </div>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="dark:bg-[#242526] dark:border-[#3a3b3c]">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete this post.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-white text-black dark:hover:bg-gray-300 dark:hover:text-black">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 text-white hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
                <div
                  onClick={handleReportPost}
                  className="flex hover:bg-[#f3f4f6] dark:hover:bg-[#414141] cursor-pointer px-2 py-1.5 rounded-sm items-center"
                >
                  <FileWarning className="mr-2 h-5 w-5" />
                  <span>Report</span>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          {openPostEditor && (
            <ContentEditor
              openEditor={openPostEditor}
              setOpenEditor={setOpenPostEditor}
              currentContent={postCaption}
              setCurrentContent={setPostCaption}
              details={details}
            />
          )}
          {openPostVisibilityEditor && (
            <PostVisibilityEditor
              openPostVisibilityEditor={openPostVisibilityEditor}
              setOpenPostVisibilityEditor={setOpenPostVisibilityEditor}
              visibility={visibility}
              setVisibility={setVisibility}
              details={details}
            />
          )}
          {openReportPostEditor && (
            <ReportEditor
              openReportEditor={openReportPostEditor}
              setOpenReportEditor={setOpenReportPostEditor}
              details={details}
            />
          )}
        </div>
        <div className="flex flex-col py-2">
          <div className="pb-2">{postCaption}</div>
          {details.parent && (
            <div className="border border-[#e4e6eb] dark:border-[#3a3b3c] py-2 px-3 rounded-lg">
              <div className="flex text-sm mb-2 gap-2">
                <Avatar>
                  <AvatarImage src={details.parent.user_id.avatar} />
                  <AvatarFallback>
                    {details.parent.user_id.name[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="">
                  <h2 className="font-medium">{details.parent.user_id.name}</h2>
                  <div className="flex gap-1 items-center">
                    <span>
                      {details.parent.visibility === "public" ? (
                        <Globe size={16} strokeWidth={1.25} />
                      ) : details.parent.visibility === "friends" ? (
                        <Users size={16} strokeWidth={1.25} />
                      ) : (
                        <Lock size={16} strokeWidth={1.25} />
                      )}
                    </span>
                    <span>
                      {" "}
                      ·{" "}
                      {calculatePostDuration(
                        new Date(details.parent.createdAt)
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div className="pb-1">{details.parent.content}</div>
              {details.parent.image_url && (
                <img
                  src={details.parent.image_url}
                  alt="photo"
                  className="rounded-md mb-1"
                />
              )}
            </div>
          )}
          {details.image_url && <img src={details.image_url} alt="photo" />}
        </div>
        <div className="flex justify-between mb-1 text-sm">
          <div className="flex items-center gap-1">
            {likes !== 0 ? (
              <>
                <Dialog>
                  <DialogTrigger
                    onClick={handleLikePopup}
                    className="flex gap-1 hover:underline"
                  >
                    <span className="rounded-full bg-[#f91880] w-fit p-1 h-fit ">
                      <Heart size={13} fill="white" stroke="white" />
                    </span>
                    <span>{likes}</span>
                  </DialogTrigger>
                  <DialogContent className="dark:bg-[#242526] dark:border-[#3a3b3c]">
                    <DialogHeader>
                      <DialogTitle>Likes</DialogTitle>
                      <DialogDescription>
                        {isLoading ? (
                          <LikeSkeleton />
                        ) : (
                          likeDetails.map((like) => (
                            <div
                              key={like._id}
                              className="flex gap-2 items-center mt-4 text-base text-black dark:text-[#e2e4e9]"
                            >
                              <Avatar>
                                <AvatarImage
                                  src={
                                    like.user.avatar ||
                                    "https://yt3.googleusercontent.com/g3j3iOUOPhNxBCNAArBqiYGzHzCBIzr_Al8mdvtBJeZMGFDblnU5rlVUt6GY01AUwm7Cp70J=s900-c-k-c0x00ffffff-no-rj"
                                  }
                                />
                                <AvatarFallback>CN</AvatarFallback>
                              </Avatar>
                              <span>{like.user.name}</span>
                            </div>
                          ))
                        )}
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </>
            ) : (
              <span>Be the first to like this post</span>
            )}
          </div>
          <div className="flex gap-3">
            {commentCounter !== 0 && (
              <div
                onClick={loadCommentsInitial}
                className="hover:underline cursor-pointer"
              >
                {commentCounter}
                {commentCounter === 1 ? " comment" : " comments"}
              </div>
            )}
            <div className="flex gap-2">
              {shareCounter !== 0 && (
                <span>
                  {shareCounter}
                  {shareCounter === 1 ? " share" : " shares"}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex py-1 border-y dark:dark:border-y-[#3a3b3c]">
          <div
            className={`flex active:scale-95 basis-1/3 justify-center transition gap-1 p-2 hover:bg-[#f9188110] hover:text-[#f91880] cursor-pointer rounded-md ${
              isLiked ? "text-[#f91880] font-semibold" : ""
            }`}
            onClick={handleLike}
          >
            <Heart className={isLiked ? "fill-[#f91880]" : ""} />
            <span>React</span>
          </div>
          <div
            onClick={handleCommentBoxPopup}
            className="flex active:scale-95 basis-1/3 justify-center gap-1 p-2 hover:bg-[#1d9cf010] cursor-pointer rounded-md transition hover:text-[#1d9bf0]"
          >
            <MessageCircle />
            <span>Comment</span>
          </div>

          <Dialog open={openMain} onOpenChange={setOpenMain}>
            <DialogTrigger asChild>
              <div className="flex active:scale-95 basis-1/3 justify-center gap-1 p-2 hover:bg-[#00ba7c10] cursor-pointer rounded-md transition  hover:text-[#00ba7c]">
                <Repeat2 />
                <span>Share</span>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md dark:bg-[#242526] dark:border-[#3a3b3c]">
              <DialogHeader>
                <DialogTitle>Share post</DialogTitle>
                <DialogDescription>
                  Share this post with your friends.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-start gap-5 mt-2">
                <div className="flex flex-col gap-1">
                  <Button
                    onClick={handleCopyLink}
                    type="submit"
                    size="sm"
                    className="px-3 bg-transparent border hover:bg-slate-200 dark:bg-white dark:hover:bg-slate-200"
                  >
                    <span className="sr-only">Copy</span>

                    {copyLinkSuccess ? (
                      <Check className="h-4 w-4 text-black" />
                    ) : (
                      <Copy className="h-4 w-4 text-black" />
                    )}
                  </Button>
                  <span className="text-sm">Copy link</span>
                </div>
                <div
                  onClick={() => {
                    if (isAuthenticated) {
                      setOpenShareEditor(true);
                      setOpenMain(false);
                    } else {
                      navigate("/login");
                    }
                  }}
                  className="flex flex-col gap-1 "
                >
                  <Button
                    type="submit"
                    size="sm"
                    className="px-3 bg-transparent border hover:bg-slate-200 dark:bg-white dark:hover:bg-slate-200"
                  >
                    <span className="sr-only">share as a post</span>
                    <FileSymlink className="h-4 w-4 text-black" />
                  </Button>
                  <span className="text-sm text-center">Share as a post</span>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={openShareEditor} onOpenChange={setOpenShareEditor}>
            <DialogTrigger asChild></DialogTrigger>
            <DialogContent className="sm:max-w-md dark:bg-[#242526] dark:border-[#3a3b3c]">
              <DialogHeader>
                <DialogTitle>Share post</DialogTitle>
                <DialogDescription>
                  Say something about the post or just share now.
                </DialogDescription>
              </DialogHeader>
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
                        </SelectContent>
                      </Select>

                      <TooltipContent>
                        <p>Post visibility</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
                </div>
                <div className="flex justify-end items-center">
                  <div>
                    <Button
                      onClick={(e) => handleShare(e)}
                      className="bg-indigo-500 dark:text-white  dark:hover:bg-indigo-600 px-4"
                    >
                      Share now
                    </Button>
                  </div>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        {/* {commentBoxReplies && (
      
      )} */}
        <div>
          {isLoading ? (
            <CommentsLoader />
          ) : (
            comments.map((comment) => (
              <CommentStructure
                key={comment._id}
                details={comment}
                comments={comments}
                setComments={setComments}
                setCommentCounter={setCommentCounter}
                setCommentBoxPopup={setCommentBoxPopup}
              />
            ))
          )}
          {initialCommentLoad && hasMore && (
            <div className="flex gap-1 items-center ml-2">
              <span
                className="cursor-pointer text-sm font-bold"
                onClick={handleLoadMore}
              >
                Load more comments
              </span>
              {loadMoreLoading && (
                <Loader2
                  strokeWidth={3}
                  size={14}
                  className="mr-1 animate-spin"
                />
              )}
            </div>
          )}
        </div>
        {commentBoxPopup && (
          <div>
            <div className="flex mt-2 py-1 pl-3 pr-1 justify-between bg-[#f0f2f5] dark:bg-[#414141] rounded-md items-center">
              <input
                autoFocus
                type="text"
                name="comment"
                id="comment"
                placeholder="Write a comment"
                className="w-full bg-transparent outline-none text-gray-50"
              />
              <div
                onClick={postComment}
                className="active:scale-95 cursor-pointer p-2 bg-indigo-500 hover:bg-indigo-600 active:bg-slate-500 rounded-md transition"
              >
                <SendHorizonal size={18} stroke="white" />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
