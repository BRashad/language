import { Word, Language } from '../types';
import { searchWiktionary } from './api/wiktionaryAPI';
import { findMockWord } from './mockData';

export async function findWord(searchTerm: string, language: Language): Promise<Word | null> {
  const normalizedSearch = searchTerm.toLowerCase().trim();

  try {
    // Try Wiktionary first
    const wiktionaryResult = await searchWiktionary(normalizedSearch, language);
    if (wiktionaryResult && wiktionaryResult.meaning !== 'Meaning not available') {
      return wiktionaryResult;
    }

    // Fallback to mock data
    const mockResult = findMockWord(normalizedSearch);
    if (mockResult) {
      return {
        ...mockResult,
        language // Ensure we use the selected language
      };
    }

    throw new Error(`No results found for "${searchTerm}" in ${language}. Try another word.`);
  } catch (error) {
    console.error('Error in findWord:', error);
    
    // Final attempt with mock data
    const mockResult = findMockWord(normalizedSearch);
    if (mockResult) {
      return {
        ...mockResult,
        language
      };
    }
    
    throw error;
  }
}