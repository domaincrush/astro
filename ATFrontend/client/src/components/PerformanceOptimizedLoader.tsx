import { Loader2 } from 'lucide-react';

interface PerformanceOptimizedLoaderProps {
  color?: string;
  size?: number;
  message?: string;
}

export const PerformanceOptimizedLoader = ({ 
  color = 'text-amber-500', 
  size = 8, 
  message = 'Loading...' 
}: PerformanceOptimizedLoaderProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <Loader2 className={`h-${size} w-${size} animate-spin ${color}`} />
      {message && (
        <p className="text-sm text-gray-600 font-medium">{message}</p>
      )}
    </div>
  );
};

// Critical loading states for different sections
export const ComponentLoader = ({ section }: { section: string }) => (
  <PerformanceOptimizedLoader 
    message={`Loading ${section}...`}
    color="text-blue-500"
    size={6}
  />
);

export const ChartLoader = () => (
  <PerformanceOptimizedLoader 
    message="Generating charts..."
    color="text-purple-500"
    size={8}
  />
);

export const ReportLoader = () => (
  <PerformanceOptimizedLoader 
    message="Preparing your report..."
    color="text-amber-500"
    size={10}
  />
);