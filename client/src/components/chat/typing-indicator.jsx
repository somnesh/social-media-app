export default function TypingIndicator() {
  return (
    <div className="flex gap-2 items-center">
      <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0" />
      <div className="flex gap-1 px-4 py-2 rounded-2xl bg-muted">
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  )
}
