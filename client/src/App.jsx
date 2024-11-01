import { useEffect, useState } from "react";
import { ThemeProvider } from "./contexts/theme";
import { Toaster } from "./components/ui/toaster";
import { ToastHandlerProvider } from "./contexts/ToastContext";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./pages/HomePage";
import { SomethingWentWrong } from "./pages/SomethingWentWrong";
import { NotFound } from "./pages/NotFound";
import { EmailVerification } from "./pages/EmailVerification";
import { BadRequest } from "./pages/BadRequest";
import { EmailVerificationSuccess } from "./pages/EmailVerificationSuccess";
import { PostView } from "./pages/PostView";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/email-verification",
    element: <EmailVerification />,
  },
  {
    path: "/email-verification-success",
    element: <EmailVerificationSuccess />,
  },
  {
    path: "/post/:id",
    element: <PostView />,
  },
  {
    path: "/500",
    element: <SomethingWentWrong />,
  },
  {
    path: "/404",
    element: <NotFound />,
  },
  {
    path: "/400",
    element: <BadRequest />,
  },
]);

function App() {
  const [theme, setTheme] = useState(
    localStorage.theme === "white" || !("theme" in localStorage)
      ? "white"
      : "dark"
  );
  const [triggerElement, setTriggerElement] = useState(null);

  const darkTheme = (e) => {
    setTheme("dark");
    localStorage.theme = "dark";
    setTriggerElement(e);
  };

  const lightTheme = (e) => {
    setTheme("white");
    localStorage.theme = "white";
    setTriggerElement(e);
  };

  useEffect(() => {
    document.querySelector("html").classList.remove("dark", "white");
    document.querySelector("html").classList.add(theme);
    if (triggerElement) {
      triggerElement.currentTarget.classList.add("dark:bg-white");
    }
  }, [theme]);

  return (
    <ThemeProvider value={{ theme, darkTheme, lightTheme }}>
      <ToastHandlerProvider>
        <Toaster />
        <RouterProvider router={router} />
      </ToastHandlerProvider>
    </ThemeProvider>
  );
}

export default App;
