import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { LanguageSelector } from './components/LanguageSelector';
import { WordDetails } from './components/WordDetails';
import { WordEvolution } from './components/WordEvolution';
import { Map } from './components/Map';
import { WordRelations } from './components/WordRelations';
import { findWord } from './services/wordService';
import { Word, Language } from './types';

export function App() {
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('turkish');

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError(null);
    setSelectedWord(null);

    try {
      const result = await findWord(searchTerm, selectedLanguage);
      if (result) {
        setSelectedWord(result);
      } else {
        setError(`No results found for "${searchTerm}" in ${selectedLanguage}. Try another word.`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while searching.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Search size={32} className="text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-900">Turkic Etymology Explorer</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center">
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
          />
          
          <SearchBar onSearch={handleSearch} />
          
          {loading && (
            <div className="mt-4 text-gray-600">
              Searching...
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          {selectedWord && !loading && !error && (
            <div className="w-full space-y-8">
              <WordDetails word={selectedWord} />
              <WordEvolution word={selectedWord} />
              {selectedWord.etymology && selectedWord.etymology.length > 0 && (
                <Map etymology={selectedWord.etymology} />
              )}
              {selectedWord.cognates && selectedWord.cognates.length > 0 && (
                <WordRelations cognates={selectedWord.cognates} />
              )}
            </div>
          )}
          
          {!selectedWord && !error && !loading && (
            <div className="mt-16 text-center">
              <h2 className="text-2xl font-semibold text-gray-700">
                Search for a word to explore its etymology
              </h2>
              <p className="mt-2 text-gray-500">
                Try searching for words like: kitab, dəniz, çörək
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}