import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../components/Header";

export function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;
  const { username } = useParams();
  console.log("username: ", username);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/user/${username}`, {
          withCredentials: true,
        });
        // setPosts(response.data);

        console.log(response.data);
        // refreshAuthToken();
      } catch (error) {
        console.error(error);
        // navigate("/500");
        // setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);
  return (
    <div className="w-screen h-screen dark:bg-[#18191a] bg-[#f0f2f5]">
      <Header />
      <div className="flex justify-center items-center">
        <div className="flex flex-col relative basis-3/5">
          <img
            className=" rounded-md"
            src="https://wallpapers.com/images/featured/shin-chan-cartoon-fz0fu3bteejyo8ni.jpg"
            alt=""
            srcset=""
          />
          <div className="flex absolute bottom-[-10rem]">
            <img
              className=" rounded-full h-1/4 w-1/4 ml-5 border-8 border-[#f0f2f5] dark:border-[#18191a]"
              src="https://qph.cf2.quoracdn.net/main-qimg-01bb186c8e72ce011efa52c7b28334d5-lq"
              alt=""
            />
            <div className="flex flex-col justify-center">
              <span className="font-bold text-4xl">Somnesh Mukhopadhyay</span>
              <span className="text-xl font-medium">@somnesh</span>
            </div>
          </div>
          <span className="relative">
            Which would be worse to live as a monster, or to die as a good man?
          </span>
        </div>
      </div>
    </div>
  );
}
