import axios from "axios";
import { useEffect, useState } from "react";
import { Post } from "./Post";
import { SavePostLoader } from "./loaders/SavePostLoader";

export function SavedPosts() {
  const [isLoading, setIsLoading] = useState(true);
  const [savedPosts, setSavedPosts] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      try {
        const response = await axios.get(`${API_URL}/post/fetch/save`, {
          withCredentials: true,
        });
        console.log("SavedPost.jsx : response.data: ", response.data);
        setSavedPosts([...response.data]);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    })();
  }, []);
  console.log("savedPosts: ", savedPosts);

  return (
    <>
      {isLoading ? (
        <SavePostLoader />
      ) : (
        <div className="flex flex-col sm:w-full px-2 sm:px-0">
          <div className="mb-4">
            <span className="text-2xl font-bold">
              Saved Posts ({savedPosts.length})
            </span>
          </div>
          <div>
            {savedPosts.length !== 0 ? (
              savedPosts.map((post) => (
                <Post
                  key={post._id}
                  details={post}
                  setPosts={setSavedPosts}
                  externalLinkFlag={false}
                />
              ))
            ) : (
              <span className="block mt-10 font-medium text-center">
                You haven't saved any posts, save some post and they will appear
                here.
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
}
