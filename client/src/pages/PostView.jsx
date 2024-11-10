import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { WholePageLoader } from "../components/loaders/WholePageLoader";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Post } from "../components/Post";
import { useAuth } from "../contexts/AuthContext";

export function PostView() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const { setIsAuthenticated } = useAuth();

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
        const response = await axios.get(`${API_URL}/post/${id}`, {
          withCredentials: true,
        });
        setPosts(response.data.post);

        console.log(response.data);
        refreshAuthToken();
      } catch (error) {
        console.error(error);
        // navigate("/500");
        setIsAuthenticated(false);
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
              <Post
                details={posts}
                setPosts={setPosts}
                externalLinkFlag={true}
              />
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
