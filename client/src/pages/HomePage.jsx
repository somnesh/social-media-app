import { useEffect, useState } from "react";
import { Feed } from "../components/Feed";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { WholePageLoader } from "../components/loaders/WholePageLoader";
import { useAuth } from "../contexts/AuthContext";
import { NotificationCentre } from "../components/NotificationCentre";
import { SavedPosts } from "../components/SavedPosts";
import { FollowerList } from "../components/FollowerList";
import { FollowingList } from "../components/FollowingList";

export const Home = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [pageLoading, setPageLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState("home");
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    setPageLoading(true);
    (async () => {
      if (!isAuthenticated) {
        try {
          await axios.post(
            `${API_URL}/auth/refresh-token`,
            {},
            {
              withCredentials: true,
            }
          );
          // setPageLoading(false);
          setIsAuthenticated(true);
        } catch (error) {
          console.error(error);
          setIsAuthenticated(false);
          navigate("/login");
          setPageLoading(false);
        }
      }
      setPageLoading(false);
    })();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, navigate, pageLoading]);
  return (
    <>
      {pageLoading ? (
        <WholePageLoader />
      ) : (
        <>
          <Header setPageLoading={setPageLoading} />
          <main className="flex flex-col sm:flex-row relative sm:justify-between lg:px-2 sm:py-4 md:pr-2 bg-[#f0f2f5] dark:bg-black min-h-screen dark:text-[#e2e4e9] transition-colors duration-500 sm:gap-3">
            <Sidebar variant={currentPage} setCurrentPage={setCurrentPage} />
            {/* --------------------------------------- */}
            <section className="lg:basis-1/2 md:basis-3/4 sm:px-1 sm:mx-auto max-w-[680px] overflow-y-auto">
              {currentPage === "home" && <Feed />}
              {currentPage === "followers" && <FollowerList />}
              {currentPage === "following" && <FollowingList />}
              {currentPage === "saved" && <SavedPosts />}
              {currentPage === "notification" && (
                <NotificationCentre mobileFlag={true} />
              )}
            </section>
            {/* --------------------------------------- */}
            <section
              className={`basis-1/4 h-screen max-w-96 lg:sticky md:sticky absolute top-[4.5rem] overflow-y-auto transition-transform hidden sm:block -translate-y-full md:-translate-y-0`}
            >
              <NotificationCentre />
            </section>
          </main>
        </>
      )}
    </>
  );
};
