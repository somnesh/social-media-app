import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToastHandler } from "../contexts/ToastContext";
import axios from "axios";
import { CircleAlert, CircleCheck, Loader2 } from "lucide-react";

export default function EditProfile({ details, setDetails }) {
  // console.log(details);

  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: details.user[0].name,
    date_of_birth: details.user[0].date_of_birth,
    gender: details.user[0].gender,
    username: details.user[0].username,
    phone_no: details.user[0].phone_no,
    profile_bio: details.user[0].profile_bio,
  });

  const toastHandler = useToastHandler();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // console.log("Form submitted: ", form);

    try {
      await axios.patch(
        `${API_URL}/user/${details.user[0]._id}`,
        { ...form },
        {
          withCredentials: true,
        }
      );

      toastHandler(
        <div className="flex gap-2 items-center">
          <CircleCheck className="bg-green-600 rounded-full text-white dark:text-[#242526]" />
          <span>Profile updated</span>
        </div>,
        false
      );
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);

      toastHandler(
        <div className="flex gap-2 items-center">
          <CircleAlert className="bg-red-600 rounded-full text-white dark:text-[#7f1d1d]" />
          <span>Something went wrong</span>
        </div>,
        true
      );
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Edit Profile
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => {
                  setForm({
                    ...form,
                    name: e.target.value,
                  });
                }}
                placeholder="Name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input
                id="date_of_birth"
                value={form.date_of_birth}
                onChange={(e) => {
                  setForm({
                    ...form,
                    date_of_birth: e.target.value,
                  });
                }}
                type="date"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={form.gender}
                onValueChange={(value) => {
                  setForm({
                    ...form,
                    gender: value,
                  });
                }}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={form.username} disabled />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone_no">Phone Number</Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm dark:bg-[#242526] text-gray-400 border border-r-0 dark:border-[#1f2937] border-gray-200 rounded-l-md">
                  +91
                </span>
                <Input
                  id="phone_no"
                  type="tel"
                  placeholder="9876543210"
                  required
                  value={form.phone_no}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      phone_no: e.target.value,
                    });
                  }}
                  className="rounded-l-none"
                  maxLength={10}
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile_bio">Profile Bio</Label>
            <Textarea
              id="profile_bio"
              value={form.profile_bio}
              onChange={(e) => {
                setForm({
                  ...form,
                  profile_bio: e.target.value,
                });
              }}
              placeholder="Tell us about yourself..."
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Profile"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
