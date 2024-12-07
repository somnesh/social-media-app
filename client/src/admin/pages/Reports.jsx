import { useState, useEffect } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Reports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    async function fetchReports() {
      // Mock API call to fetch reports
      const data = [
        {
          id: 1,
          type: "Spam",
          reporter: "John Doe",
          reportedUser: "Jane Smith",
          status: "Pending",
          createdAt: "2023-06-01",
        },
        {
          id: 2,
          type: "Harassment",
          reporter: "Alice Johnson",
          reportedUser: "Bob Williams",
          status: "Under Review",
          createdAt: "2023-06-02",
        },
        {
          id: 3,
          type: "Inappropriate Content",
          reporter: "Charlie Brown",
          reportedUser: "David Lee",
          status: "Resolved",
          createdAt: "2023-06-03",
        },
      ];
      setReports(data);
    }
    fetchReports();
  }, []);

  const columns = [
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "reporter",
      header: "Reporter",
    },
    {
      accessorKey: "reportedUser",
      header: "Reported User",
    },
    {
      accessorKey: "status",
      header: ({ column }) =>
        column ? (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(
                column.getIsSorted() === "asc" ? "desc" : "asc"
              )
            }
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          "Status"
        ),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
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
                  navigator.clipboard.writeText(report.id.toString())
                }
              >
                Copy report ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>Mark as resolved</DropdownMenuItem>
              <DropdownMenuItem>Dismiss report</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: reports,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Reports</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : header.column.columnDef.header instanceof Function
                      ? header.column.columnDef.header({
                          column: header.column,
                        })
                      : header.column.columnDef.header}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {cell.column.columnDef.cell
                        ? cell.column.columnDef.cell({ row, cell })
                        : cell.getValue()}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
