import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { LoginPageImageLoader } from "../components/loaders/LoginPageImageLoader";
import { useAuth } from "../contexts/AuthContext";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";

export function LoginPage() {
  const [bgImage, setBgImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setIsAuthenticated, isAuthenticated } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL;

  const refreshAuthToken = async () => {
    // console.log("login page");

    try {
      await axios.post(
        `${API_URL}/auth/refresh-token`,
        {},
        { withCredentials: true }
      );
      setIsAuthenticated(true);
      navigate("/");
    } catch (error) {
      setIsAuthenticated(false);
      console.error("Error refreshing auth token:", error);
      fetchImage();
    }
  };

  const fetchImage = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/bg-image`, {
        responseType: "blob",
      });

      const blob = response.data;
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.src = url;

      img.onload = () => {
        setBgImage(url); // Update the background once the image has loaded
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

  const checkMaintenanceMode = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/maintenance`);

      if (response.data.maintenance) {
        navigate("/503");
      }
    } catch (error) {
      console.error("Error checking maintenance status:", error);
    }
  };

  useEffect(() => {
    checkMaintenanceMode();
    refreshAuthToken();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    e.target.classList.remove("hover:bg-indigo-700");
    e.target.classList.add("disabled:opacity-50");

    setIsLoadingLogin(true);

    const passwordField = document.getElementById("password");
    const emailField = document.getElementById("email");
    const msgField = document.getElementById("msg");

    passwordField.classList.remove("ring-red-600");
    emailField.classList.remove("ring-red-600");
    msgField.classList.remove("block");
    msgField.classList.add("hidden");

    try {
      const result = await axios.post(
        `${API_URL}/auth/login`,
        {
          email: email,
          password: password,
        },
        { withCredentials: true }
      );

      if (result.data.user.isSuspended) {
        navigate("/suspension");
        return;
      }

      localStorage.setItem("name", result.data.user.name);
      localStorage.setItem("id", result.data.user.id);
      localStorage.setItem("avatar", result.data.user.avatar);
      localStorage.setItem("avatarBg", result.data.user.avatarBg);
      localStorage.setItem("username", result.data.user.username);

      setIsAuthenticated(true);

      navigate("/", { state: { result: result.data } });
    } catch (error) {
      setIsAuthenticated(false);
      console.error("Login failed: ", error);
      passwordField.classList.add("ring-red-600");
      emailField.classList.add("ring-red-600");
      msgField.classList.add("block");
      msgField.classList.remove("hidden");
      e.target.classList.add("hover:bg-indigo-700");
      e.target.classList.remove("disabled:opacity-50");
    } finally {
      setIsLoadingLogin(false);
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
          <form method="POST">
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
                  className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-[#f0f0f0] text-sm"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    e.target.classList.remove("ring-red-600");
                  }}
                />
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-stone-50"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  title="Enter your password"
                  required
                  className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-sm"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    e.target.classList.remove("ring-red-600");
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
              <span
                id="msg"
                className="text-red-600 text-sm font-medium hidden"
              >
                Incorrect email or password
              </span>
            </div>

            <div className="text-sm text-right mt-1">
              <Link
                to={"/forgot-password"}
                className="font-semibold text-indigo-500 hover:text-indigo-400"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="flex w-full justify-center items-center gap-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 focus:bg-indigo-800"
                onClick={handleLogin}
              >
                Login
                {isLoadingLogin && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Don't you have an account?{" "}
            <Link
              to={"/signup"}
              className="font-semibold leading-6 text-indigo-500 hover:text-indigo-400"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
      <div className="relative flex-1 lg:max-w-[50%]">
        {isLoading ? (
          <LoginPageImageLoader />
        ) : (
          <img
            className="absolute inset-0 h-full w-full object-cover rounded-lg"
            src={bgImage || "/public/defaultBG.jpg"}
            alt="random image"
          />
        )}
      </div>
    </div>
  );
}
