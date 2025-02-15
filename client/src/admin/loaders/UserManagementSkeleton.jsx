import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function UserManagementSkeleton() {
  return (
    <div className="w-full space-y-4 mt-7 px-6">
      <div className="w-48">
        <div className="h-8 w-full animate-pulse rounded-md bg-gray-300 dark:bg-muted" />
      </div>
      <div className="rounded-lg dark:border bg-white dark:bg-inherit">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead className="w-[300px]">Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="h-4 w-3/4 animate-pulse rounded bg-gray-300 dark:bg-muted" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-full animate-pulse rounded bg-gray-300 dark:bg-muted" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-16 animate-pulse rounded bg-gray-300 dark:bg-muted" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-16 animate-pulse rounded bg-gray-300 dark:bg-muted" />
                </TableCell>
                <TableCell>
                  <div className="h-8 w-8 animate-pulse rounded bg-gray-300 dark:bg-muted" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" disabled>
          Previous
        </Button>
        <Button variant="outline" disabled>
          Next
        </Button>
      </div>
    </div>
  );
}
