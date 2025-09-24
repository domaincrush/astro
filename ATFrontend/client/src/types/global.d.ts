// Global type declarations for external libraries and analytics tools

interface Window {
  // Google Analytics
  gtag: (...args: any[]) => void;
  dataLayer: any[];
  
  // Microsoft Clarity
  clarity: (action: string, eventName?: string, data?: any) => void;
  
  // Google Tag Manager
  google_tag_manager?: any;
}

// Extend global gtag function
declare function gtag(...args: any[]): void;

// Microsoft Clarity global functions
declare namespace clarity {
  function start(options?: any): void;
  function consent(): void;
  function identify(userId: string, userProperties?: Record<string, any>): void;
  function set(key: string, value: any): void;
  function event(eventName: string, properties?: Record<string, any>): void;
  function upgrade(reason?: string): void;
}