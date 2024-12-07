import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowRightCircle, BookOpen } from 'lucide-react';
import { Etymology } from '../../types';
import { languageInfo } from '../../utils/languageUtils';

interface EvolutionStageProps {
  entry: Etymology;
  index: number;
  isLast: boolean;
}

export function EvolutionStage({ entry, index, isLast }: EvolutionStageProps) {
  const Icon = isLast ? BookOpen : ArrowRightCircle;
  const iconColor = isLast ? 'text-blue-600' : 'text-amber-600';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.2 }}
      className="relative pl-16 pb-8 last:pb-0"
    >
      <div className="absolute left-4 top-3 w-4 h-4 rounded-full bg-white border-2 border-blue-500" />
      <ArrowRight className="absolute left-8 top-3 text-blue-400" size={20} />
      
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <Icon className={iconColor} size={20} />
          <span className="text-sm font-medium text-gray-700">
            {`adopted into ${languageInfo[entry.language]?.name} - ${entry.year}`}
          </span>
        </div>
        <div className="flex items-baseline gap-4">
          <span className="text-xl font-medium text-gray-800">{entry.form}</span>
          {entry.originalScript && (
            <span className="text-xl font-arabic text-gray-600">
              {entry.originalScript}
            </span>
          )}
        </div>
        {entry.meaning && (
          <p className="mt-2 text-sm text-gray-600 italic">{entry.meaning}</p>
        )}
      </div>
    </motion.div>
  );
}