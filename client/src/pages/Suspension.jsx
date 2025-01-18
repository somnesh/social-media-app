import { Button } from "@/components/ui/button";
import { Header } from "../components/Header";
import { FeedSkeleton } from "../components/loaders/FeedSkeleton";
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
import { Link } from "react-router-dom";

export function Suspension() {
  return (
    <div className="flex flex-col gap-3">
      <Header />
      <FeedSkeleton />
      <AlertDialog open={true}>
        <AlertDialogTrigger asChild>
          <Button variant="outline">Show Dialog</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Oops!! You are Suspended</AlertDialogTitle>
            <AlertDialogDescription>
              Unfortunately your account got suspended by Connectify. You can
              contact us via this email: cu360rent@gmail.com
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Link to={"/login"}>
              <AlertDialogAction>Go to login page</AlertDialogAction>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
