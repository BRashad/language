import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightLeft } from 'lucide-react';
import { Cognate } from '../../types';
import { getLanguageFamily } from '../../utils/languageUtils';

interface LanguageGroupsProps {
  cognates: Cognate[];
}

export function LanguageGroups({ cognates }: LanguageGroupsProps) {
  const languageGroups = cognates.reduce((groups, cognate) => {
    const family = getLanguageFamily(cognate.language);
    if (!groups[family]) {
      groups[family] = [];
    }
    groups[family].push(cognate);
    return groups;
  }, {} as Record<string, Cognate[]>);

  return (
    <div className="mt-8">
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
    </div>
  );
}