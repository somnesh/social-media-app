import { format } from "date-fns";
import { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

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
    accessorKey: "reported_content_id",
    header: "Reported content ID",
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
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
      const report = row.original;

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
              onClick={() =>
                navigator.clipboard.writeText(report._id.toString())
              }
            >
              Copy report ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Mark as under review</DropdownMenuItem>
            <DropdownMenuItem>Mark as resolved</DropdownMenuItem>
            <DropdownMenuItem>Dismiss report</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

async function fetchReports({ page, limit, sortField, sortOrder }) {
  try {
    const response = await axios.get(`${API_URL}/report`, {
      params: {
        page,
        limit,
        sortField,
        sortOrder,
      },
      withCredentials: true,
    });
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [sorting, setSorting] = useState([]);

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
  );
}
