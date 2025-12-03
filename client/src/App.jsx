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
import { AuthProvider } from "./contexts/AuthContext";
import { ProfilePage } from "./pages/ProfilePage";
import UserSettingsPage from "./pages/UserSettingsPage";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import Maintenance from "./admin/pages/Maintenance";
import { Suspension } from "./pages/Suspension";
import UserFeedback from "./admin/pages/UserFeedback";
import axios from "axios";
import Privacy from "./pages/legal/Privacy";
import TermsAndConditions from "./pages/legal/terms";
import CommunityGuidelines from "./pages/legal/community";
import CookiePolicy from "./pages/legal/cookies";
import DataDeletionPolicy from "./pages/legal/deletion";

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
    path: "admin",
    element: <AdminLogin />,
  },
  {
    path: "admin/:page",
    element: <AdminDashboard />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/userFeedback",
    element: <UserFeedback />,
  },
  {
    path: "/suspension",
    element: <Suspension />,
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
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password-success/:encryptUserId",
    element: <ResetPassword />,
  },
  {
    path: "/post/:id",
    element: <PostView />,
  },
  {
    path: "/user/:username",
    element: <ProfilePage />,
  },
  {
    path: "/settings",
    element: <UserSettingsPage />,
  },
  {
    path: "/privacy-policy",
    element: <Privacy />,
  },
  {
    path: "/terms",
    element: <TermsAndConditions />,
  },
  {
    path: "/community-guidelines",
    element: <CommunityGuidelines />,
  },
  {
    path: "/cookie-policy",
    element: <CookiePolicy />,
  },
  {
    path: "/data-deletion-policy",
    element: <DataDeletionPolicy />,
  },
  {
    path: "/500",
    element: <SomethingWentWrong />,
  },
  {
    path: "/503",
    element: <Maintenance />,
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

  if (navigator.userAgentData) {
    // calculate current time in 10:00 AM format
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const currentTime = `${hours}:${minutes}`;
    console.log("Current Time: " + currentTime);

    navigator.userAgentData.getHighEntropyValues(["model"]).then((ua) => {
      if (ua.model) {
        console.log("Device Model: " + ua.model); // e.g., "POCO F1" (on Android)

        // Send this data to your server using axios
        axios.post("/api/logDeviceInfo", {
          model: ua.model,
          time: currentTime,
        });
      }
    });

    const SERVER_URL = import.meta.env.VITE_SERVER_URL;

    axios.post(`${SERVER_URL}/api/v1/user/logDeviceInfo`, {
      model: navigator.userAgentData.platform,
      time: currentTime,
    });
  }

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
    <>
      <SpeedInsights />
      <Analytics />
      <AuthProvider>
        <ThemeProvider value={{ theme, darkTheme, lightTheme }}>
          <ToastHandlerProvider>
            <Toaster />
            <RouterProvider router={router} />
          </ToastHandlerProvider>
        </ThemeProvider>
      </AuthProvider>
    </>
  );
}

export default App;
