import { searchWiktionary } from './wiktionaryAPI';
import { Word, Language } from '../../types';
import { APIError } from './config';
import { findMockWord } from '../mockData';

export async function searchWord(term: string, language: Language): Promise<Word | null> {
  try {
    // Try Wiktionary API first
    let result = await searchWiktionary(term, language);
    if (result) {
      return result;
    }

    // Use mock data as fallback for development/testing
    result = findMockWord(term);
    if (result) {
      return {
        ...result,
        language // Ensure we use the selected language
      };
    }

    throw new Error(`No results found for "${term}" in ${language}. Try another word.`);
  } catch (error) {
    console.error('Error in searchWord:', error);
    if (error instanceof APIError) {
      throw error;
    }
    throw error;
  }
}

export * from './config';