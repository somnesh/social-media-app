import { Button } from "@/components/ui/button";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DataTable from "../components/DataTable";
import { useEffect, useState } from "react";
import axios from "axios";
import UserDetailsDialog from "./UserDetailsDialog";

const API_URL = import.meta.env.VITE_API_URL;

async function getUsers({ page, limit, sortField, sortOrder }) {
  try {
    const response = await axios.get(`${API_URL}/admin/user-management`, {
      params: { page, limit, sortField, sortOrder },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
export default function Users() {
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [sorting, setSorting] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [user, setUser] = useState([]);

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
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;

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
                onClick={() => navigator.clipboard.writeText(user._id)}
              >
                Copy user ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  handleViewUserDetails(user._id);
                }}
              >
                View user details
              </DropdownMenuItem>
              <DropdownMenuItem>Delete user</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
    // Here you would typically send the updated user data to your backend
    console.log("User updated:", updatedUser);
    setIsDialogOpen(false);
  };

  return (
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
      {console.log(user)}
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
  );
}
