import { CirclePlus, ImagePlus, ListTodo } from "lucide-react";
import { Post } from "./Post";
import { useEffect, useState } from "react";
import { CreatePost } from "./CreatePost";
import { FeedSkeleton } from "./FeedSkeleton";
import axios from "axios";

export function Feed() {
  const [refreshFeed, setRefreshFeed] = useState(false);
  const [createPostPopUp, setCreatePostPopUp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(false);

  const authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmE0YTViNzZmZWNhM2JmNGU0OTA1ZmUiLCJuYW1lIjoiSm9obiBEb2UiLCJyb2xlIjoidXNlciIsImF2YXRhciI6bnVsbCwiaWF0IjoxNzI1NzkwNTU5LCJleHAiOjE3MjY2NTQ1NTl9.W9wL3vbaVVcZqHn8tT9oujSZcxy8qHrqGEfgPdc0CYA";
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:3000/api/v1/post/", {
          headers: {
            Authorization:
              `Bearer ${authToken}`,
          },
        });

        setPosts(response.data.posts);
        setIsLoading(false);
      } catch (error) {
        setError(true);
        console.log(error);
        setIsLoading(false);
      }
    })();
  }, [refreshFeed]);

  const handleCreatepostClick = () => {
    setCreatePostPopUp(true);
    document.body.classList.add("overflow-hidden");
  };
  return (
    <section className="basis-1/2 mx-auto max-w-[680px] select-none gap-2 overflow-y-auto">
      {isLoading ? (
        <FeedSkeleton />
      ) : error ? (
        <h1>Something went wrong</h1>
      ) : (
        <>
          {createPostPopUp && (
            <CreatePost
              createPostPopUp={createPostPopUp}
              setCreatePostPopUp={setCreatePostPopUp}
              refreshFeed={refreshFeed}
              setRefreshFeed={setRefreshFeed}
            />
          )}
          <div className="create-new-post bg-white dark:bg-[#242526] px-4 py-2 rounded-lg mb-4">
            <div className="flex items-center py-2 gap-3">
              <div className="">
                <img
                  className="rounded-full "
                  src="https://via.placeholder.com/50"
                  alt="photo"
                />
              </div>
              <div
                onClick={handleCreatepostClick}
                className="bg-[#F0F2F5] hover:bg-[#e3e5e9] active:bg-[#dbdde0] dark:bg-[#414141] dark:active:bg-[#6e6e6e] dark:hover:bg-[#535353] rounded-lg py-3 px-4 cursor-pointer w-full"
              >
                what's happening?
              </div>
            </div>

            <div className="flex items-center text-center pt-2 mt-2 border-t-[#e4e6eb] border-t-[1px] dark:border-t-[#3a3b3c]">
              <div className="flex basis-1/3 items-center justify-center p-2 gap-1 cursor-pointer hover:bg-[#F0F2F5] active:bg-[#e3e5e9] dark:hover:bg-[#414141] dark:active:bg-[#535353] rounded-md">
                <ImagePlus />
                <span>Image</span>
              </div>
              <div className="flex basis-1/3 items-center justify-center p-2 gap-1 cursor-pointer hover:bg-[#F0F2F5] active:bg-[#e3e5e9] dark:hover:bg-[#414141] dark:active:bg-[#535353] rounded-md">
                <ListTodo />
                <span>Poll</span>
              </div>
              <div className="flex basis-1/3 items-center justify-center p-2 gap-1 cursor-pointer hover:bg-[#F0F2F5] active:bg-[#e3e5e9] dark:hover:bg-[#414141] dark:active:bg-[#535353] rounded-md">
                <CirclePlus />
                <span>More</span>
              </div>
            </div>
          </div>

          {/* Main feed starts from here */}
          <div>
            {posts.map((post) => (
              <Post
                key={post._id}
                details={post}
                refreshFeed={refreshFeed}
                setRefreshFeed={setRefreshFeed}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
