import { Bell, Search, User, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AdminHeader({ onMenuButtonClick }) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuButtonClick}
          className="mr-4 lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </Button>
        <Input type="text" placeholder="Search..." className="w-64 mr-4" />
        <Button variant="ghost" size="icon">
          <Search className="w-5 h-5" />
        </Button>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon">
          <Bell className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <User className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}
