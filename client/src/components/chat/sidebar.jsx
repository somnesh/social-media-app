"use client";

import { useState, useMemo } from "react";
import { Search, Plus, MoreHorizontal } from "lucide-react";
import ChatListItem from "./chat-list-item";
import { mockChats } from "@/lib/mock-data";

export default function Sidebar({ selectedChat, onChatSelect, onBackClick }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); // all, unread, active

  const filteredChats = useMemo(() => {
    return mockChats.filter((chat) => {
      const matchesSearch =
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        filter === "all" ||
        (filter === "unread" && chat.unreadCount > 0) ||
        (filter === "active" && chat.isActive);
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, filter]);

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="px-4 pb-4 border-b border-border space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Messages</h1>
          <button className="p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {["all", "unread", "active"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                filter === f
                  ? "bg-blue-500 text-white"
                  : "bg-muted text-muted-foreground hover:bg-border"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isSelected={selectedChat?.id === chat.id}
              onSelect={() => onChatSelect(chat)}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            <p>No chats found</p>
          </div>
        )}
      </div>

      {/* User profile footer */}
      {/* <div className="p-4 border-t border-border flex items-center gap-3">
        <img
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=user1"
          alt="Your profile"
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">You</p>
          <p className="text-xs text-muted-foreground">Active now</p>
        </div>
        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div> */}
    </div>
  );
}
