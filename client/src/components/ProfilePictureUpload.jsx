import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CircleAlert,
  CircleCheck,
  ImageIcon,
  Loader2,
  UploadIcon,
} from "lucide-react";
import axios from "axios";
import { useToastHandler } from "../contexts/ToastContext";

export default function ProfilePictureUpload({
  setOpenUploadProfilePhoto,
  setProfilePicture,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const imageRef = useRef(null);

  const toastHandler = useToastHandler();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      // Simulate the file input's `files` property using DataTransfer
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      imageRef.current.files = dataTransfer.files;

      handleFile(file); // Handle the file as usual
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files?.[0]) {
      handleFile(imageRef.current.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    setIsLoading(true);
    const formData = new FormData();

    if (image) {
      formData.append("files", imageRef.current.files[0]);
      try {
        const response = await axios.post(
          `${API_URL}/user/uploads/profile-picture`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );

        // close popup
        setOpenUploadProfilePhoto(false);
        setProfilePicture(response.data.updatedUser.avatar);

        toastHandler(
          <div className="flex gap-2 items-center">
            <CircleCheck className="bg-green-600 rounded-full text-white dark:text-[#242526]" />
            <span>Profile picture updated</span>
          </div>,
          false
        );
        setIsLoading(false);
      } catch (error) {
        console.error("Form submission failed : ", error);
        toastHandler(
          <div className="flex gap-2 items-center">
            <CircleAlert className="bg-red-600 rounded-full text-white dark:text-[#7f1d1d]" />
            <span>Something went wrong</span>
          </div>,
          true
        );
        setIsLoading(false);
      }
    }
  };

  return (
    <Card className="w-full min-w-[20vw] max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center">
          Change Profile Photo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-colors ${
            isDragging
              ? "border-primary bg-primary/10"
              : "border-muted-foreground/25"
          }`}
        >
          {image && (
            <div className="relative aspect-square w-full h-full">
              <img
                src={image}
                alt="Profile photo preview"
                className="object-cover rounded-lg w-full h-full"
              />
            </div>
          )}
          <div
            className={`flex flex-col items-center ${image ? "hidden" : ""}`}
          >
            <div className="rounded-full bg-muted p-4">
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium mb-1">Drag photo here or</p>
              <label htmlFor="file-upload" className="relative cursor-pointer">
                <span className="font-medium text-sm underline">
                  Browse files
                </span>
                <input
                  ref={imageRef}
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileInput}
                />
              </label>
            </div>
            <p className="text-xs text-muted-foreground">
              Supports JPG, GIF or PNG.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSave}
          disabled={!image || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <UploadIcon className="w-4 h-4 mr-2" />
              Save Photo
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
