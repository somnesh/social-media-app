'use client'

export function SkeletonLine({ className = '', width = 'w-full' }) {
  return (
    <div className={`h-4 bg-muted rounded-lg overflow-hidden ${width} ${className}`}>
      <div className="h-full bg-gradient-to-r from-muted via-muted-foreground/10 to-muted animate-pulse" />
    </div>
  )
}

export function SidebarSkeleton() {
  return (
    <div className="flex flex-col h-full bg-card animate-pulse">
      {/* Header */}
      <div className="p-4 border-b border-border space-y-4">
        <div className="flex items-center justify-between">
          <SkeletonLine width="w-32" />
          <div className="w-10 h-10 bg-muted rounded-lg" />
        </div>
        <SkeletonLine />
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-8 bg-muted rounded-full flex-1" />
          ))}
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-3 border-b border-border/50 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-muted rounded-full flex-shrink-0" />
              <div className="flex-1 min-w-0 space-y-2">
                <SkeletonLine width="w-24" />
                <SkeletonLine width="w-full" className="h-3" />
              </div>
              <div className="w-6 h-6 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border flex items-center gap-3">
        <div className="w-10 h-10 bg-muted rounded-full flex-shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
          <SkeletonLine width="w-16" />
          <SkeletonLine width="w-20" className="h-3" />
        </div>
        <div className="w-8 h-8 bg-muted rounded" />
      </div>
    </div>
  )
}

export function ChatWindowSkeleton() {
  return (
    <div className="flex flex-col h-full bg-background animate-pulse">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-muted rounded-full flex-shrink-0" />
          <div className="flex-1 min-w-0 space-y-2">
            <SkeletonLine width="w-32" />
            <SkeletonLine width="w-24" className="h-3" />
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-10 h-10 bg-muted rounded-lg" />
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden p-4 space-y-4">
        {[...Array(5)].map((_, i) => {
          const isOwn = i % 2 === 0
          return (
            <div key={i} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs space-y-2 ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                {!isOwn && <div className="w-8 h-8 bg-muted rounded-full" />}
                <div className={`${isOwn ? 'bg-blue-500/50' : 'bg-muted'} rounded-lg p-3 h-12 min-w-40`} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-border bg-card space-y-3">
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`${i === 1 ? 'flex-1' : 'w-10'} h-10 bg-muted rounded-lg`} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function MessageSkeletons() {
  return (
    <div className="flex-1 overflow-hidden p-4 space-y-4">
      {[...Array(8)].map((_, i) => {
        const isOwn = i % 2 === 0
        return (
          <div key={i} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
              {!isOwn && <div className="w-8 h-8 bg-muted rounded-full flex-shrink-0" />}
              <div className="space-y-2 flex flex-col">
                <div className={`${isOwn ? 'bg-blue-500/50' : 'bg-muted'} rounded-lg h-12 min-w-48 md:min-w-56`} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
