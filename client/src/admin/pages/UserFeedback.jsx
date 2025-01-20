import React, { useState, Suspense, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { CircleCheck, CircleX, Loader2, MoreHorizontal } from "lucide-react";
import { UserFeedbackSkeleton } from "../loaders/UserFeedbackSkeleton";
import axios from "axios";
import { useToastHandler } from "@/contexts/ToastContext";

export default function UserFeedback() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  function UserFeedbacksTable() {
    const [openMenu, setOpenMenu] = useState(null);
    const [loading, setLoading] = useState(false);
    const toastHandler = useToastHandler();

    const handleCopyFeedbackId = (id) => {
      navigator.clipboard.writeText(id);
      setOpenMenu(null);
    };

    const handleDeleteFeedback = async (id) => {
      try {
        setLoading(true);
        await axios.delete(`${API_URL}/feedback/${id}`, {
          withCredentials: true,
        });

        setFeedbacks((prev) => prev.filter((item) => item._id !== id));

        toastHandler(
          <div className="flex gap-2 items-center">
            <CircleCheck className="bg-green-600 rounded-full text-white dark:text-[#242526]" />
            <span>{`Feedback deleted`}</span>
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
        setOpenMenu(null);
      }
    };

    return (
      <div className="rounded-md dark:border bg-white dark:bg-inherit">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Feedback</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedbacks && feedbacks.length > 0 ? (
              feedbacks.map((feedback) => (
                <TableRow key={feedback._id}>
                  <TableCell>{feedback.user_id._id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{feedback.user_id.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {feedback.user_id.username}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{feedback.feedback}</TableCell>
                  <TableCell>
                    {new Date(feedback.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu
                      open={openMenu === feedback._id}
                      onOpenChange={(open) =>
                        setOpenMenu(open ? feedback._id : null)
                      }
                    >
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => handleCopyFeedbackId(feedback._id)}
                        >
                          Copy feedback ID
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              className="cursor-pointer gap-1"
                              onSelect={(e) => e.preventDefault()}
                              disabled={loading}
                            >
                              Delete feedback
                              {loading && (
                                <Loader2 size={14} className="animate-spin" />
                              )}
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the feedback from our
                                servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel
                                onClick={() => setOpenMenu(null)}
                              >
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteFeedback(feedback._id)
                                }
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  }
  const fetchFeedbackData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/feedback`, {
        withCredentials: true,
      });

      return response.data.feedbacks;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const temp = await fetchFeedbackData();
      setFeedbacks(temp);
    })();
  }, []);

  return (
    <>
      {isLoading ? (
        <UserFeedbackSkeleton />
      ) : (
        <div className="p-6 space-y-6">
          <h1 className="text-3xl font-semibold">User Feedbacks</h1>
          <UserFeedbacksTable />
        </div>
      )}
    </>
  );
}
