import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "../contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Camera, Mail } from "lucide-react";
import { TabsContent } from "../components/ui/tabs";
import { Post } from "../components/Post";

export function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [details, setDetails] = useState({});
  const [formattedDate, setFormattedDate] = useState("");
  const [posts, setPosts] = useState([]);
  const [photos, setPhotos] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { username } = useParams();

  const { setIsAuthenticated, isAuthenticated } = useAuth();

  const getPosts = async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/post/${userId}`, {
        withCredentials: true,
      });
      setPosts(response.data.posts);
      setPhotos(
        response.data.posts
          .filter(
            (post) => post.parent === undefined && post.image_url !== undefined
          )
          .map((post) => post.image_url)
      );
    } catch (error) {
      console.error("Profile page: getPosts: ", error);
    }
  };

  const refreshAuthToken = async (userId) => {
    try {
      await axios.post(
        `${API_URL}/auth/refresh-token`,
        {},
        {
          withCredentials: true,
        }
      );
      setIsAuthenticated(true);
      getPosts(userId);
    } catch (error) {
      console.error("Profile page: refreshAuthToken: ", error);
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
        setDetails(response.data);
        const dateStr = response.data.user[0].createdAt;
        const date = new Date(dateStr);

        // Format the date as "Month Year"
        setFormattedDate(
          date.toLocaleString("en-US", {
            month: "long",
            year: "numeric",
          })
        );
        refreshAuthToken(response.data.user[0]._id);
      } catch (error) {
        console.error(error);
        navigate("/404");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <Header />
      {isLoading ? (
        <span>loading ...</span>
      ) : (
        <div className="w-full h-full bg-background px-10">
          <div className="w-full max-w-6xl mx-auto overflow-hidden bg-background rounded-b-md">
            {/* Cover Photo */}
            <div className="h-48 relative overflow-hidden w-full">
              <img
                src={details.user[0].cover_photo}
                className="w-full h-full object-cover cursor-pointer hover:contrast-[.8]"
              />
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background via-background/30 to-transparent" />
              {localStorage.id === details.user[0]._id && (
                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Camera className="h-4 w-4" />
                    Change cover photo
                  </Button>
                </div>
              )}
            </div>
            {console.log("photos: ", photos)}
            {/* Profile Section */}
            <div className="px-4 pb-4 pt-0 md:px-6 relative">
              <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-6">
                {/* Profile Picture */}
                <div className="relative -mt-12 h-32 w-32 ">
                  <div className="flex h-full w-full overflow-hidden rounded-full border-4 border-background bg-muted">
                    <Avatar
                      className={
                        "h-fit w-fit cursor-pointer hover:contrast-[.8]"
                      }
                    >
                      <AvatarImage src={details.user[0].avatar} />
                      <AvatarFallback className={`${details.user[0].avatarBg}`}>
                        {`${details.user[0].name[0]}`}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  {localStorage.id === details.user[0]._id && (
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                    >
                      <Camera className="h-4 w-4" />
                      <span className="sr-only">Change profile picture</span>
                    </Button>
                  )}
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold">
                          {`${details.user[0].name}`}
                        </h1>
                        {details.user[0]._id === "673322bc9aec9c0245313129" && (
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
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        @{`${details.user[0].username}`}
                      </p>
                    </div>
                    {localStorage.id === details.user[0]._id ? (
                      <Button variant="outline" className="shrink-0">
                        Edit profile
                      </Button>
                    ) : details.isFollowingUser &&
                      !details.userFollowingBack ? (
                      <Button variant="outline" className="shrink-0">
                        Follow back
                      </Button>
                    ) : details.userFollowingBack ? (
                      <Button variant="outline" className="shrink-0">
                        Unfollow
                      </Button>
                    ) : (
                      <Button variant="outline" className="shrink-0">
                        Follow
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
                <div className="flex gap-1">
                  <span className="font-semibold text-foreground">{`${details.totalFollowers}`}</span>{" "}
                  followers
                </div>
                <div className="flex gap-1">
                  <span className="font-semibold text-foreground">{`${details.totalFollowing}`}</span>{" "}
                  following
                </div>
              </div>

              {/* Bio */}
              <div className="mt-4 text-sm">
                <p className="text-muted-foreground">
                  {`${
                    details.user[0].profile_bio !== null
                      ? details.user[0].profile_bio
                      : ""
                  }`}
                </p>
              </div>

              <div className="mt-6 flex flex-col md:flex-row gap-6">
                {/* About section - left column */}
                <Card className="md:w-1/3 h-fit sticky top-0 p-4 bg-background/80 backdrop-blur-sm rounded-xl">
                  <h2 className="text-xl font-semibold mb-4 text-inherit">
                    About
                  </h2>
                  <div className="space-y-4 text-gray-200 text-inherit">
                    <p>{`${
                      details.user[0].profile_bio !== null
                        ? details.user[0].profile_bio
                        : ""
                    }`}</p>
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      <span>{`${details.user[0].email}`}</span>
                    </div>
                    {/* <div className="flex items-center gap-2">
                    <Link className="h-5 w-5" />
                    <a href="#" className="text-blue-400 hover:underline">
                      https://somnesh.dev
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <span>San Francisco, CA</span>
                  </div> */}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      <span>Joined {formattedDate}</span>
                    </div>
                  </div>
                </Card>

                {/* Posts section - right column */}
                <div className="md:w-2/3">
                  <Tabs defaultValue="posts">
                    <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 sticky h-auto">
                      <TabsTrigger
                        value="posts"
                        className="rounded-none border-b-2 border-transparent px-4 pb-2 pt-2 font-semibold data-[state=active]:border-primary"
                      >
                        Posts
                      </TabsTrigger>
                      <TabsTrigger
                        value="photos"
                        className="rounded-none border-b-2 border-transparent px-4 pb-2 pt-2 font-semibold data-[state=active]:border-primary"
                      >
                        Photos
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="posts" className="mt-6">
                      {posts.length !== 0 ? (
                        <>
                          {" "}
                          {posts.map((post) => (
                            <Post
                              key={post._id}
                              details={post}
                              setPosts={setPosts}
                            />
                          ))}{" "}
                        </>
                      ) : (
                        <span className="block text-center">{`${details.user[0].name} haven't post anything.`}</span>
                      )}
                    </TabsContent>
                    <TabsContent value="photos" className="mt-6">
                      {photos.length !== 0 ? (
                        <div className="grid grid-cols-3 gap-4">
                          {photos.map((photo, i) => (
                            <div
                              key={i}
                              className="aspect-square overflow-hidden rounded-lg"
                            >
                              <img
                                src={photo}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="block text-center">{`${details.user[0].name} haven't post any photos.`}</span>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
