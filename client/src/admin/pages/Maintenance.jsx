import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // Replace with your actual API URL

export default function Maintenance() {
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch maintenance status on refresh
    async function checkMaintenanceStatus() {
      try {
        const response = await axios.get(`${API_URL}/admin/maintenance`);

        if (!response.data.maintenance) {
          navigate(-1); // Go back to the previous page if not in maintenance
        }
      } catch (error) {
        console.error("Error checking maintenance status:", error);
      }
    }

    checkMaintenanceStatus();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-muted shadow-lg rounded-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-50 mb-4">
          We'll be back soon!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          We're currently performing some scheduled maintenance. We'll be back
          online shortly!
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-200">
          Thank you for your patience. If you need immediate assistance, please
          contact our support team.
        </p>
      </div>
    </div>
  );
}
