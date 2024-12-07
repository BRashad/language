import React from 'react';
import { History, ArrowRight, BookOpen, Globe2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Word } from '../../types';
import { languageInfo } from '../../utils/languageUtils';
import { EvolutionStage } from './EvolutionStage';
import { LanguageSpread } from './LanguageSpread';

interface WordEvolutionProps {
  word: Word;
}

export function WordEvolution({ word }: WordEvolutionProps) {
  const sortedEtymology = [...word.etymology].sort((a, b) => a.year - b.year);
  const origin = sortedEtymology[0];

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
            <div className="flex items-center gap-2 mb-2">
              <Globe2 className="text-emerald-600" size={20} />
              <span className="text-sm font-medium text-emerald-700">
                appeared as "{origin.form}" in {languageInfo[origin.language]?.name} - {origin.year}
              </span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="text-2xl font-medium text-gray-900">{origin.form}</span>
              {origin.originalScript && (
                <span className="text-2xl font-arabic text-gray-700 mr-2">
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
            <EvolutionStage
              key={index}
              entry={entry}
              index={index}
              isLast={index === sortedEtymology.length - 2}
            />
          ))}
        </div>

        {/* Language Spread */}
        <LanguageSpread etymology={sortedEtymology} />

        {/* Historical Context */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">Historical Context</h4>
          <p className="text-gray-600 text-sm leading-relaxed">
            The word "{word.word}" traces its origins to the {languageInfo[origin.language]?.name} word "{origin.form}"
            {origin.originalScript && ` (${origin.originalScript})`}, meaning "{origin.meaning}". 
            {origin.language === 'arabic' && ` Through historical trade routes and cultural exchange along the Silk Road,
            it was adopted into Persian and subsequently spread to various Turkic languages,
            adapting to local pronunciation patterns while preserving its core meaning.`}
          </p>
        </div>
      </div>
    </div>
  );
}