import { MailCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function EmailVerificationSuccess() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(8);

  useEffect(() => {
    // Set up a countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // Redirect when countdown reaches 0
    if (countdown === 0) {
      navigate("/login");
    }

    // Clean up the timer when the component unmounts
    return () => clearInterval(timer);
  }, [countdown, navigate]);

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center gap-2">
      <div className="flex text-3xl gap-2 items-center justify-center">
        <MailCheck size={34} />
        <span>Email Verified Successfully!</span>
      </div>
      <div>
        <span>You will be redirected to the login page in </span>
        <span className="text-indigo-300">{countdown} seconds</span>
      </div>
      <div className="text-sm text-gray-400 flex flex-col items-center gap-2">
        <span>Thank you for verifying your email.</span>
        <span>
          If you're not redirected automatically,{" "}
          <a href="/login" className="text-indigo-500">
            click here
          </a>{" "}
          to go to the login page.
        </span>
      </div>
    </div>
  );
}
