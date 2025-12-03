import { Link, useNavigate } from "react-router-dom";
import { ProfileMenu } from "./ProfileMenu";
import { Sidebar } from "../components/Sidebar";
import { Button } from "./ui/button";
import { memo, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { SkeletonLoader } from "./loaders/SkeletonLoader";

export const Header = memo(
  ({ setPageLoading, currentPage, setCurrentPage }) => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { setIsAuthenticated, isAuthenticated } = useAuth();

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
      setIsLoading(true);
      const refreshAuthToken = async () => {
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
          }
        }
      };
      refreshAuthToken();
      setIsLoading(false);
    }, [navigate]);
    return (
      <header className="flex justify-center sm:justify-normal py-1 pl-3 pr-2 bg-white dark:bg-black items-center transition-colors duration-500 shadow-xs border-t sm:border-b border-gray-200 dark:border-gray-700 z-20 sm:sticky sm:top-0 fixed bottom-0 w-full">
        {/* <section className="basis-1/4 absolute left-0 sm:relative z-11 sm:z-auto">
        <SearchBar />
      </section> */}
        <section className="basis-1/4 sm:flex pl-3 hidden">
          {/* <Link to={"/"}>
          <img src="/icons/favicon.ico" alt="logo" className="h-9" />
        </Link> */}
          <Link to="/" className="flex items-center gap-1 group">
            <span className="font-semibold leckerli-one-regular text-foreground hidden sm:inline-block text-2xl">
              Connectify
            </span>
          </Link>
        </section>

        <section className="basis-1/2">
          <Sidebar variant={currentPage} setCurrentPage={setCurrentPage} />
        </section>

        <section className="flex sm:basis-1/4 justify-end items-center pl-2 gap-2">
          {isLoading ? (
            <SkeletonLoader
              width="7rem"
              height="3rem"
              className="dark:bg-[#fafafa] rounded-full"
            />
          ) : isAuthenticated ? (
            <ProfileMenu setPageLoading={setPageLoading} status={status} />
          ) : (
            <div className="flex gap-2 py-1">
              <Button
                className={"hidden sm:block"}
                onClick={() => navigate("/signup")}
              >
                Sign up
              </Button>
              <Button
                onClick={() => navigate("/login")}
                className="bg-blue-500 hover:bg-blue-600 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white"
              >
                Login
              </Button>
            </div>
          )}
        </section>
      </header>
    );
  }
);
