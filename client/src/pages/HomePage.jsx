import { useEffect, useState } from "react";
import { Feed } from "../components/Feed";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { WholePageLoader } from "../components/loaders/WholePageLoader";

export const Home = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    (async () => {
      try {
        setPageLoading(true);

        const response = await axios.post(
          `${API_URL}/auth/refresh-token`,
          {},
          {
            withCredentials: true,
          }
        );

        setPageLoading(false);
      } catch (error) {
        console.error(error);
        navigate("/login");
        setPageLoading(false);
      }
    })();
  }, [navigate]);
  return (
    <>
      {pageLoading ? (
        <WholePageLoader />
      ) : (
        <>
          <Header />
          <main className="flex px-2 py-4 bg-[#f0f2f5] dark:bg-[#18191a] min-h-screen dark:text-[#e2e4e9] transition-colors duration-500">
            <Sidebar />
            <Feed />
            {/* --------------------------------------- */}
            <section className="basis-1/4">
              <h2>unknown section</h2>
            </section>
          </main>
        </>
      )}
    </>
  );
};
