import { Link } from "react-router-dom";

import {
  Home,
  Users,
  FileText,
  BarChart2,
  Settings,
  AlertCircle,
  X,
  FileTextIcon,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function AdminSidebar({ open, onClose, currentPage, setCurrentPage }) {
  return (
    <div
      className={`${
        open ? "translate-x-0" : "-translate-x-full"
      } fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-black border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
    >
      <div className="flex items-center justify-between px-4 py-5 border-b lg:justify-center">
        <span className="text-lg sm:text-2xl font-semibold">
          Admin Dashboard
        </span>
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
                className={`flex items-center p-2 text-gray-700 dark:text-white rounded ${
                  currentPage === "dashboard"
                    ? `bg-[#D8E6FD] dark:bg-[#333943]`
                    : "hover:bg-gray-100 dark:hover:bg-slate-800"
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
                className={`flex items-center p-2 text-gray-700 dark:text-white rounded ${
                  currentPage === "users"
                    ? `bg-[#D8E6FD] dark:bg-[#333943]`
                    : "hover:bg-gray-100 dark:hover:bg-slate-800"
                } `}
              >
                <Users className="w-5 h-5 mr-3" />
                User Management
              </span>
            </Link>
          </li>
          <li>
            <Link to="/admin/content">
              <span
                className={`flex items-center p-2 text-gray-700 dark:text-white rounded ${
                  currentPage === "content"
                    ? `bg-[#D8E6FD] dark:bg-[#333943]`
                    : "hover:bg-gray-100 dark:hover:bg-slate-800"
                } `}
              >
                <FileTextIcon className="w-5 h-5 mr-3" />
                Content Moderation
              </span>
            </Link>
          </li>
          <li>
            <Link to="/admin/query">
              <span
                className={`flex items-center p-2 text-gray-700 dark:text-white rounded ${
                  currentPage === "query"
                    ? `bg-[#D8E6FD] dark:bg-[#333943]`
                    : "hover:bg-gray-100 dark:hover:bg-slate-800"
                } `}
              >
                <img src="/icons/gemini.svg" alt="" />
                <span className="pl-2">Query Database</span>
              </span>
            </Link>
          </li>
          <li>
            <Link to="/admin/reports">
              <span
                className={`flex items-center p-2 text-gray-700 dark:text-white rounded ${
                  currentPage === "reports"
                    ? `bg-[#D8E6FD] dark:bg-[#333943]`
                    : "hover:bg-gray-100 dark:hover:bg-slate-800"
                }`}
              >
                <AlertCircle className="w-5 h-5 mr-3" />
                Reports
              </span>
            </Link>
          </li>
          <li>
            <Link to="/admin/userFeedback">
              <span
                className={`flex items-center p-2 text-gray-700 dark:text-white rounded ${
                  currentPage === "userFeedback"
                    ? `bg-[#D8E6FD] dark:bg-[#333943]`
                    : "hover:bg-gray-100 dark:hover:bg-slate-800"
                }`}
              >
                <MessageSquare className="w-5 h-5 mr-3" />
                User Feedbacks
              </span>
            </Link>
          </li>
          <li>
            <Link to="/admin/settings">
              <span
                className={`flex items-center p-2 text-gray-700 dark:text-white rounded ${
                  currentPage === "settings"
                    ? `bg-[#D8E6FD] dark:bg-[#333943]`
                    : "hover:bg-gray-100 dark:hover:bg-slate-800"
                }`}
              >
                <Settings className="w-5 h-5 mr-3" />
                Settings
              </span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default AdminSidebar;
