import React from 'react';
import { Book, History, Languages } from 'lucide-react';
import { Word } from '../types';
import { languageInfo } from '../utils/languageUtils';

interface WordDetailsProps {
  word: Word;
}

export function WordDetails({ word }: WordDetailsProps) {
  if (!word || !word.etymology || word.etymology.length === 0) {
    return null;
  }

  // Find the original form (first etymology entry)
  const origin = word.etymology[0];
  const currentLanguageInfo = languageInfo[word.language];

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Current Word Section */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <Book className="text-blue-500" size={24} />
              <h2 className="text-3xl font-bold text-gray-900">{word.word}</h2>
              <span className="px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded-full">
                {currentLanguageInfo?.name || word.language}
              </span>
            </div>
            <p className="text-xl text-gray-700">{word.meaning}</p>
          </div>

          {/* Origin Information */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <History className="text-emerald-500" size={20} />
              <h3 className="text-sm font-medium text-gray-600">Origin</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">
                  {languageInfo[origin.language]?.name || origin.language}
                </span>
                <span className="text-sm text-gray-400">{origin.year} CE</span>
              </div>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-2xl font-medium text-gray-800">{origin.form}</span>
                {origin.originalScript && (
                  <span className="text-2xl font-arabic text-gray-600">
                    {origin.originalScript}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 italic">{origin.meaning}</p>
            </div>
          </div>
        </div>

        {/* Language Distribution */}
        {word.cognates && word.cognates.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Languages className="text-amber-500" size={20} />
              <h3 className="text-sm font-medium text-gray-600">Current Usage</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {word.cognates.map((cognate, index) => (
                <div
                  key={index}
                  className="px-3 py-1.5 bg-gray-50 rounded-full text-sm font-medium text-gray-700 border border-gray-100"
                >
                  {cognate.language}
                  {cognate.originalScript && (
                    <span className="ml-2 font-arabic text-gray-500">
                      {cognate.originalScript}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}