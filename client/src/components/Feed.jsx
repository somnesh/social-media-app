import { CirclePlus, ImagePlus, ListTodo } from "lucide-react";
import { Post } from "./Post";
import { useEffect, useState } from "react";
import { CreatePost } from "./CreatePost";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLocation, useNavigate } from "react-router-dom";
import { FeedSkeleton } from "./loaders/FeedSkeleton";

export function Feed() {
  const [refreshFeed, setRefreshFeed] = useState(false);
  const [createPostPopUp, setCreatePostPopUp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(false);
  const [imageFlag, setImageFlag] = useState(false);

  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/feed/`, {
          withCredentials: true,
        });
        const posts = [
          ...response.data.followedPosts,
          ...response.data.recommendedPosts,
        ];
        const shuffledPosts = shuffleArray(posts);
        setPosts(shuffledPosts);
        setIsLoading(false);
      } catch (error) {
        setError(true);
        console.error(error);
        setIsLoading(false);
      }
    })();
  }, [refreshFeed]);

  const handleCreatePostClick = () => {
    setCreatePostPopUp(true);
    document.body.classList.add("overflow-hidden");
  };
  return (
    <section className="basis-1/2 mx-auto max-w-[680px] select-none gap-2 overflow-y-auto">
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
            />
          )}
          <div className="create-new-post bg-white dark:bg-[#242526] px-4 py-2 rounded-lg mb-4">
            <div className="flex items-center py-2 gap-3">
              <div className="">
                <Avatar>
                  <AvatarImage src={localStorage.avatar} />
                  <AvatarFallback className={localStorage.avatarBg}>
                    {localStorage.name[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
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
              <div className="flex basis-1/3 items-center justify-center p-2 gap-1 cursor-pointer hover:bg-[#F0F2F5] active:bg-[#e3e5e9] dark:hover:bg-[#414141] dark:active:bg-[#535353] rounded-md">
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

          {/* Main feed starts from here */}
          <div>
            {posts.map((post) => (
              <Post key={post._id} details={post} setPosts={setPosts} />
            ))}
          </div>
        </>
      )}
    </section>
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
