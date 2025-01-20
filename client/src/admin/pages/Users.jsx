import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  ArrowUpDown,
  CircleCheck,
  CircleX,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import DataTable from "../components/DataTable";
import { useEffect, useState } from "react";
import axios from "axios";
import UserDetailsDialog from "./UserDetailsDialog";
import { useNavigate } from "react-router-dom";
import UserManagementSkeleton from "../loaders/UserManagementSkeleton";
import { useToastHandler } from "@/contexts/ToastContext";

const API_URL = import.meta.env.VITE_API_URL;
export default function Users() {
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [sorting, setSorting] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  async function getUsers({ page, limit, sortField, sortOrder }) {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/admin/user-management`, {
        params: { page, limit, sortField, sortOrder },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error(error);
      localStorage.clear();
      navigate("/admin");
    } finally {
      setLoading(false);
    }
  }

  const columns = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const isSuspended = row.original.isSuspended;
        const status = row.original.status;

        if (isSuspended) {
          return <span className="text-red-400 font-medium">Suspended</span>;
        } else {
          return <span className="font-medium">{status}</span>;
        }
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
        const [isLoading, setIsLoading] = useState(false);
        const [reason, setReason] = useState("");
        document.body.style.pointerEvents = "auto";
        const toastHandler = useToastHandler();
        const handleSubmit = async (userId) => {
          try {
            setIsLoading(true);
            if (reason === "") return;

            // console.log("Suspension data:", { reason });

            const response = await axios.patch(
              `${API_URL}/admin/suspend-user/${userId}`,
              { reason },
              { withCredentials: true }
            );
            // console.log(response.data);

            setUsers((prevContent) =>
              prevContent.map((item) =>
                item._id === userId
                  ? { ...item, isSuspended: true, suspensionReason: reason }
                  : item
              )
            );

            toastHandler(
              <div className="flex gap-2 items-center">
                <CircleCheck className="bg-green-600 rounded-full text-white dark:text-[#242526]" />
                <span>{`User suspended`}</span>
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
                <CircleX className="bg-[#ef4444] rounded-full text-white dark:text-[#7f1d1d]" />
                <span>{msg || "Something went wrong"}</span>
              </div>,
              true
            );
          } finally {
            setReason("");
            setIsLoading(false);
          }
        };

        const handleRevokeSuspension = async (userId) => {
          try {
            setIsLoading(true);

            const response = await axios.patch(
              `${API_URL}/admin/revoke-suspension/${userId}`,
              {},
              { withCredentials: true }
            );
            // console.log(response.data);

            setUsers((prevContent) =>
              prevContent.map((item) =>
                item._id === userId
                  ? { ...item, isSuspended: false, suspensionReason: null }
                  : item
              )
            );

            toastHandler(
              <div className="flex gap-2 items-center">
                <CircleCheck className="bg-green-600 rounded-full text-white dark:text-[#242526]" />
                <span>{`Suspension revoked`}</span>
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
                <CircleX className="bg-[#ef4444] rounded-full text-white dark:text-[#7f1d1d]" />
                <span>{msg || "Something went wrong"}</span>
              </div>,
              true
            );
          } finally {
            setIsLoading(false);
          }
        };
        return (
          <>
            <DropdownMenu>
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
                  onClick={() => navigator.clipboard.writeText(user._id)}
                >
                  Copy user ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    handleViewUserDetails(user._id);
                  }}
                >
                  View user details
                </DropdownMenuItem>

                {!user.isSuspended ? (
                  <div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className="cursor-pointer"
                        >
                          Suspend user
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Suspend User</DialogTitle>
                          <DialogDescription>
                            Enter the reason for suspending the user.
                          </DialogDescription>
                        </DialogHeader>
                        <form>
                          <div className="grid gap-4 py-4">
                            <div className="grid items-center gap-4">
                              <Textarea
                                id="reason"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="col-span-3"
                                placeholder="What's the reason for suspension"
                                required
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              type="submit"
                              onClick={(event) => {
                                event.preventDefault();
                                handleSubmit(user._id);
                              }}
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Suspending...
                                </>
                              ) : (
                                "Suspend User"
                              )}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                ) : (
                  <div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onSelect={(e) => e.preventDefault()}
                        >
                          Reason for suspension
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Reason for suspension</DialogTitle>
                          <DialogDescription>
                            Admin given reason for the suspension.
                          </DialogDescription>
                        </DialogHeader>
                        <Textarea
                          id="reason"
                          value={user.suspensionReason}
                          className="col-span-3"
                          placeholder="What's the reason for suspension"
                          disabled={true}
                        />
                      </DialogContent>
                    </Dialog>
                    <DropdownMenuItem
                      className="cursor-pointer gap-1"
                      onSelect={(e) => e.preventDefault()}
                      onClick={() => {
                        handleRevokeSuspension(user._id);
                      }}
                      disabled={isLoading}
                    >
                      Revoke suspension
                      {isLoading && (
                        <Loader2 size={14} className="animate-spin" />
                      )}
                    </DropdownMenuItem>
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];

  const handleViewUserDetails = async (id) => {
    setIsDialogOpen(true);
    try {
      const response = await axios.get(`${API_URL}/user/${id}`, {
        withCredentials: true,
      });
      setUser(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async (page, sorting) => {
    const sortField = sorting[0]?.id || "name"; // Default sort field
    const sortOrder = sorting[0]?.desc ? "desc" : "asc"; // Default sort order
    const data = await getUsers({
      page,
      limit: 10,
      sortField,
      sortOrder,
    });
    setUsers(data.users);
    setTotalPages(data.totalPages);
    setCurrentPage(data.currentPage);
  };

  useEffect(() => {
    fetchData(currentPage, sorting);
  }, [currentPage, sorting]);

  const handleSortingChange = (newSorting) => {
    setSorting(newSorting);
    setCurrentPage(1); // Reset to the first page on sorting
  };

  const handleSaveUser = (updatedUser) => {
    setUser(updatedUser);
    // console.log("User updated:", updatedUser);
    setIsDialogOpen(false);
  };

  return (
    <>
      {loading ? (
        <UserManagementSkeleton />
      ) : (
        <div className="p-6 space-y-6">
          <h1 className="text-3xl font-semibold">User Management</h1>
          <DataTable
            columns={columns}
            data={users}
            onSortingChange={handleSortingChange}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(newPage) => setCurrentPage(newPage)}
          />
          {/* {console.log(user)} */}
          {user.length !== 0 && (
            <UserDetailsDialog
              isOpen={isDialogOpen}
              onClose={() => {
                setIsDialogOpen(false);
                setUser([]);
              }}
              user={user}
              onSave={handleSaveUser}
            />
          )}
        </div>
      )}
    </>
  );
}
