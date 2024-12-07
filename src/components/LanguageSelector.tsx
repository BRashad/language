import React from 'react';
import { Globe2 } from 'lucide-react';
import { Language } from '../types';
import { languageInfo } from '../utils/languageUtils';

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export function LanguageSelector({ selectedLanguage, onLanguageChange }: LanguageSelectorProps) {
  const languageGroups = {
    'Oghuz Turkic': ['turkish', 'azerbaijani', 'turkmen'],
    'Karluk Turkic': ['uzbek', 'uyghur'],
    'Kipchak Turkic': ['kazakh', 'kyrgyz', 'tatar'],
    'Other': ['arabic', 'persian']
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Globe2 className="text-blue-500" size={20} />
        <h3 className="text-sm font-medium text-gray-700">Select Search Language</h3>
      </div>
      
      <div className="space-y-3">
        {Object.entries(languageGroups).map(([group, languages]) => (
          <div key={group} className="space-y-2">
            <div className="text-xs font-medium text-gray-500">{group}</div>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => {
                const info = languageInfo[lang];
                return (
                  <button
                    key={lang}
                    onClick={() => onLanguageChange(lang as Language)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                      ${selectedLanguage === lang
                        ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500 ring-offset-2'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {info.name}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}