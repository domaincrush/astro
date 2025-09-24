
// Performance monitoring for images
export class ImagePerformanceMonitor {
  private static instance: ImagePerformanceMonitor;
  private metrics: Map<string, any> = new Map();

  static getInstance(): ImagePerformanceMonitor {
    if (!ImagePerformanceMonitor.instance) {
      ImagePerformanceMonitor.instance = new ImagePerformanceMonitor();
    }
    return ImagePerformanceMonitor.instance;
  }

  trackImageLoad(src: string, loadTime: number, size: number) {
    this.metrics.set(src, {
      loadTime,
      size,
      timestamp: Date.now(),
      type: src.includes('.webp') ? 'webp' : 'original'
    });
    
    // Send to analytics if needed
    if (typeof gtag !== 'undefined') {
      gtag('event', 'image_performance', {
        custom_parameter_image_src: src,
        custom_parameter_load_time: loadTime,
        custom_parameter_file_size: size
      });
    }
  }

  getLighthouseMetrics() {
    const metrics = Array.from(this.metrics.values());
    return {
      totalImages: metrics.length,
      avgLoadTime: metrics.reduce((sum, m) => sum + m.loadTime, 0) / metrics.length,
      totalSize: metrics.reduce((sum, m) => sum + m.size, 0),
      webpPercentage: (metrics.filter(m => m.type === 'webp').length / metrics.length) * 100
    };
  }
}
