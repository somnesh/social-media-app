"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/chat/sidebar";
import ChatWindow from "@/components/chat/chat-window";
// import { useIsMobile } from "@/components/hooks/use-mobile";

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const isMobile = true;

  // Auto-hide sidebar on mobile when chat is selected
  useEffect(() => {
    if (isMobile && selectedChat) {
      setShowSidebar(false);
    }
  }, [isMobile, selectedChat]);

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  return (
    <div className="flex sm:h-[84vh] h-screen bg-background text-foreground">
      {/* Sidebar */}
      {(showSidebar || !isMobile) && (
        <div
          className={`
          w-full  flex flex-col `}
        >
          <Sidebar
            selectedChat={selectedChat}
            onChatSelect={handleChatSelect}
            onBackClick={isMobile ? () => setShowSidebar(false) : undefined}
          />
        </div>
      )}

      {/* Chat Window */}
      <div
        className={`flex-1 flex flex-col ${
          isMobile && !selectedChat ? "hidden" : ""
        }`}
      >
        {/* {selectedChat && isMobile && (
          <button
            onClick={handleBackToChats}
            className="p-4 border-b border-border sm:hidden"
          >
            ← Back
          </button>
        )} */}
        {selectedChat ? (
          <ChatWindow
            chat={selectedChat}
            setShowSidebar={setShowSidebar}
            setSelectedChat={setSelectedChat}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <svg
                className="w-8 h-8 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="text-muted-foreground text-center">
              Select a chat to start messaging
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
