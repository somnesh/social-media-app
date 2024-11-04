import { useNavigate } from "react-router-dom";
import { ProfileMenu } from "./ProfileMenu";
import { SearchBar } from "./SearchBar";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

export function Header() {
  const navigate = useNavigate();
  const { setIsAuthenticated, isAuthenticated } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
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
    refreshAuthToken();
  }, []);
  return (
    <header className="flex py-1 pl-3 pr-2 bg-white dark:bg-[#242526] items-center sticky top-0 transition-colors duration-500 shadow-md z-40">
      <section className="basis-1/4">
        <SearchBar />
      </section>
      <section className="basis-1/2 text-center">
        <a href="/">
          <span className="material-symbols-outlined dark:text-white">
            token
          </span>
        </a>
      </section>

      <section className="flex basis-1/4 justify-end items-center gap-2">
        {isAuthenticated ? (
          <ProfileMenu />
        ) : (
          <div className="flex gap-2 py-1">
            <Button onClick={() => navigate("/signup")}>Sign up</Button>
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
