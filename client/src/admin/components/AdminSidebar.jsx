import { Link } from "react-router-dom";

import {
  Home,
  Users,
  FileText,
  BarChart2,
  Settings,
  AlertCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function AdminSidebar({ open, onClose, currentPage, setCurrentPage }) {
  const primaryColour = "#D8E6FD";

  return (
    <div
      className={`${
        open ? "translate-x-0" : "-translate-x-full"
      } fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
    >
      <div className="flex items-center justify-between px-4 py-5 border-b lg:justify-center">
        <span className="text-2xl font-semibold">Admin Dashboard</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="lg:hidden"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="p-4 space-y-2">
          <li>
            <Link to="/admin/dashboard">
              <span
                className={`flex items-center p-2 text-gray-700 ${
                  currentPage === "dashboard"
                    ? `bg-[${primaryColour}]`
                    : "hover:bg-gray-100 rounded"
                }`}
              >
                <Home className="w-5 h-5 mr-3" />
                Dashboard
              </span>
            </Link>
          </li>
          <li>
            <Link to="/admin/users">
              <span
                className={`flex items-center p-2 text-gray-700  ${
                  currentPage === "users"
                    ? `bg-[${primaryColour}]`
                    : "hover:bg-gray-100 rounded"
                } `}
              >
                <Users className="w-5 h-5 mr-3" />
                User Management
              </span>
            </Link>
          </li>
          <li>
            <Link to="/admin/settings">
              <span
                className={`flex items-center p-2 text-gray-700 ${
                  currentPage === "settings"
                    ? `bg-[${primaryColour}]`
                    : "hover:bg-gray-100 rounded"
                }`}
              >
                <Settings className="w-5 h-5 mr-3" />
                Settings
              </span>
            </Link>
          </li>
          <li>
            <Link to="/admin/reports">
              <span
                className={`flex items-center p-2 text-gray-700 ${
                  currentPage === "reports"
                    ? `bg-[${primaryColour}]`
                    : "hover:bg-gray-100 rounded"
                }`}
              >
                <AlertCircle className="w-5 h-5 mr-3" />
                Reports
              </span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default AdminSidebar;
