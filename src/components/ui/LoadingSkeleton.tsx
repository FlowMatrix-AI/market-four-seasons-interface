export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-4 shadow-sm animate-pulse">
      <div className="h-4 bg-neutral-200 rounded w-3/4 mb-3" />
      <div className="h-3 bg-neutral-200 rounded w-1/2 mb-2" />
      <div className="h-3 bg-neutral-200 rounded w-2/3" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse">
      <div className="h-10 bg-neutral-100 rounded mb-1" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-neutral-50 rounded mb-1" />
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 bg-neutral-200 rounded w-48" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <TableSkeleton />
    </div>
  );
}
