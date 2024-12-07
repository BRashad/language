import React from 'react';
import { Globe, Languages, ArrowRightLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Cognate } from '../types';

interface WordRelationsProps {
  cognates: Cognate[];
}

export function WordRelations({ cognates }: WordRelationsProps) {
  if (!cognates?.length) return null;

  const languageGroups = cognates.reduce((groups, cognate) => {
    const family = getLanguageFamily(cognate.language);
    if (!groups[family]) {
      groups[family] = [];
    }
    groups[family].push(cognate);
    return groups;
  }, {} as Record<string, Cognate[]>);

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Languages className="text-blue-500" size={24} />
            <h3 className="text-xl font-semibold text-gray-800">Related Words</h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Globe size={16} />
            <span>{cognates.length} variations found</span>
          </div>
        </div>

        {Object.entries(languageGroups).map(([family, familyCognates], groupIndex) => (
          <motion.div
            key={family}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.2 }}
            className="mb-6 last:mb-0"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px flex-grow bg-gray-200" />
              <h4 className="text-sm font-medium text-gray-600 px-3 py-1 bg-gray-100 rounded-full">
                {family}
              </h4>
              <div className="h-px flex-grow bg-gray-200" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {familyCognates.map((cognate, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (groupIndex * 0.2) + (index * 0.1) }}
                  className="relative group"
                >
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 transition-all duration-300 hover:shadow-md hover:border-blue-100">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-gray-900 text-lg">
                          {cognate.word}
                        </div>
                        {cognate.originalScript && (
                          <div className="text-xl text-gray-600 font-arabic mt-1">
                            {cognate.originalScript}
                          </div>
                        )}
                      </div>
                      <ArrowRightLeft className="text-gray-400 group-hover:text-blue-500 transition-colors" size={16} />
                    </div>
                    <div className="mt-2">
                      <div className="text-sm font-medium text-gray-700">
                        {cognate.language}
                      </div>
                      {cognate.meaning && (
                        <div className="text-sm text-gray-500 mt-1 italic">
                          {cognate.meaning}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            These words share common origins or have evolved from similar roots across different language families.
            The relationships shown here are based on etymological research and linguistic studies.
          </p>
        </div>
      </div>
    </div>
  );
}

function getLanguageFamily(language: string): string {
  const languageFamilies: Record<string, string> = {
    turkish: 'Oghuz Turkic',
    azerbaijani: 'Oghuz Turkic',
    turkmen: 'Oghuz Turkic',
    uzbek: 'Karluk Turkic',
    uyghur: 'Karluk Turkic',
    kazakh: 'Kipchak Turkic',
    kyrgyz: 'Kipchak Turkic',
    tatar: 'Kipchak Turkic',
    arabic: 'Semitic',
    persian: 'Iranian',
    russian: 'Slavic',
    mongolian: 'Mongolic'
  };

  return languageFamilies[language.toLowerCase()] || 'Other Languages';
}