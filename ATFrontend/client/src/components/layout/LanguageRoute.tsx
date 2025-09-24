import { useEffect } from 'react';
import { useLanguage } from 'src/contexts/LanguageContext';

interface LanguageRouteProps {
  language: 'hi' | 'ta' | 'te' | 'en';
  children: React.ReactNode;
}

export default function LanguageRoute({ language, children }: LanguageRouteProps) {
  const { currentLanguage, setLanguage } = useLanguage();

  useEffect(() => {
    // Force language change when route mounts
    if (currentLanguage !== language) {
      console.log(`🌐 LanguageRoute: Forcing language change from ${currentLanguage} to ${language}`);
      setLanguage(language);
    }
  }, [language, currentLanguage, setLanguage]);

  return <>{children}</>;
}