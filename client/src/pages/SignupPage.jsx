import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginPageImageLoader } from "../components/loaders/LoginPageImageLoader";
import axios from "axios";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Button } from "../components/ui/button";

export function SignupPage() {
  const [bgImage, setBgImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    date_of_birth: "",
    gender: "male",
    username: "",
    phone_no: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const UNSPLASH_API = import.meta.env.VITE_UNSPLASH_API;
  const API_URL = import.meta.env.VITE_API_URL;

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

  const validateForm = () => {
    if (!form.name.match(/^[a-zA-Z\s]+$/)) {
      setError("Name can only contain letters and spaces.");
      return false;
    }
    if (!form.date_of_birth) {
      setError("Date of birth is required.");
      return false;
    }
    if (!form.username.match(/^[a-zA-Z0-9_]+$/)) {
      setError("Username can only contain letters, numbers, and underscores.");
      return false;
    }
    if (!form.gender) {
      setError("Please select a gender.");
      return false;
    }
    if (!form.phone_no.match(/^\d{10}$/)) {
      setError("Phone number must contain 10 digits.");
      return false;
    }
    if (!form.email.match(/^\S+@\S+\.\S+$/)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (form.password.length < 4) {
      setError("Password must be at least 4 characters long.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    e.target.classList.remove("hover:bg-indigo-700");
    e.target.classList.add("disabled:opacity-50");
    try {
      setIsLoadingSubmit(true);
      const result = await axios.post(`${API_URL}/auth/signup`, {
        ...form,
      });

      navigate("/email-verification", {
        state: { email: form.email },
        replace: true,
      });
      setIsLoadingSubmit(false);
    } catch (error) {
      console.error("Failed to sign up: ", error);
      if (error.status === 500) {
        setError(
          "An error occurred while creating your account. Please try again."
        );
      } else if (error.status === 400) {
        setError(error.response.data.msg);
      }
      e.target.classList.add("hover:bg-indigo-700");
      e.target.classList.remove("disabled:opacity-50");
      setIsLoadingSubmit(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col-reverse lg:flex-row p-6">
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
      <div className="flex flex-1 gap-8 flex-col justify-center px-6 py-4 sm:py-12 lg:px-8 lg:max-w-[50%]">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-stone-50">
            Create an Account
          </h2>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-4" method="POST">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-stone-50"
              >
                Name
              </label>
              <input
                value={form.name}
                onChange={(e) => {
                  setForm({
                    ...form,
                    name: e.target.value,
                  });
                }}
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2 text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="date_of_birth"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-stone-50"
              >
                Date of Birth
              </label>
              <input
                value={form.date_of_birth}
                onChange={(e) => {
                  setForm({
                    ...form,
                    date_of_birth: e.target.value,
                  });
                }}
                id="date_of_birth"
                name="date_of_birth"
                placeholder="Enter your date of birth"
                type="date"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2 text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-stone-50"
              >
                Username
              </label>
              <input
                value={form.username}
                onChange={(e) => {
                  // Allow only alphanumeric characters and underscores
                  const filteredValue = e.target.value.replace(
                    /[^a-zA-Z0-9_]/g,
                    ""
                  );
                  setForm({
                    ...form,
                    username: filteredValue,
                  });
                }}
                id="username"
                name="username"
                type="text"
                placeholder="Enter a username"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2 text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-stone-50"
              >
                Gender
              </label>
              <select
                value={form.gender}
                onChange={(e) => {
                  setForm({
                    ...form,
                    gender: e.target.value,
                  });
                }}
                id="gender"
                name="gender"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2 text-sm"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="phone_no"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-stone-50"
              >
                Phone Number
              </label>
              <input
                value={form.phone_no}
                onChange={(e) => {
                  setForm({
                    ...form,
                    phone_no: e.target.value,
                  });
                }}
                id="phone_no"
                name="phone_no"
                type="tel"
                placeholder="Enter phone number"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2 text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-stone-50"
              >
                Email
              </label>
              <input
                value={form.email}
                onChange={(e) => {
                  setForm({
                    ...form,
                    email: e.target.value,
                  });
                }}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2 text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-stone-50"
              >
                Password
              </label>
              <div className="relative">
                <input
                  value={form.password}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      password: e.target.value,
                    });
                  }}
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Create a password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2 text-sm"
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
            </div>
            {error && (
              <Alert variant="destructive" className={"text-red-500"}>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div>
              <button
                onClick={handleSignUp}
                type="submit"
                className="flex w-full justify-center items-center gap-2 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 focus:bg-indigo-800"
                disabled={isLoadingSubmit}
              >
                Sign up
                {isLoadingSubmit && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to={"/login"}
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
