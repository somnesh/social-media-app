import { useEffect, useState } from "react";
import { Feed } from "./components/Feed";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { ThemeProvider } from "./contexts/theme";
import { Toaster } from "./components/ui/toaster";
import { ToastHandlerProvider } from "./contexts/ToastContext";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";

import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import { Home } from "./pages/HomePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/signin",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
]);

function App() {
  const [theme, setTheme] = useState(
    localStorage.theme === "dark" || !("theme" in localStorage)
      ? "dark"
      : "white"
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
        <RouterProvider router={router}>
          <Toaster />
        </RouterProvider>
      </ToastHandlerProvider>
    </ThemeProvider>
  );
}

export default App;
