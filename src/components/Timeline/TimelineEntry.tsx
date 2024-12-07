import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRightCircle, Globe2 } from 'lucide-react';
import { Etymology } from '../../types';

interface TimelineEntryProps {
  entry: Etymology;
  index: number;
  isFirst: boolean;
  isLast: boolean;
}

export function TimelineEntry({ entry, index, isFirst, isLast }: TimelineEntryProps) {
  const getIcon = () => {
    if (isFirst) return <Globe2 className="text-emerald-600" size={24} />;
    if (isLast) return <BookOpen className="text-blue-600" size={24} />;
    return <ArrowRightCircle className="text-amber-600" size={24} />;
  };

  const getEvolutionText = () => {
    if (isFirst) {
      return `appeared as "${entry.form}" in ${entry.language}`;
    } else if (isLast) {
      return `adopted into ${entry.language} as "${entry.form}"`;
    } else {
      return `evolved in ${entry.language} as "${entry.form}"`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      className="mb-8 relative"
    >
      <div className="flex items-start gap-6">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center">
            {getIcon()}
          </div>
        </div>
        
        <div className="flex-1 bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-lg font-medium">
              {getEvolutionText()} - {entry.year}
            </span>
          </div>
          <p className="text-gray-600">
            Meaning: {entry.meaning}
          </p>
        </div>
      </div>
    </motion.div>
  );
}