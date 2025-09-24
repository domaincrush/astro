import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, SupportedLanguage } from '../i18n/translations';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '../i18n/languages';
import { TranslationKeys } from '../i18n/translations/en';

interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (keyPath: string, fallback?: string) => string;
  supportedLanguages: typeof SUPPORTED_LANGUAGES;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

// Map URL paths to language codes
const urlToLanguageMap: { [key: string]: SupportedLanguage } = {
  'hindi': 'hi',
  'tamil': 'ta', 
  'telugu': 'te'
};

// Map language codes to URL paths
const languageToUrlMap: { [key in SupportedLanguage]: string } = {
  'en': '',
  'hi': 'hindi',
  'ta': 'tamil',
  'te': 'telugu'
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(() => {
    // Safe initialization - check if window exists
    if (typeof window === 'undefined') {
      return DEFAULT_LANGUAGE as SupportedLanguage;
    }
    
    try {
      // Check URL path first (e.g., /hindi, /hindi/kundli)
      const pathSegments = window.location.pathname.split('/').filter(Boolean);
      const urlLangPath = pathSegments[0];
      
      if (urlLangPath && urlToLanguageMap[urlLangPath]) {
        return urlToLanguageMap[urlLangPath];
      }
      
      // Check localStorage
      const savedLang = localStorage.getItem('astrotick-language') as SupportedLanguage;
      if (savedLang && Object.keys(translations).includes(savedLang)) {
        return savedLang;
      }
      
      // Check browser language
      const browserLang = navigator.language.split('-')[0] as SupportedLanguage;
      if (Object.keys(translations).includes(browserLang)) {
        return browserLang;
      }
    } catch (error) {
      console.warn('Language initialization error:', error);
    }
    
    return DEFAULT_LANGUAGE as SupportedLanguage;
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setCurrentLanguage(lang);
    
    if (typeof window === 'undefined') {
      return;
    }
    
    try {
      localStorage.setItem('astrotick-language', lang);
      
      // Navigate to language-specific URL
      const currentPath = window.location.pathname;
      const pathSegments = currentPath.split('/').filter(Boolean);
      
      // Remove existing language prefix if present
      if (pathSegments[0] && urlToLanguageMap[pathSegments[0]]) {
        pathSegments.shift();
      }
      
      // Determine new path based on selected language
      let newPath = '/';
      const urlPath = languageToUrlMap[lang];
      
      if (lang === 'en') {
        // English uses default routes without language prefix
        if (pathSegments.length > 0) {
          newPath = `/${pathSegments.join('/')}`;
        }
      } else {
        // Other languages use prefixed routes
        newPath = `/${urlPath}`;
        
        // Map common page paths to Hindi equivalents
        if (pathSegments.length > 0) {
          const pagePath = pathSegments[0];
          
          // If switching to Hindi, route to appropriate Hindi pages
          if (lang === 'hi') {
            switch (pagePath) {
              case 'astrologers':
              case 'kundli':
              case 'panchang':
                newPath = `/hindi/${pagePath}`;
                break;
              case '':
              case 'home':
                newPath = '/hindi';
                break;
              default:
                // For other pages, try to append after language prefix
                newPath = `/hindi/${pathSegments.join('/')}`;
            }
          } else {
            // For Tamil/Telugu, add all paths
            newPath += `/${pathSegments.join('/')}`;
          }
        }
      }
      
      if (import.meta.env.DEV) {
        console.log(`🌐 Language switching: ${currentLanguage} → ${lang}, Path: ${currentPath} → ${newPath}`);
      }
      window.location.href = newPath;
    } catch (error) {
      console.warn('Language setting error:', error);
    }
  };

  // Update language when URL path changes
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    
    const handlePopState = () => {
      try {
        const pathSegments = window.location.pathname.split('/').filter(Boolean);
        const urlLangPath = pathSegments[0];
        
        if (urlLangPath && urlToLanguageMap[urlLangPath]) {
          setCurrentLanguage(urlToLanguageMap[urlLangPath]);
        } else {
          setCurrentLanguage('en' as SupportedLanguage);
        }
      } catch (error) {
        console.warn('PopState language handling error:', error);
      }
    };

    // Also check URL on mount and path changes
    const checkUrlLanguage = () => {
      try {
        const pathSegments = window.location.pathname.split('/').filter(Boolean);
        const urlLangPath = pathSegments[0];
        
        if (urlLangPath && urlToLanguageMap[urlLangPath]) {
          const detectedLang = urlToLanguageMap[urlLangPath];
          if (detectedLang !== currentLanguage) {
            if (import.meta.env.DEV) {
              console.log('Language detected from URL:', detectedLang, 'Path:', window.location.pathname);
            }
            setCurrentLanguage(detectedLang);
          }
        } else if (currentLanguage !== 'en') {
          // Suppress logging for standard paths without language prefixes
          setCurrentLanguage('en' as SupportedLanguage);
        }
      } catch (error) {
        console.warn('URL language checking error:', error);
      }
    };

    // Check immediately
    checkUrlLanguage();
    
    // Listen for URL changes
    window.addEventListener('popstate', handlePopState);
    
    // Also listen for pushstate/replacestate changes (for SPA navigation)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      setTimeout(checkUrlLanguage, 0);
    };
    
    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      setTimeout(checkUrlLanguage, 0);
    };

    return () => {
      window.removeEventListener('popstate', handlePopState);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, [currentLanguage]);

  // Create t function that accepts key path and fallback
  const t = (keyPath: string, fallback: string = '') => {
    const keys = keyPath.split('.');
    let value: any = translations[currentLanguage];
    
    for (const key of keys) {
      value = value?.[key];
    }
    
    // Only log translations in development mode
    if (import.meta.env.DEV && import.meta.env.VITE_DEBUG_TRANSLATIONS === 'true') {
      console.log(`🔤 Translation: ${keyPath} (${currentLanguage}) -> ${value || fallback}`);
    }
    
    return value || fallback;
  };

  const value: LanguageContextType = {
    currentLanguage,
    setLanguage,
    t,
    supportedLanguages: SUPPORTED_LANGUAGES
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Track if we're in development mode for debugging
const isDev = import.meta.env.DEV;

// Singleton fallback context to avoid recreating on each call
const fallbackContext: LanguageContextType = {
  currentLanguage: 'en',
  setLanguage: () => {},
  t: (key: string, fallback?: string) => fallback || key,
  supportedLanguages: SUPPORTED_LANGUAGES
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    // During initial mount or when used outside provider, return fallback silently
    // This is expected behavior during React's render phase
    return fallbackContext;
  }
  return context;
};