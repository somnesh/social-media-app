import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;
  const { username } = useParams();
  console.log("username: ", username);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/user/${username}`, {
          withCredentials: true,
        });
        // setPosts(response.data);

        console.log(response.data);
        // refreshAuthToken();
      } catch (error) {
        console.error(error);
        // navigate("/500");
        // setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);
  return (
    <div className="w-screen h-screen dark:bg-[#18191a] bg-[#f0f2f5]">
      <Header />
      <Card className="w-full max-w-3xl mx-auto overflow-hidden bg-background rounded-b-md">
        {/* Cover Photo */}
        <div className="h-48 relative overflow-hidden">
          <img
            src="https://wallpapers.com/images/featured/shin-chan-cartoon-fz0fu3bteejyo8ni.jpg"
            alt="Shin-chan cover photo"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background via-background/30 to-transparent" />
        </div>

        {/* Profile Section */}
        <div className="px-4 pb-4 pt-0 md:px-6 relative">
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-6">
            {/* Profile Picture */}
            <div className="relative -mt-12 h-32 w-32 overflow-hidden rounded-full border-4 border-background bg-muted">
              <div className="flex h-full items-center justify-center bg-muted">
                <img
                  src="https://wallpapers.com/images/featured/shin-chan-cartoon-fz0fu3bteejyo8ni.jpg"
                  alt=""
                />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold">Somnesh Mukhepad</h1>
                  <p className="text-sm text-muted-foreground">@username</p>
                </div>
                <Button variant="outline" className="shrink-0">
                  Follow
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
            <div className="flex gap-1">
              <span className="font-semibold text-foreground">12k</span>{" "}
              followers
            </div>
            <div className="flex gap-1">
              <span className="font-semibold text-foreground">2k</span>{" "}
              following
            </div>
          </div>

          {/* Bio */}
          <div className="mt-4 text-sm">
            <p className="text-muted-foreground">
              Digital creator and tech enthusiast. Sharing insights about web
              development, design, and innovation.
            </p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="posts" className="mt-6">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-auto">
              <TabsTrigger
                value="posts"
                className="rounded-none border-b-2 border-transparent px-4 pb-2 pt-2 font-semibold data-[state=active]:border-primary"
              >
                Posts
              </TabsTrigger>
              <TabsTrigger
                value="about"
                className="rounded-none border-b-2 border-transparent px-4 pb-2 pt-2 font-semibold data-[state=active]:border-primary"
              >
                About
              </TabsTrigger>
              <TabsTrigger
                value="photos"
                className="rounded-none border-b-2 border-transparent px-4 pb-2 pt-2 font-semibold data-[state=active]:border-primary"
              >
                Photos
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </Card>
    </div>
  );
}
