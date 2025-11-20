"use client";

import { formatDistanceToNow } from "date-fns";
import { CheckCheck, Volume2 } from "lucide-react";

export default function ChatListItem({ chat, isSelected, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className={`w-full px-4 py-3 flex gap-3 hover:bg-muted transition-colors border-b border-border text-left cursor-pointer ${
        isSelected ? "bg-muted" : ""
      }`}
    >
      {/* Avatar */}
      <div className="shrink-0 relative">
        <img
          src={chat.avatar || "/placeholder.svg"}
          alt={chat.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        {chat.isActive && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 justify-between">
          <h3 className="font-medium text-foreground truncate">{chat.name}</h3>
          <span className="text-xs text-muted-foreground shrink-0">
            {formatDistanceToNow(new Date(chat.timestamp), {
              addSuffix: false,
            })}
          </span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          {chat.isVoiceMessage && (
            <Volume2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          )}
          {chat.lastMessageRead && (
            <CheckCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          )}
          <div className="flex items-center justify-between gap-2 w-full">
            <p className="text-sm text-muted-foreground truncate">
              {chat.lastMessage}
            </p>
            {/* Unread badge */}
            {chat.unreadCount > 0 && (
              <div className="shrink-0 w-5 h-5 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center">
                {chat.unreadCount > 9 ? "9+" : chat.unreadCount}
              </div>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
