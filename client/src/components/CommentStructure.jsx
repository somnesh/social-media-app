import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CircleCheck,
  CircleX,
  Ellipsis,
  FilePenLine,
  Heart,
  MessageCircleWarning,
  Minus,
  SendHorizonal,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axios from "axios";
import { useToastHandler } from "../contexts/ToastContext";
import { ReportEditor } from "./ReportEditor";
import { ContentEditor } from "./ContentEditor";
import { useAuth } from "../contexts/AuthContext";
import encryptPostId from "../utils/encryptPostId";

export function CommentStructure({
  details,
  comments,
  setComments,
  setCommentCounter,
  setCommentBoxPopup,
  replyTreeLimitFlag,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [open, setOpen] = useState(false);
  const [openCommentEditor, setOpenCommentEditor] = useState(false);
  const [openReportEditor, setOpenReportEditor] = useState(false);
  const [commentContent, setCommentContent] = useState(details.content);
  const [likes, setLikes] = useState(details.like_counter);
  const [isLiked, setIsLiked] = useState(details.isLiked);
  const [replies, setReplies] = useState([]);
  const [hasMoreReplies, setHasMoreReplies] = useState(
    details.reply_counter !== 0
  );
  const [replySkip, setReplySkip] = useState(0);
  const [replyBoxPopup, setReplyBoxPopup] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  console.log("CommentStructure.jsx: details: ", details);

  const toastHandler = useToastHandler();
  const { isAuthenticated } = useAuth();

  const handleMouseOver = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setOpen(false);
  };

  const commentDate = new Date(details.createdAt);
  const currentDate = new Date();

  const diffInMilliseconds = currentDate - commentDate;

  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let commentDuration = "";
  if (diffInSeconds < 60) {
    commentDuration = `Just now`;
  } else if (diffInMinutes < 60) {
    commentDuration = `${diffInMinutes}m`;
  } else if (diffInHours < 24) {
    commentDuration = `${diffInHours}h`;
  } else if (diffInDays < 30) {
    commentDuration = `${diffInDays}d`;
  } else {
    commentDuration = `${commentDate.getDate()} ${
      monthNames[commentDate.getMonth()]
    }`;
  }

  const handleCommentBoxPopup = () => {
    if (isAuthenticated) {
      setCommentBoxPopup(false);
      setReplyBoxPopup(true);
    } else {
      navigate("/login");
    }
  };

  const handleEdit = async () => {
    setOpen(false);
    setOpenCommentEditor(true);
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${API_URL}/post/comment/${details._id}`,
        { withCredentials: true }
      );

      setCommentCounter((prev) => prev - 1);
      setComments((comments) =>
        comments.filter((comment) => comment._id !== response.data.comment._id)
      );

      toastHandler(
        <div className="flex gap-2 items-center">
          <CircleCheck className="bg-green-600 rounded-full text-white dark:text-[#242526]" />
          <span>{`Comment deleted`}</span>
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
    }
  };

  const handleLike = async () => {
    if (isAuthenticated) {
      const postLink = `post/${encryptPostId(details.post_id)}`;
      try {
        const response = await axios.patch(
          `${API_URL}/post/comment/${details._id}/like`,
          { postLink, receiverId: details.user._id },
          { withCredentials: true }
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

  const handleCancelReply = async () => {
    setReplyBoxPopup(false);
    if (!replyTreeLimitFlag) {
      setCommentBoxPopup(true);
    }
  };

  const handleReply = async () => {
    if (isAuthenticated) {
      const postLink = `post/${encryptPostId(details.post_id)}`;

      const commentContent = document.getElementById("comment").value;
      if (commentContent !== "") {
        try {
          const response = await axios.post(
            `${API_URL}/post/comment/${
              !details.parent ? details._id : details.parent
            }/reply`,
            {
              content: commentContent,
              postLink,
              receiverId: details.user._id,
            },
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
          console.log("CommentStructure.jsx : response: ", response.data.reply);

          if (!replyTreeLimitFlag) {
            setReplies((prev) => [...prev, response.data.reply]);
          } else {
            setComments((prev) => [...prev, response.data.reply]);
          }

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

  const handleReport = async () => {
    setOpen(false);
    setOpenReportEditor(true);
  };

  const loadReplies = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/post/comment/${details._id}/reply`,
        {
          params: { limit: 4, skip: replySkip },
        }
      );

      setReplies((prevReplies) => [...prevReplies, ...response.data]);
      setReplySkip((prev) => prev + response.data.length);

      // Hide button if fewer replies were returned than requested
      if (response.data.length < 4) {
        setHasMoreReplies(false);
      }
    } catch (error) {
      console.error("Failed to load replies", error);
      setHasMoreReplies(false);
    }
  };

  return (
    <>
      <div
        onMouseEnter={handleMouseOver}
        onMouseLeave={handleMouseLeave}
        className="flex gap-2 m-2"
      >
        <Avatar>
          <AvatarImage src={details.user.avatar} />
          <AvatarFallback className={details.user.avatarBg}>
            {details.user.name[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="flex flex-col bg-[#f0f2f5] dark:bg-[#3a3b3c] px-3 py-2 rounded-xl min-w-44">
            <span className="font-semibold text-sm">{details.user.name}</span>
            <span>{commentContent}</span>
          </div>
          <div className="flex text-xs gap-5 font-medium ml-2">
            <span>{commentDuration}</span>
            <span
              className={`hover:underline cursor-pointer ${
                isLiked && "text-[#f91880] font-bold"
              }`}
              onClick={handleLike}
            >
              {isLiked ? "Liked" : "Like"}
            </span>
            <span
              className="hover:underline cursor-pointer"
              onClick={handleCommentBoxPopup}
            >
              Reply
            </span>
          </div>
        </div>
        <div className="flex relative gap-1 items-start">
          {likes !== 0 && (
            <div className="absolute items-center right-0 text-xs flex px-[0.2rem] py-[0.12rem] dark:bg-slate-500 rounded-full gap-1">
              <span className="rounded-full bg-[#f91880] w-fit p-1 h-fit ">
                <Heart size={10} fill="white" stroke="white" />
              </span>
              <span className="mr-[0.15rem]">{likes}</span>
            </div>
          )}
        </div>
        <div
          className={`flex items-center pb-3 transition-opacity duration-300 `}
        >
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <div
                className={`py-1 px-1 hover:bg-[#F0F2F5] dark:hover:bg-[#414141] rounded-full cursor-pointer transition ${
                  isHovered ? "block" : "hidden"
                }`}
              >
                <Ellipsis size={20} />
              </div>
            </PopoverTrigger>
            <PopoverContent
              side={"right"}
              className="w-48 dark:bg-[#242526] border dark:border-[#3a3b3c] p-1 text-sm select-none"
            >
              {localStorage.id === details.user._id ? (
                <>
                  <div className="flex flex-col gap-1">
                    <AlertDialog>
                      <AlertDialogTrigger className="outline-none">
                        <div className="flex hover:bg-[#f3f4f6] dark:hover:bg-[#414141] cursor-pointer py-1.5 p-2 rounded-sm items-center m-auto">
                          <Trash2 className="mr-2 h-5 w-5" />
                          <span>Delete</span>
                        </div>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="dark:bg-[#242526] dark:border-[#3a3b3c]">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete this comment.
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
                  </div>

                  <div
                    onClick={handleEdit}
                    className="flex hover:bg-[#f3f4f6] dark:hover:bg-[#414141] cursor-pointer p-2 py-1.5 rounded-sm items-center"
                  >
                    <FilePenLine className="mr-2 h-5 w-5" />
                    <span>Edit</span>
                  </div>
                </>
              ) : (
                <div
                  onClick={handleReport}
                  className="flex hover:bg-[#f3f4f6] dark:hover:bg-[#414141] cursor-pointer p-2 py-1.5 rounded-sm items-center"
                >
                  <MessageCircleWarning className="mr-2 h-5 w-5" />
                  <span>Report</span>
                </div>
              )}
            </PopoverContent>
          </Popover>
          {openCommentEditor && (
            <ContentEditor
              openEditor={openCommentEditor}
              setOpenEditor={setOpenCommentEditor}
              currentContent={commentContent}
              setCurrentContent={setCommentContent}
              details={details}
            />
          )}
          {openReportEditor && (
            <ReportEditor
              openReportEditor={openReportEditor}
              setOpenReportEditor={setOpenReportEditor}
              details={details}
            />
          )}
        </div>
      </div>

      <div className="flex flex-col ml-14">
        {replies.map((reply) => (
          // <CommentStructure
          //   key={reply._id}
          //   details={reply}
          //   comments={replies}
          //   setComments={setReplies}
          //   setCommentCounter={setCommentCounter}
          //   setCommentBoxPopup={setCommentBoxPopup}
          // />
          <CommentStructure
            key={reply._id}
            details={reply}
            comments={!replyTreeLimitFlag ? replies : comments}
            setComments={!replyTreeLimitFlag ? setReplies : setComments}
            setCommentCounter={setCommentCounter}
            setCommentBoxPopup={setReplyBoxPopup}
            replyTreeLimitFlag={true}
          />
        ))}
      </div>
      {hasMoreReplies && (
        <div
          onClick={loadReplies}
          className="flex m-auto mt-3 ml-16 cursor-pointer hover:underline"
        >
          <Minus />
          <span className="text-sm font-semibold">Load replies</span>
          <Minus />
        </div>
      )}
      {replyBoxPopup && (
        <div className="mt-2">
          <div className="flex justify-between items-center text-sm font-semibold py-1 px-2 bg-[#f0f2f5] dark:bg-[#5a5a5a] rounded-t-md">
            <span className="px-1">
              replying to{" "}
              {details.user.name === localStorage.name
                ? "yourself"
                : details.user.name}
            </span>
            <div
              onClick={handleCancelReply}
              className="py-1 px-1 hover:bg-[#F0F2F5] dark:hover:bg-[#505050] dark:bg-[#2e2e2e] rounded-full cursor-pointer"
            >
              <X size={14} />
            </div>
          </div>
          <div className="flex py-1 pl-3 pr-1 justify-between bg-[#f0f2f5] dark:bg-[#414141] items-center rounded-b-md">
            <input
              autoFocus
              type="text"
              name="comment"
              id="comment"
              placeholder="Write a comment"
              className="w-full bg-transparent outline-none text-gray-50"
            />
            <div
              onClick={handleReply}
              className="active:scale-95 cursor-pointer p-2 bg-indigo-500 hover:bg-indigo-600 active:bg-slate-500 rounded-md transition"
            >
              <SendHorizonal size={18} stroke="white" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
