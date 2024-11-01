import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { WholePageLoader } from "../components/loaders/WholePageLoader";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Post } from "../components/Post";

export function PostView() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { id } = useParams();

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/post/${id}`, {
          withCredentials: true,
        });
        setPosts(response.data.post);
        console.log(response.data);
      } catch (error) {
        console.error(error);
        // navigate("/500");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      {isLoading ? (
        <WholePageLoader />
      ) : (
        <>
          <Header />
          <main className="flex px-2 py-4 bg-[#f0f2f5] dark:bg-[#18191a] min-h-screen dark:text-[#e2e4e9] transition-colors duration-500 justify-center gap-3">
            <section className="basis-1/2">
              <Post details={posts} setPosts={setPosts} />
            </section>
            {/* <section className="basis-1/4">
              <div className="bg-white dark:bg-[#242526] px-4 py-2 mb-4 relative transition-all drop-shadow-sm rounded-lg"></div>
            </section> */}
          </main>
        </>
      )}
    </div>
  );
}
