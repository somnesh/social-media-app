export default function MessageReactions({ reactions = [], onReaction }) {
  const commonEmojis = ['😊', '❤️', '😂', '😮', '😢', '🔥', '👍', '🎉']

  return (
    <div className="flex gap-1 flex-wrap">
      {reactions.map((reaction, idx) => (
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
  )
}
