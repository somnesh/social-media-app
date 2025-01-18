import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { AdminHeader } from "../components/AdminHeader";
import DashboardComp from "../components/DashboardComp";
import { useParams } from "react-router-dom";
import UserManagement from "./Users";
import SettingsPage from "./Settings";
import Reports from "./Reports";
import { WholePageLoader } from "@/components/loaders/WholePageLoader";
import ContentModeration from "./ContentModeration";
import QueryDatabasePage from "./QueryDatabasePage";

export default function AdminDashboard() {
  const { page } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(page);
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

  return (
    <>
      {pageLoading ? (
        <WholePageLoader />
      ) : (
        <div className="flex h-screen bg-gray-100 dark:bg-black">
          {/* Sidebar */}
          <AdminSidebar
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          {/* Main Content Area */}
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Header */}
            <AdminHeader
              onMenuButtonClick={() => setSidebarOpen(true)}
              setPageLoading={setPageLoading}
            />

            {/* Dashboard Content */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-black p-6 space-y-6">
              {currentPage === "dashboard" && <DashboardComp />}
              {currentPage === "users" && <UserManagement />}
              {currentPage === "content" && <ContentModeration />}
              {currentPage === "query" && <QueryDatabasePage />}
              {currentPage === "settings" && <SettingsPage />}
              {currentPage === "reports" && <Reports />}
            </main>
          </div>
        </div>
      )}
    </>
  );
}
