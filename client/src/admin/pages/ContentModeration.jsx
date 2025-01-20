import { format } from "date-fns";
import { useEffect, useState } from "react";
import { MoreHorizontal, CircleCheck, Loader2, CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ContentModerationSkeleton } from "../loaders/ContentModerationSkeleton";
import DataTable from "../components/DataTable";
import axios from "axios";
import { Link } from "react-router-dom";
import { useToastHandler } from "@/contexts/ToastContext";

export default function ContentModeration() {
  const [content, setContent] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;
  const APP_URL = import.meta.env.VITE_APP_URL;

  const getContent = async ({ page, limit }) => {
    try {
      setPageLoading(true);
      const response = await axios.get(`${API_URL}/admin/content-moderation`, {
        params: { page, limit },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      console.error(error);
    } finally {
      setPageLoading(false);
    }
  };

  const fetchData = async (page) => {
    const data = await getContent({ page, limit: 10 });
    // console.log(data);

    setContent(data.posts);
    setTotalPages(data.totalPages);
    setCurrentPage(data.currentPage);
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const columns = [
    {
      accessorKey: "media_type",
      header: "Type",
      cell: ({ row }) => {
        const content_url = row.original.media_type || "Text";
        return content_url;
      },
    },
    {
      accessorKey: "image_url",
      header: "Content",
      cell: ({ row }) => {
        const content_url = row.original.image_url;
        const type = row.original.media_type;

        if (type === "image" && content_url) {
          return (
            <img
              src={content_url || "/placeholder.svg"}
              alt="Post content"
              width={100}
              height={100}
              className="object-cover rounded max-h-32"
            />
          );
        } else if (type === "video" && content_url) {
          return (
            <video width="100" height="100" controls className="rounded">
              <source src={content_url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          );
        } else {
          return "No media";
        }
      },
    },
    {
      accessorKey: "content",
      header: "Caption",
      cell: ({ row }) => {
        const caption = row.original.content;
        return <div className="max-w-xs truncate">{caption}</div>;
      },
    },
    {
      accessorKey: "user",
      header: "User",
      cell: ({ row }) => {
        const user = row.original.user;
        return (
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-xs text-muted-foreground">
                @{user.username}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "reportCount",
      header: "Reports",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ getValue }) => {
        const rawDate = getValue();
        return format(new Date(rawDate), "PPP p"); // Example: Nov 1, 2024, 6:39 PM
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const content = row.original;
        const contentType = content.media_type || "text";
        const toastHandler = useToastHandler();

        const deleteMedia = async (postId) => {
          try {
            setLoading(true);
            // console.log(postId);

            const response = await axios.delete(
              `${API_URL}/admin/delete-media/${postId}`,
              { withCredentials: true }
            );

            setContent((prevContent) =>
              prevContent.map((item) =>
                item._id === postId ? { ...item, image_url: null } : item
              )
            );

            toastHandler(
              <div className="flex gap-2 items-center">
                <CircleCheck className="bg-green-600 rounded-full text-white dark:text-[#242526]" />
                <span>{`Media deleted`}</span>
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
            setLoading(false);
          }
        };

        const deletePost = async (postId) => {
          try {
            setLoading(true);
            const response = await axios.delete(`${API_URL}/post/${postId}`, {
              withCredentials: true,
            });

            toastHandler(
              <div className="flex gap-2 items-center">
                <CircleCheck className="bg-green-600 rounded-full text-white dark:text-[#242526]" />
                <span>Post deleted</span>
              </div>,
              false
            );
            setContent((contents) =>
              contents.filter((content) => content._id !== postId)
            );
          } catch (error) {
            console.error(error);
            let msg = "";
            if (error.response) {
              msg = error.response.data.msg;
            }
            toastHandler(
              <div className="flex gap-2 items-center">
                <CircleX className="bg-[#ef4444] rounded-full text-white dark:text-[#7f1d1d]" />
                <span>{msg || "Something went wrong"}</span>
              </div>,
              true
            );
          } finally {
            setLoading(false);
          }
        };

        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger disabled={loading} asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  {loading ? (
                    <>
                      <span className="sr-only">Loading</span>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    <>
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() =>
                    navigator.clipboard.writeText(content._id.toString())
                  }
                >
                  Copy content ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link
                    to={`${APP_URL}/post/${content._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View full content
                  </Link>
                </DropdownMenuItem>
                {contentType !== "text" && content.content && (
                  <div className="flex">
                    <AlertDialog>
                      <AlertDialogTrigger className={"w-full"}>
                        <DropdownMenuItem
                          // onClick={() => {
                          //   setOpenAlert(true);
                          //   setDeleteMediaFlag(true);
                          // }}
                          onSelect={(e) => {
                            e.preventDefault();
                          }}
                          className="cursor-pointer"
                        >
                          Delete media
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="dark:bg-[#242526] dark:border-[#3a3b3c]">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-white text-black dark:hover:bg-gray-300 dark:hover:text-black">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteMedia(content._id)}
                            className="bg-red-600 text-white hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
                <div className="flex">
                  <AlertDialog>
                    <AlertDialogTrigger className={"w-full"}>
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="cursor-pointer"
                      >
                        Delete post
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="dark:bg-[#242526] dark:border-[#3a3b3c]">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white text-black dark:hover:bg-gray-300 dark:hover:text-black">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deletePost(content._id)}
                          className="bg-red-600 text-white hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];

  return (
    <>
      {pageLoading ? (
        <ContentModerationSkeleton />
      ) : (
        <div className="p-6 space-y-6">
          <h1 className="text-3xl font-semibold">Content Moderation</h1>
          <DataTable
            columns={columns}
            data={content}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(newPage) => setCurrentPage(newPage)}
          />
        </div>
      )}
    </>
  );
}
