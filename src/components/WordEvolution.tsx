import React from 'react';
import { History, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Word } from '../types';
import { languageInfo } from '../utils/languageUtils';

interface WordEvolutionProps {
  word: Word;
}

export function WordEvolution({ word }: WordEvolutionProps) {
  if (!word || !word.etymology || word.etymology.length === 0) {
    return null;
  }

  const sortedEtymology = [...word.etymology].sort((a, b) => a.year - b.year);
  const origin = sortedEtymology[0];

  if (!origin || !origin.language) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-6">
          <History className="text-blue-500" size={24} />
          <h3 className="text-xl font-semibold text-gray-800">Word Evolution</h3>
        </div>

        {/* Origin Card */}
        <div className="mb-8">
          <div className="text-sm font-medium text-gray-500 mb-2">Root Origin</div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-50 rounded-lg p-4 border border-emerald-100"
          >
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-sm font-medium text-emerald-700">
                {languageInfo[origin.language]?.name || origin.language}
              </span>
              <span className="text-sm text-emerald-600">{origin.year} CE</span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="text-2xl font-medium text-gray-900">{origin.form}</span>
              {origin.originalScript && (
                <span className="text-2xl font-arabic text-gray-700">
                  {origin.originalScript}
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-emerald-600 italic">{origin.meaning}</p>
          </motion.div>
        </div>

        {/* Evolution Timeline */}
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-blue-100" />
          
          {sortedEtymology.slice(1).map((entry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="relative pl-16 pb-8 last:pb-0"
            >
              <div className="absolute left-4 top-3 w-4 h-4 rounded-full bg-white border-2 border-blue-500" />
              <ArrowRight className="absolute left-8 top-3 text-blue-400" size={20} />
              
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {`adopted into ${languageInfo[entry.language]?.name || entry.language}`}
                  </span>
                  <span className="text-sm text-gray-500">{entry.year}</span>
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
          ))}
        </div>
      </div>
    </div>
  );
}