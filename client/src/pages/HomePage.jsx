import { useEffect, useState } from "react";
import { Feed } from "../components/Feed";
import { Header } from "../components/Header";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { WholePageLoader } from "../components/loaders/WholePageLoader";
import { useAuth } from "../contexts/AuthContext";
import { NotificationCentre } from "../components/NotificationCentre";
import { SavedPosts } from "../components/SavedPosts";
import { FollowerList } from "../components/FollowerList";
import { FollowingList } from "../components/FollowingList";
import ChatPage from "./Chat";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { BadgeHelp, Bookmark, Cake, Search, Settings } from "lucide-react";

export const Home = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [pageLoading, setPageLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState("home");
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;
  // Check maintenance status on app load
  const checkMaintenanceMode = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/maintenance`);

      if (response.data.maintenance) {
        navigate("/503");
        setPageLoading(false);
      }
    } catch (error) {
      console.error("Error checking maintenance status:", error);
    }
  };

  const getRefreshToken = async () => {
    if (!isAuthenticated) {
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
        navigate("/login");
      } finally {
        setPageLoading(false);
      }
    }
    setPageLoading(false);
  };

  useEffect(() => {
    setPageLoading(true);

    checkMaintenanceMode();
    getRefreshToken();
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
          <div className="sm:hidden flex justify-center w-auto h-10 my-2">
            <div className="flex  items-center">
              <span className="leckerli-one-regular text-foreground text-xl">
                Connectify
              </span>
            </div>
          </div>
          <Header
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            setPageLoading={setPageLoading}
          />
          {/* <Sidebar variant={currentPage} setCurrentPage={setCurrentPage} /> */}
          <main className="flex relative sm:justify-between lg:px-2 sm:py-3 md:pr-2 bg-white dark:bg-black h-fit dark:text-[#e2e4e9] transition-colors duration-500 sm:gap-3">
            {/* ================================================================ */}

            <section className="lg:basis-1/3 md:basis-1/4 hidden lg:block lg:sticky md:sticky top-22 h-fit max-w-[320px] overflow-y-auto">
              <div className="h-full w-full flex flex-col border rounded-2xl p-2 gap-1">
                <div className="relative w-auto flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                  <Avatar>
                    <AvatarImage src={localStorage.avatar} />
                    <AvatarFallback className={localStorage.avatarBg}>
                      {localStorage.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-bold">{localStorage.name}</span>
                </div>
                <div className="flex px-3 py-3 gap-3 items-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                  <Search size={20} />
                  <span className="text-sm">Search</span>
                </div>
                <div className="flex px-3 py-3 gap-3 items-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                  <Bookmark size={20} />
                  <span className="text-sm">Saved Posts</span>
                </div>
                <div className="flex px-3 py-3 gap-3 items-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                  <Cake size={20} />
                  <span className="text-sm">Birthdays</span>
                </div>
                <div className="flex px-3 py-3 gap-3 items-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                  <Settings size={20} />
                  <span className="text-sm">Settings</span>
                </div>
                <div className="flex px-3 py-3 gap-3 items-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                  <BadgeHelp size={20} />
                  <span className="text-sm">Help & Support</span>
                </div>
              </div>
            </section>

            {/* ================================================================ */}

            <section className="lg:basis-2/3 md:basis-3/4 sm:px-1 max-w-[680px] overflow-y-auto w-full mt-[3px]">
              {currentPage === "home" && <Feed />}
              {currentPage === "followers" && <FollowerList />}
              {currentPage === "following" && <FollowingList />}
              {currentPage === "chat" && <ChatPage />}
              {currentPage === "saved" && <SavedPosts />}
              {currentPage === "notification" && (
                <NotificationCentre mobileFlag={true} />
              )}
            </section>

            {/* ================================================================ */}

            <section className="lg:basis-1/3 md:basis-1/4 hidden lg:block lg:sticky md:sticky top-22 h-fit max-w-[320px] overflow-y-auto">
              <div className="flex flex-col h-full w-full border rounded-2xl pb-2">
                <span className="text-xl font-bold m-4">Friends</span>
                <div className="flex flex-col gap-1 px-2">
                  <div className="relative w-auto flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                    <Avatar>
                      <AvatarImage src={localStorage.avatar} />
                      <AvatarFallback className={localStorage.avatarBg}>
                        {localStorage.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-sm">
                      {localStorage.name}
                    </span>
                  </div>
                  <div className="relative w-auto flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                    <Avatar>
                      <AvatarImage src={localStorage.avatar} />
                      <AvatarFallback className={localStorage.avatarBg}>
                        {localStorage.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-sm">
                      {localStorage.name}
                    </span>
                  </div>
                  <div className="relative w-auto flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                    <Avatar>
                      <AvatarImage src={localStorage.avatar} />
                      <AvatarFallback className={localStorage.avatarBg}>
                        {localStorage.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-sm">
                      {localStorage.name}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* ================================================================ */}

            <div className="lg:max-w-fit hidden mt-10 fixed bottom-1 lg:flex gap-2 text-xs text-muted-foreground">
              <Link to={"/terms"} className="hover:underline">
                Terms
              </Link>
              <span> · </span>
              {/* <Link to={"/community-guidelines"}>Community Guidelines</Link> */}
              {/* <Link to={"/data-deletion-policy"}>Data Deletion Policy</Link> */}
              <Link to={"/cookie-policy"} className="hover:underline">
                Cookies
              </Link>
              <span> · </span>
              <Link to={"/privacy-policy"} className="hover:underline">
                Privacy
              </Link>
            </div>
            {/* --------------------------------------- */}
            {/* <section
              className={`basis-1/4 h-fit max-w-96 lg:sticky md:sticky absolute top-18 overflow-y-auto transition-transform hidden sm:block -translate-y-full md:translate-y-0`}
            >
              
            </section> */}
          </main>
        </>
      )}
    </>
  );
};
