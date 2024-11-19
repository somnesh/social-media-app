import React, { useState, useCallback, useRef } from "react";
import axios from "axios";
import { debounce } from "lodash";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

export function SearchBar() {
  const [query, setQuery] = useState(""); // For storing the search term
  const [results, setResults] = useState([]); // For storing the search results
  const [error, setError] = useState(null); // For storing any errors
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // For hiding the other div
  const targetDivRef = useRef(null); // Reference to the div you're tracking

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const APP_URL = import.meta.env.VITE_APP_URL;

  // Handler to hide another div when clicked outside

  const handleClickOutside = (event) => {
    if (targetDivRef.current && !targetDivRef.current.contains(event.target)) {
      // If the click is outside of the target div, hide the other div
      setQuery("");
      setIsVisible(false);
    }
    document.removeEventListener("mousedown", handleClickOutside);
  };

  const handleClick = () => {
    if (isAuthenticated) {
      document.addEventListener("mousedown", handleClickOutside);
      setIsVisible(true);
    } else {
      navigate("/login");
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchTerm) => {
      if (!searchTerm.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/user/global/search`, {
          params: { query: searchTerm },
          withCredentials: true,
        });
        setResults(response.data);
        setError(null);
      } catch (err) {
        setError("An error occurred while searching.");
      } finally {
        setIsLoading(false);
      }
    }, 300), // Delay in milliseconds
    []
  );

  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setQuery(searchTerm);
    debouncedSearch(searchTerm);
  };

  return (
    <div
      ref={targetDivRef}
      className="flex flex-col w-fit transition-all ml-2 sm:ml-0 relative"
    >
      <div
        onClick={handleClick}
        className={`flex bg-[#f0f2f5] dark:bg-[#3a3b3c] px-2 py-2 text-[#b0b3b8] w-full ${
          isVisible ? "rounded-t-md border-b border-black" : "rounded-full"
        } z-[1]`}
      >
        <div>
          <Search />
        </div>
        <input
          className={`outline-none px-2 bg-[#f0f2f5] dark:bg-[#3a3b3c] dark:text-white text-black ${
            !isVisible && "hidden sm:block"
          }`}
          type="text"
          name="search"
          value={query}
          onChange={handleInputChange}
          autoComplete="off"
          placeholder="Find people"
        />
      </div>
      {isVisible && (
        <div className="absolute top-10 bg-[#ffffff] dark:bg-[#3a3b3c] px-2 py-2 rounded-b-md text-[#b0b3b8] w-full shadow-md">
          {query.length === 0 && !isLoading && (
            <span className="font-medium text-sm text-black dark:text-white text-center block py-5">
              Start finding new people
            </span>
          )}
          {results.length === 0 && !isLoading && query.length !== 0 && (
            <span className="font-medium text-sm text-black dark:text-white text-center block py-5">
              No results containing your search terms were found.
            </span>
          )}
          {isLoading && (
            <div className="flex gap-1 justify-center font-medium text-sm items-center">
              <span>Searching</span>
              <div className="flex font-medium text-2xl items-end">
                <span className="mr-1 h-fit w-fit animate-bounce">.</span>
                <span className="mr-1 h-fit w-fit animate-bounce delay-100">
                  .
                </span>
                <span className="mr-1 h-fit w-fit animate-bounce delay-150">
                  .
                </span>
              </div>
            </div>
          )}{" "}
          {results.length > 0 && (
            <>
              {results.map((user) => (
                <Link
                  to={`${APP_URL || ""}/user/${user.username}`}
                  className="flex items-center cursor-pointer p-2 gap-2 text-black dark:text-white hover:bg-slate-100 dark:hover:bg-[#454647] text-sm rounded-sm"
                >
                  <Avatar>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className={user.avatarBg}>
                      {user.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span>{user.name}</span>
                </Link>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
