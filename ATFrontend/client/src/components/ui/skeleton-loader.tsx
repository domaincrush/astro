import { Card, CardContent, CardHeader } from "src/components/ui/card";

// Basic skeleton component
export function Skeleton({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] ${className}`}
      {...props}
    />
  );
}

// FAQ Question Card Skeleton
export function FAQQuestionSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <div className="grid md:grid-cols-3 gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-16 w-full" />
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Admin Response Card Skeleton
export function AdminResponseSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="bg-gradient-to-r from-orange-100 to-amber-100">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          <Skeleton className="h-8 w-28" />
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div>
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-12 w-full" />
        </div>
        <Skeleton className="h-px w-full" />
        <div>
          <Skeleton className="h-4 w-40 mb-2" />
          <Skeleton className="h-20 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

// Stats Card Skeleton
export function StatsCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardContent className="p-6 text-center">
        <Skeleton className="h-8 w-8 mx-auto mb-3" />
        <Skeleton className="h-8 w-12 mx-auto mb-2" />
        <Skeleton className="h-4 w-20 mx-auto" />
      </CardContent>
    </Card>
  );
}

// Table Row Skeleton
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="p-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

// Loading Grid
export function LoadingGrid({ 
  count = 3, 
  Component = FAQQuestionSkeleton 
}: { 
  count?: number; 
  Component?: React.ComponentType; 
}) {
  return (
    <div className="grid gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <Component key={i} />
      ))}
    </div>
  );
}