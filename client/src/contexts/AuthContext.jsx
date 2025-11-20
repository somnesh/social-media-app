import React, { createContext, useContext, useEffect, useState } from "react";
import socket from "../services/socket";

// Create the context
const AuthContext = createContext();

// Provide a custom hook for easy access to the context
export const useAuth = () => useContext(AuthContext);

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Check authentication on mount
  useEffect(() => {
    const userId = localStorage.getItem("id");
    const userName = localStorage.getItem("name");

    if (userId) {
      setIsAuthenticated(true);
      setUser({ id: userId, name: userName });
    }
  }, []);

  // Register socket when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      socket.emit("register_user", {
        userId: user.id,
        userName: user.name,
      });

      console.log("Socket registered for user:", user.id);

      // Start heartbeat
      const heartbeatInterval = setInterval(() => {
        socket.emit("heartbeat", { userId: user.id });
      }, 20000); // Every 20 seconds

      return () => {
        clearInterval(heartbeatInterval);
      };
    }
  }, [isAuthenticated, user]);

  const login = (name, userId, userName, avatar, avatarBg) => {
    localStorage.setItem("id", userId);
    localStorage.setItem("username", userName);
    localStorage.setItem("avatar", avatar);
    localStorage.setItem("avatarBg", avatarBg);
    localStorage.setItem("name", name);

    setIsAuthenticated(true);
    setUser({ id: userId, name: userName });
  };

  const logout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("username");
    localStorage.removeItem("avatar");
    localStorage.removeItem("avatarBg");
    localStorage.removeItem("name");
    localStorage.removeItem("id");

    setIsAuthenticated(false);
    setUser(null);

    // Disconnect socket on logout
    socket.disconnect();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
