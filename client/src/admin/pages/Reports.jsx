import { format } from "date-fns";
import { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import {
  MoreHorizontal,
  ArrowUpDown,
  ExternalLink,
  Loader2,
  CircleX,
  CircleCheck,
} from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import ReportSkeleton from "../loaders/ReportSkeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useToastHandler } from "@/contexts/ToastContext";

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [sorting, setSorting] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;
  const APP_URL = import.meta.env.VITE_APP_URL;

  const columns = [
    {
      accessorKey: "content_type",
      header: "Content type",
    },
    {
      accessorKey: "user_id.name",
      header: "Reporter",
    },
    {
      accessorKey: "report_content",
      header: "Report",
    },
    {
      accessorKey: "reported_content_id",
      header: "Reported content ID",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        if (status === "Pending") {
          return <span className="text-red-400 font-medium">{status}</span>;
        } else if (status === "Under Review") {
          return <span className="text-yellow-400 font-medium">{status}</span>;
        } else {
          return <span className="text-green-400 font-medium">{status}</span>;
        }
      },
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
        const [isLoading, setIsLoading] = useState(false);
        const report = row.original;
        const toastHandler = useToastHandler();
        const markUnderReviewHandler = async (id) => {
          try {
            setIsLoading(true);

            const response = await axios.patch(
              `${API_URL}/report/mark-under-review/${id}`,
              {},
              { withCredentials: true }
            );

            setReports((prev) =>
              prev.map((item) =>
                item._id === id ? { ...item, status: "Under Review" } : item
              )
            );

            toastHandler(
              <div className="flex gap-2 items-center">
                <CircleCheck className="bg-green-600 rounded-full text-white dark:text-[#242526]" />
                <span>{`Marked as Under Review`}</span>
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
            setIsLoading(false);
          }
        };

        const markResolvedHandler = async (id) => {
          try {
            setIsLoading(true);

            const response = await axios.patch(
              `${API_URL}/report/mark-resolved/${id}`,
              {},
              { withCredentials: true }
            );

            setReports((prev) =>
              prev.map((item) =>
                item._id === id ? { ...item, status: "Resolved" } : item
              )
            );

            toastHandler(
              <div className="flex gap-2 items-center">
                <CircleCheck className="bg-green-600 rounded-full text-white dark:text-[#242526]" />
                <span>{`Marked as Resolved`}</span>
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
            setIsLoading(false);
          }
        };

        const dismissReportHandler = async (id) => {
          try {
            setIsLoading(true);

            const response = await axios.delete(
              `${API_URL}/report/delete/${id}`,
              { withCredentials: true }
            );

            setReports((prev) => prev.filter((item) => item._id !== id));

            toastHandler(
              <div className="flex gap-2 items-center">
                <CircleCheck className="bg-green-600 rounded-full text-white dark:text-[#242526]" />
                <span>{`Report dismissed`}</span>
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
            setIsLoading(false);
          }
        };

        return (
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
                onClick={() =>
                  navigator.clipboard.writeText(report._id.toString())
                }
              >
                Copy report ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={(e) => e.preventDefault()}
                  >
                    View details
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] flex flex-col dark:bg-black">
                  <DialogHeader>
                    <DialogTitle>Report Details</DialogTitle>
                    <DialogDescription>
                      User provided report details and the reported post.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="userId">User ID</Label>
                    <Input
                      id="userId"
                      value={report.user_id._id}
                      disabled={true}
                    />
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={report.user_id.name}
                      disabled={true}
                    />
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={`@${report.user_id.username}`}
                      disabled={true}
                    />
                  </div>
                  <Label htmlFor="reason">Report</Label>
                  <Textarea
                    id="reason"
                    value={report.report_content}
                    className="col-span-3"
                    disabled={true}
                  />

                  <Link
                    to={`${APP_URL}/post/${report.reported_content_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-2 bg-slate-900 w-fit text-white font-medium px-3 py-2 rounded-md items-center text-sm hover:bg-slate-800 active:bg-slate-950"
                  >
                    <span>Show the post</span>
                    <ExternalLink size={18} />
                  </Link>
                </DialogContent>
              </Dialog>

              {report.status !== "Resolved" &&
                report.status !== "Under Review" && (
                  <DropdownMenuItem
                    className="cursor-pointer gap-1"
                    onSelect={(e) => e.preventDefault()}
                    onClick={() => {
                      markUnderReviewHandler(report._id);
                    }}
                    disabled={isLoading}
                  >
                    Mark as under review
                    {isLoading && (
                      <Loader2 size={14} className="animate-spin" />
                    )}
                  </DropdownMenuItem>
                )}

              {report.status !== "Resolved" && report.status !== "Pending" && (
                <DropdownMenuItem
                  className="cursor-pointer gap-1"
                  onSelect={(e) => e.preventDefault()}
                  onClick={() => markResolvedHandler(report._id)}
                  disabled={isLoading}
                >
                  Mark as resolved
                  {isLoading && <Loader2 size={14} className="animate-spin" />}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="cursor-pointer gap-1"
                onSelect={(e) => e.preventDefault()}
                onClick={() => dismissReportHandler(report._id)}
                disabled={isLoading}
              >
                Dismiss report
                {isLoading && <Loader2 size={14} className="animate-spin" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  async function fetchReports({ page, limit, sortField, sortOrder }) {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/report`, {
        params: {
          page,
          limit,
          sortField,
          sortOrder,
        },
        withCredentials: true,
      });
      // console.log(response.data);

      return response.data;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const fetchData = async (page, sorting) => {
    const sortField = sorting[0]?.id || "createdAt"; // Default sorting field
    const sortOrder = sorting[0]?.desc ? "desc" : "asc"; // Default sorting order

    const data = await fetchReports({
      page,
      limit: 10,
      sortField,
      sortOrder,
    });

    setReports(data.reports);
    setTotalPages(data.totalPages);
    setCurrentPage(data.currentPage);
  };

  useEffect(() => {
    fetchData(currentPage, sorting);
  }, [currentPage, sorting]);

  const handleSortingChange = (newSorting) => {
    setSorting(newSorting);
    setCurrentPage(1); // Reset to first page on sorting
  };

  return (
    <>
      {loading ? (
        <ReportSkeleton />
      ) : (
        <div className="p-6 space-y-6">
          <h1 className="text-3xl font-semibold">Reports</h1>
          <DataTable
            columns={columns}
            data={reports}
            onSortingChange={handleSortingChange}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(newPage) => setCurrentPage(newPage)}
          />
        </div>
      )}
    </>
  );
}
