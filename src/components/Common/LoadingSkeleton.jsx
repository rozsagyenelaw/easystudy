export function CardSkeleton({ count = 3 }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl p-5 border border-stone-200 dark:border-slate-700"
        >
          <div className="h-4 bg-stone-200 dark:bg-slate-700 rounded w-3/4 mb-3" />
          <div className="h-3 bg-stone-200 dark:bg-slate-700 rounded w-1/2" />
        </div>
      ))}
    </div>
  )
}

export function TextSkeleton({ lines = 4 }) {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 bg-stone-200 dark:bg-slate-700 rounded"
          style={{ width: `${80 + Math.random() * 20}%` }}
        />
      ))}
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-8 bg-stone-200 dark:bg-slate-700 rounded w-48 mb-8" />
      <CardSkeleton count={4} />
    </div>
  )
}
