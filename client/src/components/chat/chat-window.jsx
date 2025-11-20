"use client";

import { useState, useRef, useEffect } from "react";
import {
  Phone,
  Video,
  Info,
  Paperclip,
  Smile,
  Send,
  MoreHorizontal,
  ArrowLeft,
} from "lucide-react";
import MessageGroup from "./message-group";
import TypingIndicator from "./typing-indicator";
import { mockMessages, mockReactions } from "@/lib/mock-data";

export default function ChatWindow({ chat, setShowSidebar, setSelectedChat }) {
  const [messages, setMessages] = useState(mockMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simulate typing indicator
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setIsTyping(true);

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: "user",
      content: inputValue,
      timestamp: new Date().toISOString(),
      isRead: false,
      hasReactions: false,
      reactions: [],
    };

    setMessages([...messages, newMessage]);
    setInputValue("");
    setIsTyping(false);

    // Simulate reply after delay
    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        sender: chat.name,
        content: "Got it! 👍",
        timestamp: new Date().toISOString(),
        isRead: true,
        hasReactions: false,
        reactions: [],
      };
      setMessages((prev) => [...prev, reply]);
    }, 1000);
  };

  const handleReaction = (messageId, emoji) => {
    setMessages(
      messages.map((msg) => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions?.find(
            (r) => r.emoji === emoji
          );
          if (existingReaction) {
            return {
              ...msg,
              reactions: msg.reactions.map((r) =>
                r.emoji === emoji ? { ...r, count: r.count + 1 } : r
              ),
            };
          } else {
            return {
              ...msg,
              reactions: [...(msg.reactions || []), { emoji, count: 1 }],
              hasReactions: true,
            };
          }
        }
        return msg;
      })
    );
  };

  const handleBackToChats = () => {
    setSelectedChat(null);
    setShowSidebar(true);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
        <div className="flex items-center gap-3 ">
          <div className="flex items-center">
            <button
              className="p-2 hover:bg-muted rounded-full transition-colors cursor-pointer"
              onClick={handleBackToChats}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <img
              src={chat.avatar || "/placeholder.svg"}
              alt={chat.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <h2 className="font-semibold truncate">{chat.name}</h2>
            <p className="text-xs text-muted-foreground">
              {chat.isActive ? "Active now" : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="Voice call"
          >
            <Phone className="w-5 h-5" />
          </button>
          <button
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="Video call"
          >
            <Video className="w-5 h-5" />
          </button>
          <button
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="Chat info"
          >
            <Info className="w-5 h-5" />
          </button>
          <button
            className="p-2 hover:bg-muted rounded-lg transition-colors md:hidden"
            title="More options"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
        {messages.map((message, index) => {
          const isGrouped =
            index > 0 && messages[index - 1].sender === message.sender;
          return (
            <MessageGroup
              key={message.id}
              message={message}
              isGrouped={isGrouped}
              isOwn={message.sender === "user"}
              onReaction={(emoji) => handleReaction(message.id, emoji)}
            />
          );
        })}

        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-border bg-card space-y-3">
        {/* Emoji picker (simple) */}
        {showEmojiPicker && (
          <div className="flex gap-2 flex-wrap p-2 bg-muted rounded-lg">
            {["😊", "❤️", "😂", "😮", "😢", "🔥", "👍", "🎉"].map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  setInputValue(inputValue + emoji);
                  setShowEmojiPicker(false);
                }}
                className="w-8 h-8 flex items-center justify-center hover:bg-border rounded transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <button
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="Attach file"
          >
            <Paperclip className="w-5 h-5 text-muted-foreground" />
          </button>

          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={(e) =>
              e.key === "Enter" && !e.shiftKey && handleSendMessage()
            }
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground placeholder:text-muted-foreground"
          />

          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="Emoji picker"
          >
            <Smile className="w-5 h-5 text-muted-foreground" />
          </button>

          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-muted text-white rounded-lg transition-colors"
            title="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
