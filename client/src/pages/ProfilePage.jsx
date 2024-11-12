import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "../contexts/AuthContext";

export function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;
  const { username } = useParams();

  const { setIsAuthenticated, isAuthenticated } = useAuth();

  const refreshAuthToken = async () => {
    try {
      await axios.post(
        `${API_URL}/auth/refresh-token`,
        {},
        {
          withCredentials: true,
        }
      );
      setIsAuthenticated(true);
    } catch (error) {
      console.error(error);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/user/${username}`, {
          withCredentials: true,
        });

        console.log("Profile page response: ", response.data);
        refreshAuthToken();
      } catch (error) {
        console.error(error);
        setIsAuthenticated(false);
        // navigate("/500");
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
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">Somnesh Mukhopadhyay</h1>
                    <svg
                      aria-label="Verified"
                      className="mt-2"
                      fill="rgb(0, 149, 246)"
                      height="18"
                      role="img"
                      viewBox="0 0 40 40"
                      width="18"
                    >
                      <title>One of the creator of this app</title>
                      <path
                        d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z"
                        fillRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <p className="text-sm text-muted-foreground">@somnesh</p>
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
