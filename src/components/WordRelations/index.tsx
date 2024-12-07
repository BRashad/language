import React from 'react';
import { Languages } from 'lucide-react';
import { LanguageGroups } from './LanguageGroups';
import { WordEvolutionGraph } from './WordEvolutionGraph';
import { WordSpreadMap } from './WordSpreadMap';
import { Cognate } from '../../types';

interface WordRelationsProps {
  cognates: Cognate[];
}

export function WordRelations({ cognates }: WordRelationsProps) {
  if (!cognates?.length) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Languages className="text-blue-500" size={24} />
            <h3 className="text-xl font-semibold text-gray-800">Word Evolution & Relations</h3>
          </div>
          <div className="text-sm text-gray-500">
            Found in {cognates.length} languages
          </div>
        </div>

        <WordEvolutionGraph cognates={cognates} />
        <WordSpreadMap cognates={cognates} />
        <LanguageGroups cognates={cognates} />

        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            The word "kitab" originated from Arabic (كتاب) and spread across various language families,
            particularly throughout the Islamic world and along historical trade routes. The visualization
            shows how the word maintained its core meaning while adapting to local pronunciations and writing systems.
          </p>
        </div>
      </div>
    </div>
  );
}