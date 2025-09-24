import React, { useState, useEffect, useRef } from 'react';

interface DeferredSectionProps {
  children: React.ReactNode;
  className?: string;
  fallback?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
  minHeight?: string;
  priority?: 'high' | 'low';
}

export const DeferredSection: React.FC<DeferredSectionProps> = ({
  children,
  className = '',
  fallback,
  rootMargin = '100px',
  threshold = 0.1,
  minHeight = '200px',
  priority = 'low'
}) => {
  const [isVisible, setIsVisible] = useState(priority === 'high');
  const [hasLoaded, setHasLoaded] = useState(priority === 'high');
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority === 'high' || hasLoaded) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasLoaded) {
            setIsVisible(true);
            // Use requestIdleCallback for better performance
            if ('requestIdleCallback' in window) {
              window.requestIdleCallback(() => {
                setHasLoaded(true);
              });
            } else {
              // Fallback for browsers without requestIdleCallback
              setTimeout(() => {
                setHasLoaded(true);
              }, 0);
            }
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin,
        threshold
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasLoaded, priority, rootMargin, threshold]);

  // Show loading skeleton while content loads
  const LoadingSkeleton = () => (
    <div className={`animate-pulse ${className}`} style={{ minHeight }}>
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div ref={sectionRef} className={className}>
      {hasLoaded ? (
        children
      ) : isVisible ? (
        fallback || <LoadingSkeleton />
      ) : (
        <div style={{ minHeight }} className="flex items-center justify-center">
          {fallback || <LoadingSkeleton />}
        </div>
      )}
    </div>
  );
};

export default DeferredSection;