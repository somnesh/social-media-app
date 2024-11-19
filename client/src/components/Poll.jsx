import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  differenceInSeconds,
  format,
  differenceInDays,
  startOfDay,
} from "date-fns";
import { useAuth } from "../contexts/AuthContext";
import { useToastHandler } from "../contexts/ToastContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CircleAlert } from "lucide-react";

export default function Poll({ details }) {
  const navigate = useNavigate();
  const toastHandler = useToastHandler();
  const { isAuthenticated } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL;

  const [votes, setVotes] = useState(
    details.options.reduce((acc, curr) => {
      acc[curr.option] = curr.votes; // Add option as key and votes as value
      return acc;
    }, {})
  );
  const [userVote, setUserVote] = useState(
    Object.keys(votes)[details?.userVote] || null
  );
  const [expirationDays, setExpirationDays] = useState(
    differenceInDays(new Date(details.expiresAt), startOfDay(new Date()))
  );
  const [expirationDate, setExpirationDate] = useState(
    new Date(details.expiresAt)
  );
  const [remainingTime, setRemainingTime] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!expirationDate) return;

    const timer = setInterval(() => {
      const now = new Date();
      const diff = differenceInSeconds(expirationDate, now);

      if (diff <= 0) {
        setIsExpired(true);
        setRemainingTime("Expired");
        clearInterval(timer);
      } else {
        const days = Math.floor(diff / (24 * 60 * 60));
        const hours = Math.floor((diff % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((diff % (60 * 60)) / 60);
        const seconds = diff % 60;

        if (days > 0) {
          setRemainingTime(`${days}d ${hours}h left`);
        } else if (hours > 0) {
          setRemainingTime(`${hours}h ${minutes}m left`);
        } else {
          setRemainingTime(`${minutes}m ${seconds}s left`);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expirationDate]);

  const handleVote = async (option) => {
    if (!userVote && !isExpired && isAuthenticated) {
      try {
        const optionIndex = Object.keys(votes).indexOf(option);

        // Update the votes locally
        setVotes((prevVotes) => ({
          ...prevVotes,
          [option]: prevVotes[option] + 1,
        }));
        setUserVote(option);

        await axios.post(
          `${API_URL}/post/polls/${details._id}/vote`,
          { selectedOptionIndex: optionIndex },
          {
            withCredentials: true,
          }
        );
      } catch (error) {
        console.error("poll vote:", error);
        setVotes((prevVotes) => ({
          ...prevVotes,
          [option]: prevVotes[option] - 1,
        }));
        setUserVote(null);
        toastHandler(
          <div className="flex gap-2 items-center">
            <CircleAlert className="bg-red-600 rounded-full text-white dark:text-[#7f1d1d]" />
            <span>Something went wrong</span>
          </div>,
          true
        );
      }
    } else {
      navigate("/login");
    }
  };

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  return (
    <div className="w-full p-6 bg-inherit bg-white dark:bg-[#242526]">
      <h2 className="text-2xl font-bold mb-4">{details.question}</h2>

      <div className="space-y-4 my-6">
        {Object.entries(votes).map(([option, voteCount]) => {
          const percentage =
            totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;

          return (
            <motion.button
              key={option}
              onClick={() => handleVote(option)}
              disabled={userVote !== null || isExpired}
              className={`relative  dark:border-[#5a5a5a] border-gray-200 w-full py-4 px-6 text-left transition-colors duration-200 ease-in-out rounded-xl overflow-hidden ${
                userVote === option
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-600"
              } ${
                (userVote && userVote !== option) || isExpired
                  ? "opacity-60 cursor-not-allowed"
                  : ""
              }`}
              whileHover={!userVote && !isExpired ? { scale: 1.02 } : {}}
              whileTap={!userVote && !isExpired ? { scale: 0.98 } : {}}
            >
              <motion.div
                className="absolute inset-0 bg-blue-200 dark:bg-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
              <span className="relative z-10 font-medium">{option}</span>
              {totalVotes > 0 && (
                <span className="relative z-10 float-right font-medium">
                  {percentage.toFixed(1)}%
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="text-center">
        <p
          className={`font-bold ${
            isExpired ? "text-red-600" : "text-blue-600"
          }`}
        >
          {isExpired ? "Poll Expired" : remainingTime}
        </p>
        {expirationDate && (
          <p className="text-sm text-gray-500 mt-1">
            Expires on: {format(expirationDate, "PPpp")}
          </p>
        )}
        <p className="text-sm text-gray-500 mt-2">Total votes: {totalVotes}</p>
      </div>

      {isExpired && (
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Final Results</h3>
          {Object.entries(votes).map(([option, voteCount]) => (
            <p key={option} className="text-gray-800 dark:text-white">
              {option}: {voteCount} votes (
              {totalVotes > 0
                ? ((voteCount / totalVotes) * 100).toFixed(1)
                : "0"}
              %)
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
