import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { LockIcon, MailIcon } from "lucide-react";
import axios from "axios";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsInvalid(false);

    try {
      const result = await axios.post(`${API_URL}/admin/login`, {
        email: email,
        password: password,
      });
      navigate("/admin/dashboard");
      console.log(result);
    } catch (err) {
      console.error(err);

      if (
        err.status !== 500 &&
        err.response &&
        err.response.data &&
        err.response.data.msg
      ) {
        setIsInvalid(true);
        setError(err.response.data.msg);
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Admin Login
        </h1>
        <Card className="shadow-lg">
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`pl-10 ${
                      isInvalid ? "border-red-500 focus:ring-red-500" : ""
                    }`}
                  />
                  <MailIcon
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`pl-10 ${
                      isInvalid ? "border-red-500 focus:ring-red-500" : ""
                    }`}
                  />
                  <LockIcon
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                </div>
              </div>
              {error && (
                <Alert variant="destructive" className={"text-red-500"}>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Log in"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
