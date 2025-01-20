import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Bell,
  Key,
  Lock,
  User,
  Globe,
  Eye,
  Menu,
  EyeOff,
  KeyRound,
  Loader2,
} from "lucide-react";
import { Header } from "../components/Header";
import { Alert, AlertDescription } from "../components/ui/alert";
import axios from "axios";
import { WholePageLoader } from "../components/loaders/WholePageLoader";

export default function UserSettingsPage() {
  const [activeTab, setActiveTab] = useState("account");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pageLoading, setPageLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const categories = [
    { id: "account", label: "Account", icon: User },
    { id: "privacy", label: "Privacy", icon: Lock },
    { id: "security", label: "Security", icon: Key },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "accessibility", label: "Accessibility", icon: Eye },
    { id: "language", label: "Language", icon: Globe },
  ];

  const handleUpdatePassword = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }
    // console.log(currentPassword);
    // console.log(newPassword);

    try {
      await axios.post(
        `${API_URL}/auth/user/change-password`,
        {
          currentPassword,
          newPassword,
        },
        { withCredentials: true }
      );
      setSuccess(true);
      setIsLoading(false);
    } catch (err) {
      console.error(err);

      if (
        err.status !== 500 &&
        err.response &&
        err.response.data &&
        err.response.data.msg
      ) {
        setError(err.response.data.msg);
      } else {
        setError(
          "An error occurred while resetting your password. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const Navigation = ({ className = "" }) => (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Settings Menu</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeTab === category.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab(category.id)}
              >
                <category.icon className="mr-2 h-4 w-4" />
                {category.label}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );

  return (
    <>
      {pageLoading ? (
        <WholePageLoader />
      ) : (
        <>
          <Header setPageLoading={setPageLoading} />
          <div className="container mx-auto p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row">
              <div className="hidden lg:block w-64 mr-6">
                <Navigation />
              </div>
              <div className="lg:hidden mb-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Menu className="mr-2 h-4 w-4" />
                      Settings Menu
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <Navigation className="mt-4" />
                  </SheetContent>
                </Sheet>
              </div>
              <div className="flex-grow">
                <h1 className="text-3xl font-bold mb-6">Settings</h1>
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="space-y-6"
                >
                  <TabsContent value="account">
                    <Card>
                      <CardHeader>
                        <CardTitle>Account Settings</CardTitle>
                        <CardDescription>
                          Manage your account details and preferences.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            placeholder="Your name"
                            disabled={true}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Your email"
                            disabled={true}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            placeholder="Tell us about yourself"
                            disabled={true}
                          />
                        </div>
                        <Button disabled={true}>Save Changes</Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="privacy">
                    <Card>
                      <CardHeader>
                        <CardTitle>Privacy Settings</CardTitle>
                        <CardDescription>
                          Control your privacy and data sharing preferences.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex flex-col space-y-2">
                          <Label htmlFor="profile-visibility">
                            Profile Visibility
                          </Label>
                          <Select disabled={true}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select visibility" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="public">Public</SelectItem>
                              <SelectItem value="friends">
                                Friends Only
                              </SelectItem>
                              <SelectItem value="private">Private</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="allow-tagging" disabled={true} />
                          <Label htmlFor="allow-tagging">
                            Allow others to tag you in posts
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="show-online-status" disabled={true} />
                          <Label htmlFor="show-online-status">
                            Show online status
                          </Label>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="security">
                    <Card>
                      <CardHeader>
                        <CardTitle>Security Settings</CardTitle>
                        <CardDescription>
                          Manage your account security and login options.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2 relative">
                          <Label htmlFor="current-password">
                            Current Password
                          </Label>
                          <Input
                            id="current-password"
                            type={showPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => {
                              setCurrentPassword(e.target.value);
                            }}
                            placeholder="Enter your current password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-2 h-full px-3 py-2 hover:bg-transparent"
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
                        <div className="space-y-2 relative">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input
                            id="new-password"
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => {
                              setNewPassword(e.target.value);
                            }}
                            placeholder="Create new password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-2 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-500" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-500" />
                            )}
                            <span className="sr-only">
                              {showNewPassword
                                ? "Hide password"
                                : "Show password"}
                            </span>
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">
                            Confirm New Password
                          </Label>
                          <Input
                            id="confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your new password"
                          />
                        </div>
                        {error && (
                          <Alert
                            variant="destructive"
                            className={"text-red-500"}
                          >
                            <AlertDescription>{error}</AlertDescription>
                          </Alert>
                        )}
                        {success && (
                          <Alert>
                            <AlertDescription>
                              Your password has been changed.
                            </AlertDescription>
                          </Alert>
                        )}
                        <Button onClick={handleUpdatePassword}>
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Updating...
                            </>
                          ) : (
                            <>
                              <KeyRound className="mr-2 h-4 w-4" />
                              Update Password
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="notifications">
                    <Card>
                      <CardHeader>
                        <CardTitle>Notification Preferences</CardTitle>
                        <CardDescription>
                          Customize how you receive notifications.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Email Notifications</Label>
                          <div className="flex items-center space-x-2">
                            <Switch id="email-comments" disabled={true} />
                            <Label htmlFor="email-comments">
                              Comments on your posts
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="email-tags" disabled={true} />
                            <Label htmlFor="email-tags">Tags in photos</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="email-messages" disabled={true} />
                            <Label htmlFor="email-messages">
                              Direct messages
                            </Label>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Push Notifications</Label>
                          <div className="flex items-center space-x-2">
                            <Switch id="push-all" disabled={true} />
                            <Label htmlFor="push-all">All notifications</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="push-mentions" disabled={true} />
                            <Label htmlFor="push-mentions">Mentions only</Label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="accessibility">
                    <Card>
                      <CardHeader>
                        <CardTitle>Accessibility Settings</CardTitle>
                        <CardDescription>
                          Customize your experience for better accessibility.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Color Contrast</Label>
                          <RadioGroup defaultValue="normal" disabled={true}>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="normal"
                                id="contrast-normal"
                              />
                              <Label htmlFor="contrast-normal">Normal</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="high" id="contrast-high" />
                              <Label htmlFor="contrast-high">High</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        <div className="space-y-2">
                          <Label>Font Size</Label>
                          <Select disabled={true}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select font size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="small">Small</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="large">Large</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="reduce-motion" disabled={true} />
                          <Label htmlFor="reduce-motion">Reduce motion</Label>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="language">
                    <Card>
                      <CardHeader>
                        <CardTitle>Language Settings</CardTitle>
                        <CardDescription>
                          Choose your preferred language for the application.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="language">Preferred Language</Label>
                          <Select disabled={true}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="es">Español</SelectItem>
                              <SelectItem value="fr">Français</SelectItem>
                              <SelectItem value="de">Deutsch</SelectItem>
                              <SelectItem value="zh">中文</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button disabled={true}>
                          Save Language Preference
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
