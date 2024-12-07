import React from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { Etymology } from '../../types';
import { languageInfo } from '../../utils/languageUtils';

interface LanguageSpreadProps {
  etymology: Etymology[];
}

export function LanguageSpread({ etymology }: LanguageSpreadProps) {
  return (
    <div className="mt-8 pt-6 border-t border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="text-blue-500" size={20} />
        <h4 className="text-lg font-semibold text-gray-800">Language Spread</h4>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {etymology.map((entry, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
          >
            <div className="mt-1">
              <div className={`w-3 h-3 rounded-full ${
                index === 0 ? 'bg-emerald-500' :
                index === etymology.length - 1 ? 'bg-blue-500' :
                'bg-amber-500'
              }`} />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-800">
                {languageInfo[entry.language]?.name}
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-base text-gray-700">{entry.form}</span>
                {entry.originalScript && (
                  <span className="text-base font-arabic text-gray-600">
                    {entry.originalScript}
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {entry.year} CE
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}