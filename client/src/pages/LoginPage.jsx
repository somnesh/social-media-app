import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { LoginPageImageLoader } from "../components/loaders/LoginPageImageLoader";

export function LoginPage() {
  const [bgImage, setBgImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;
  const UNSPLASH_API = import.meta.env.VITE_UNSPLASH_API;

  useEffect(() => {
    const fetchImage = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(UNSPLASH_API);
        const data = await response.json();
        const img = new Image();
        img.src = data.urls.full; // Set the image source to the fetched URL

        img.onload = () => {
          setBgImage(data.urls.full); // Update the background once the image has loaded
          setIsLoading(false);
        };

        img.onerror = () => {
          console.error("Error loading image");
          setIsLoading(false);
        };
      } catch (error) {
        console.error("Error fetching image:", error);
        setIsLoading(false);
      }
    };
    fetchImage();
  }, []);

  const handleLogin = async (e) => {
    const passwordField = document.getElementById("password");
    const emailField = document.getElementById("email");
    const msgField = document.getElementById("msg");

    passwordField.classList.remove("ring-red-600");
    emailField.classList.remove("ring-red-600");
    msgField.classList.remove("block");
    msgField.classList.add("hidden");

    setIsLoading(true);
    e.preventDefault();
    try {
      const result = await axios.post(
        `${API_URL}/auth/login`,
        {
          email: email,
          password: password,
        },
        { withCredentials: true }
      );
      console.log(result);

      localStorage.setItem("name", result.data.user.name);
      localStorage.setItem("id", result.data.user.id);
      localStorage.setItem("avatar", result.data.user.avatar);

      navigate("/", { state: { result: result.data } });
    } catch (error) {
      console.error("Login failed: ", error);
      passwordField.classList.add("ring-red-600");
      emailField.classList.add("ring-red-600");
      msgField.classList.add("block");
      msgField.classList.remove("hidden");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col-reverse lg:flex-row p-6">
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8 lg:max-w-[50%]">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-gray-900 dark:text-stone-100">
            Welcome Back
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" method="POST">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-stone-100"
              >
                Email
              </label>
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Email address"
                  title="Enter your email"
                  required
                  className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-[#f0f0f0]"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    e.target.classList.remove("ring-red-600");
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-stone-50"
                >
                  Password
                </label>
              </div>
              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  title="Enter your password"
                  required
                  className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    e.target.classList.remove("ring-red-600");
                  }}
                />
              </div>
              <span
                id="msg"
                className="text-red-600 text-sm font-medium hidden"
              >
                Incorrect email or password
              </span>
            </div>

            <div className="text-sm text-right">
              <Link
                href="#"
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Forgot Password?
              </Link>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 focus:bg-indigo-800"
                onClick={handleLogin}
              >
                Login
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Don't you have an account?{" "}
            <Link
              to={"/signup"}
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Sign up
            </Link>
          </p>
        </div>
        <p className="mt-10 text-center text-sm text-gray-500">
          © 2023 ALL RIGHTS RESERVED
        </p>
      </div>
      <div className="relative flex-1 lg:max-w-[50%]">
        {isLoading ? (
          <LoginPageImageLoader />
        ) : (
          <img
            className="absolute inset-0 h-full w-full object-cover rounded-lg"
            src={bgImage}
            alt="random image"
          />
        )}
      </div>
    </div>
  );
}
