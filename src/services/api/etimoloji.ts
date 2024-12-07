import { Word, Language } from '../../types';
import { APIError, fetchWithRetry } from './config';
import { getLanguageLocation } from '../../utils/languageUtils';

const ETIMOLOJI_API = 'https://raw.githubusercontent.com/btk/etimolojiturkce-api/master/words';

export async function searchEtimoloji(word: string, language: Language): Promise<Word | null> {
  try {
    const normalizedWord = word.toLowerCase().trim();
    const response = await fetchWithRetry(`${ETIMOLOJI_API}/${normalizedWord}.json`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new APIError(`HTTP error! status: ${response.status}`, response.status);
    }

    const data = await response.json();
    return transformEtimolojiResponse(data, language);
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    console.error('Error in searchEtimoloji:', error);
    return null;
  }
}

function transformEtimolojiResponse(data: any, language: Language): Word | null {
  if (!data || !data.word) {
    return null;
  }

  const etymology = [];
  let currentYear = 700;

  if (data.origin) {
    etymology.push({
      year: currentYear,
      language: data.origin.language?.toLowerCase() as Language || 'arabic',
      form: data.origin.word,
      originalScript: data.origin.originalScript,
      meaning: data.origin.meaning || '',
      location: getLanguageLocation(data.origin.language) || { lat: 0, lng: 0 }
    });
    currentYear += 200;
  }

  if (data.intermediate) {
    data.intermediate.forEach((stage: any) => {
      etymology.push({
        year: currentYear,
        language: stage.language?.toLowerCase() as Language || 'persian',
        form: stage.word,
        originalScript: stage.originalScript,
        meaning: stage.meaning || '',
        location: getLanguageLocation(stage.language) || { lat: 0, lng: 0 }
      });
      currentYear += 200;
    });
  }

  etymology.push({
    year: currentYear,
    language,
    form: data.word,
    meaning: Array.isArray(data.meanings) ? data.meanings[0] : data.meaning || '',
    location: getLanguageLocation(language) || { lat: 0, lng: 0 }
  });

  return {
    word: data.word,
    language,
    meaning: Array.isArray(data.meanings) ? data.meanings[0] : data.meaning || '',
    etymology,
    cognates: data.cognates?.map((cognate: any) => ({
      language: cognate.language || 'Unknown',
      word: cognate.word,
      originalScript: cognate.originalScript,
      meaning: cognate.meaning || '',
      location: getLanguageLocation(cognate.language) || { lat: 0, lng: 0 }
    })) || []
  };
}