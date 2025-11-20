'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { MoreHorizontal, Trash2, Reply } from 'lucide-react'
import MessageReactions from './message-reactions'

export default function MessageGroup({ message, isGrouped, isOwn, onReaction }) {
  const [showOptions, setShowOptions] = useState(false)
  const [showReactionPicker, setShowReactionPicker] = useState(false)

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}>
      <div className="flex gap-2 max-w-xs md:max-w-md lg:max-w-lg">
        {/* Avatar (only for others, and not when grouped) */}
        {!isOwn && !isGrouped && (
          <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0 flex items-center justify-center text-xs font-medium">
            {message.sender?.charAt(0)}
          </div>
        )}

        {!isOwn && isGrouped && (
          <div className="w-8 flex-shrink-0" />
        )}

        {/* Message bubble */}
        <div className="flex flex-col gap-1">
          <div
            className={`px-4 py-2 rounded-2xl break-words ${
              isOwn
                ? 'bg-blue-500 text-white rounded-br-sm'
                : 'bg-muted text-foreground rounded-bl-sm'
            }`}
          >
            <p>{message.content}</p>
          </div>

          {/* Message info and reactions */}
          <div className="flex items-center gap-2 px-2 text-xs text-muted-foreground">
            <span>{formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}</span>
            {isOwn && message.isRead && (
              <span>✓✓</span>
            )}
          </div>

          {/* Reactions */}
          {message.hasReactions && message.reactions?.length > 0 && (
            <div className="flex gap-1 flex-wrap mt-1">
              {message.reactions.map((reaction, idx) => (
                <button
                  key={idx}
                  onClick={() => onReaction(reaction.emoji)}
                  className="px-2 py-1 bg-muted hover:bg-border rounded-full text-sm transition-colors flex items-center gap-1"
                >
                  <span>{reaction.emoji}</span>
                  {reaction.count > 1 && <span className="text-xs">{reaction.count}</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Message actions */}
        <div className="flex items-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity pt-1">
          <button
            onClick={() => setShowReactionPicker(!showReactionPicker)}
            className="p-1 hover:bg-muted rounded transition-colors"
            title="Add reaction"
          >
            <span className="text-lg">👍</span>
          </button>
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Reaction picker dropdown */}
        {showReactionPicker && (
          <div className="absolute mt-2 flex gap-1 bg-card border border-border rounded-lg p-2 shadow-lg z-20">
            {['😊', '❤️', '😂', '😮', '😢', '🔥', '👍', '🎉'].map(emoji => (
              <button
                key={emoji}
                onClick={() => {
                  onReaction(emoji)
                  setShowReactionPicker(false)
                }}
                className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded transition-colors text-lg"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* More options dropdown */}
        {showOptions && (
          <div className="absolute mt-2 bg-card border border-border rounded-lg shadow-lg z-20 w-40">
            <button className="w-full text-left px-4 py-2 hover:bg-muted flex items-center gap-2 transition-colors">
              <Reply className="w-4 h-4" />
              Reply
            </button>
            {isOwn && (
              <>
                <button className="w-full text-left px-4 py-2 hover:bg-muted transition-colors">
                  Edit
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-destructive/10 text-destructive flex items-center gap-2 transition-colors">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </>
            )}
            <button className="w-full text-left px-4 py-2 hover:bg-muted transition-colors">
              Copy
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-muted transition-colors">
              Forward
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
