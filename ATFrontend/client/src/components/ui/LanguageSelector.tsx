import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Globe, ChevronDown } from 'lucide-react';

const LanguageSelector: React.FC = () => {
  const { currentLanguage, setLanguage, supportedLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  
  // Debug current language
  console.log('LanguageSelector - Current language:', currentLanguage, 'Path:', window.location.pathname);
  
  // Force component re-render when language changes
  useEffect(() => {
    console.log('Language changed to:', currentLanguage);
  }, [currentLanguage]);

  const currentLang = supportedLanguages.find(lang => lang.code === currentLanguage);
  
  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 bg-white"
      >
        <Globe className="w-4 h-4 text-gray-600" />
        <span className="hidden sm:inline text-sm font-medium text-gray-700">
          {currentLang?.nativeName || 'English'}
        </span>
        <span className="text-lg">
          {currentLang?.flag || '🇺🇸'}
        </span>
        <ChevronDown className="w-3 h-3 text-gray-500" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="py-1">
            {supportedLanguages.map((language) => (
              <button
                key={language.code}
                onClick={() => {
                  setLanguage(language.code as any);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-3 ${
                  currentLanguage === language.code 
                    ? 'bg-orange-50 text-orange-600' 
                    : 'text-gray-700'
                }`}
              >
                <span className="text-lg">{language.flag}</span>
                <div>
                  <div className="font-medium">{language.nativeName}</div>
                  <div className="text-xs text-gray-500">{language.name}</div>
                </div>
                {currentLanguage === language.code && (
                  <div className="ml-auto w-2 h-2 bg-orange-500 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default LanguageSelector;