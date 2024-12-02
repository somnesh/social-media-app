import { MailQuestion } from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

export function EmailVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  useEffect(() => {
    if (!email) {
      navigate("/400");
    }
  }, [email, navigate]);

  if (!email) return null;

  return (
    <div className="h-screen w-screen flex flex-col gap-2 justify-center items-center">
      <div className="flex text-2xl gap-2 items-center justify-center">
        <MailQuestion size={28} />
        <span>Verification email sent</span>
      </div>
      <div>
        <span>A verification email has been sent to </span>
        <span className="text-indigo-300 underline">{email}</span>
      </div>
      <div className="text-sm text-gray-400 flex flex-col items-center">
        <span>Go to your inbox and verify your email</span>
        <span>You can close this tab.</span>
      </div>
      <Link to={"/login"} className="mt-2">
        <Button>Login</Button>
      </Link>
    </div>
  );
}
