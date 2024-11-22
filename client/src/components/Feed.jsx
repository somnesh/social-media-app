import { CirclePlus, ImagePlus, ListTodo, Sprout } from "lucide-react";
import { Post } from "./Post";
import { useEffect, useState } from "react";
import { CreatePost } from "./CreatePost";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { FeedSkeleton } from "./loaders/FeedSkeleton";
import { Progress } from "./ui/progress";

export function Feed() {
  const [createPostPopUp, setCreatePostPopUp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(false);
  const [imageFlag, setImageFlag] = useState(false);
  const [pollFlag, setPollFlag] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMorePosts, setLoadingMorePosts] = useState(false);

  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;
  const APP_URL = import.meta.env.VITE_APP_URL;

  const fetchPosts = async (page) => {
    try {
      setLoadingMorePosts(true);
      const response = await axios.get(`${API_URL}/feed/`, {
        params: { page, limit: 3 },
        withCredentials: true,
      });
      const newPosts = [
        ...response.data.followedPosts,
        ...response.data.recommendedPosts,
      ];
      const shuffledPosts = shuffleArray(newPosts);

      setPosts((prevPosts) => [...prevPosts, ...shuffledPosts]);

      setHasMore(response.data.hasMore);

      setIsLoading(false);
      setLoadingMorePosts(false);
    } catch (error) {
      setError(true);
      console.error(error);
      setIsLoading(false);
      setLoadingMorePosts(false);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight / 2 &&
      !loadingMorePosts &&
      hasMore
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, hasMore]);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       setIsLoading(true);
  //       const response = await axios.get(`${API_URL}/feed/`, {
  //         withCredentials: true,
  //       });
  //       const posts = [
  //         ...response.data.followedPosts,
  //         ...response.data.recommendedPosts,
  //       ];
  //       const shuffledPosts = shuffleArray(posts);
  //       setPosts(shuffledPosts);
  //       setIsLoading(false);
  //     } catch (error) {
  //       setError(true);
  //       console.error(error);
  //       setIsLoading(false);
  //     }
  //   })();
  // }, []);

  const handleCreatePostClick = () => {
    setCreatePostPopUp(true);
    document.body.classList.add("overflow-hidden");
  };
  return (
    <>
      {isLoading ? (
        <FeedSkeleton />
      ) : error ? (
        navigate("/500")
      ) : (
        <>
          {createPostPopUp && (
            <CreatePost
              createPostPopUp={createPostPopUp}
              setCreatePostPopUp={setCreatePostPopUp}
              setPosts={setPosts}
              imageFlag={imageFlag}
              setImageFlag={setImageFlag}
              setPollFlag={setPollFlag}
              pollFlag={pollFlag}
              setUploadProgress={setUploadProgress}
            />
          )}
          <div className="create-new-post bg-white dark:bg-[#242526] px-4 py-2 sm:rounded-lg mb-2">
            <div className="flex items-center py-2 gap-3">
              <Link
                to={`${APP_URL || ""}/user/${localStorage.username}`}
                className="hover:contrast-[.7]"
              >
                <Avatar>
                  <AvatarImage src={localStorage.avatar} />
                  <AvatarFallback className={localStorage.avatarBg}>
                    {localStorage.name[0]}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div
                onClick={handleCreatePostClick}
                className="bg-[#F0F2F5] hover:bg-[#e3e5e9] active:bg-[#dbdde0] dark:bg-[#414141] dark:active:bg-[#6e6e6e] dark:hover:bg-[#535353] rounded-lg py-3 px-4 cursor-pointer w-full"
              >
                what's happening?
              </div>
            </div>

            <div className="flex items-center text-center pt-2 mt-2 border-t-[#e4e6eb] border-t-[1px] dark:border-t-[#3a3b3c]">
              <div
                onClick={() => {
                  setImageFlag(true);
                  handleCreatePostClick();
                }}
                className="flex basis-1/3 items-center justify-center p-2 gap-1 cursor-pointer hover:bg-[#F0F2F5] active:bg-[#e3e5e9] dark:hover:bg-[#414141] dark:active:bg-[#535353] rounded-md"
              >
                <ImagePlus />
                <span>Image</span>
              </div>
              <div
                onClick={() => {
                  setPollFlag(true);
                  handleCreatePostClick();
                }}
                className="flex basis-1/3 items-center justify-center p-2 gap-1 cursor-pointer hover:bg-[#F0F2F5] active:bg-[#e3e5e9] dark:hover:bg-[#414141] dark:active:bg-[#535353] rounded-md"
              >
                <ListTodo />
                <span>Poll</span>
              </div>
              <div
                onClick={handleCreatePostClick}
                className="flex basis-1/3 items-center justify-center p-2 gap-1 cursor-pointer hover:bg-[#F0F2F5] active:bg-[#e3e5e9] dark:hover:bg-[#414141] dark:active:bg-[#535353] rounded-md"
              >
                <CirclePlus />
                <span>More</span>
              </div>
            </div>
          </div>

          <div className="px-2">
            {uploadProgress > 0 && (
              <div className="w-full mb-2">
                <Progress value={uploadProgress} />
              </div>
            )}
          </div>
          {/* Main feed starts from here */}
          {posts.length === 0 ? (
            <div className="mt-16 text-center flex flex-col justify-center items-center font-semibold">
              <Sprout size={35} />
              <span>
                Nothing new right now, make some new friends or you can post
                something new.
              </span>
            </div>
          ) : (
            <>
              <div>
                {posts.map((post) => (
                  <Post key={post._id} details={post} setPosts={setPosts} />
                ))}
              </div>
              {loadingMorePosts && <span>loading...</span>}
            </>
          )}
          {!hasMore && (
            <div className="text-center">
              Looks like you reached the end! 😄
            </div>
          )}
        </>
      )}
    </>
  );
}

const shuffleArray = (array) => {
  let shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};
