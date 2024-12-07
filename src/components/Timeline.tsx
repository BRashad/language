import React from 'react';
import { motion } from 'framer-motion';
import { Globe2, ArrowRightCircle, BookOpen, History } from 'lucide-react';
import { Etymology } from '../types';

interface TimelineProps {
  etymology: Etymology[];
}

export function Timeline({ etymology }: TimelineProps) {
  const sortedEtymology = [...etymology].sort((a, b) => a.year - b.year);

  return (
    <div className="w-full max-w-4xl mx-auto mt-12">
      <div className="flex items-center justify-center gap-3 mb-8">
        <History className="text-blue-600" size={28} />
        <h3 className="text-2xl font-semibold text-gray-800">Word Evolution Timeline</h3>
      </div>

      <div className="relative">
        {/* Timeline connector line */}
        <div className="absolute left-[2.25rem] top-8 bottom-8 w-0.5 bg-gradient-to-b from-blue-500 via-blue-400 to-blue-300" />

        {sortedEtymology.map((entry, index) => {
          const isFirst = index === 0;
          const isLast = index === sortedEtymology.length - 1;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="relative mb-12 last:mb-0"
            >
              <div className="flex items-start gap-6">
                {/* Icon container */}
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center">
                    {isFirst ? (
                      <Globe2 className="text-emerald-600" size={28} />
                    ) : isLast ? (
                      <BookOpen className="text-blue-600" size={28} />
                    ) : (
                      <ArrowRightCircle className="text-amber-600" size={28} />
                    )}
                  </div>
                </div>

                {/* Content container */}
                <div className="flex-1 bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="text-lg font-medium text-gray-800">
                    {isFirst
                      ? `appeared as "${entry.form}"${entry.originalScript ? ` (${entry.originalScript})` : ''} in ${entry.language} - ${entry.year}`
                      : isLast
                      ? `adopted into ${entry.language} as "${entry.form}" - ${entry.year}`
                      : `evolved in ${entry.language} as "${entry.form}" - ${entry.year}`}
                  </div>
                  {entry.originalScript && (
                    <div className="mt-2 text-2xl font-arabic text-gray-700 text-right">
                      {entry.originalScript}
                    </div>
                  )}
                  <p className="mt-2 text-gray-600">
                    Meaning: {entry.meaning}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}