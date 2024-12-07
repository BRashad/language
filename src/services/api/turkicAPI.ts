import { Word } from '../../types';
import { API_CONFIG, APIError, fetchWithRetry } from './config';
import { getLanguageLocation } from '../../utils/languageUtils';

export async function searchTurkicDB(word: string): Promise<Word | null> {
  try {
    const encodedWord = encodeURIComponent(word.trim().toLowerCase());
    const apiUrl = `${API_CONFIG.TURKIC_DB_URL}/${encodedWord}`;

    const response = await fetchWithRetry(apiUrl);
    const text = await response.text();

    try {
      const data = JSON.parse(text);
      if (!data || data.error) {
        console.error('TurkicDB API error:', data?.error || 'No data returned');
        return null;
      }
      return transformApiResponse(data);
    } catch (parseError) {
      // If JSON parsing fails, try parsing HTML response
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      return parseHtmlResponse(doc, word);
    }
  } catch (error) {
    if (error instanceof APIError) {
      if (error.status === 404) {
        return null; // Word not found
      }
      throw error;
    }
    console.error('Error fetching from TurkicDB:', error);
    return null;
  }
}

function parseHtmlResponse(doc: Document, searchWord: string): Word | null {
  try {
    const meaningEl = doc.querySelector('.meaning, .definition');
    const etymologyEl = doc.querySelector('.etymology');
    
    if (!meaningEl) return null;

    const meaning = meaningEl.textContent?.trim() || '';
    const etymology = etymologyEl ? parseEtymologyHtml(etymologyEl) : [];

    return {
      word: searchWord,
      language: detectLanguage(searchWord),
      meaning,
      etymology,
      cognates: []
    };
  } catch (error) {
    console.error('Error parsing HTML response:', error);
    return null;
  }
}

function parseEtymologyHtml(element: Element): Word['etymology'] {
  const entries: Word['etymology'] = [];
  const items = element.querySelectorAll('li, p');

  items.forEach((item, index) => {
    const text = item.textContent || '';
    const matches = {
      language: extractLanguage(text),
      form: extractWord(text),
      originalScript: extractOriginalScript(text),
      meaning: extractMeaning(text)
    };

    if (matches.language && matches.form) {
      entries.push({
        year: 1000 + (index * 100), // Approximate year
        language: matches.language,
        form: matches.form,
        originalScript: matches.originalScript,
        meaning: matches.meaning,
        location: getLanguageLocation(matches.language) || { lat: 0, lng: 0 }
      });
    }
  });

  return entries;
}

function transformApiResponse(data: any): Word | null {
  try {
    if (!data.word) {
      return null;
    }

    return {
      word: data.word,
      language: detectLanguage(data.word),
      meaning: Array.isArray(data.meanings) ? data.meanings[0] : data.meaning || '',
      etymology: transformEtymology(data.etymology || []),
      cognates: transformCognates(data.cognates || [])
    };
  } catch (error) {
    console.error('Error transforming API response:', error);
    return null;
  }
}

function detectLanguage(word: string): Word['language'] {
  // Simple script-based detection
  if (/[\u0600-\u06FF]/.test(word)) return 'arabic';
  if (/[\u0400-\u04FF]/.test(word)) return 'kazakh';
  return 'turkish'; // Default to Turkish
}

function extractLanguage(text: string): Word['language'] {
  const languagePattern = /(Arabic|Persian|Turkish|Azerbaijani|Uzbek|Kazakh|Kyrgyz|Turkmen|Uyghur|Tatar)/i;
  const match = text.match(languagePattern);
  return (match ? match[1].toLowerCase() : 'turkish') as Word['language'];
}

function extractWord(text: string): string {
  const wordMatch = text.match(/["']([^"']+)["']/);
  return wordMatch ? wordMatch[1] : text.split(/[,\s]/)[0];
}

function extractOriginalScript(text: string): string | undefined {
  const scriptMatch = text.match(/[\u0600-\u06FF\u0750-\u077F\u0870-\u089F\u08A0-\u08FF]+/);
  return scriptMatch ? scriptMatch[0] : undefined;
}

function extractMeaning(text: string): string {
  const meaningMatch = text.match(/["']([^"']+)["']/g);
  return meaningMatch ? meaningMatch[meaningMatch.length - 1].replace(/['"]/g, '') : '';
}

function transformEtymology(etymology: any[]): Word['etymology'] {
  if (!Array.isArray(etymology)) return [];

  return etymology
    .filter(entry => entry && (entry.word || entry.form))
    .map((entry, index) => ({
      year: entry.year || 1000 + (index * 100),
      language: entry.language?.toLowerCase() || 'turkish',
      form: entry.word || entry.form,
      originalScript: entry.originalScript,
      meaning: entry.meaning || '',
      location: getLanguageLocation(entry.language) || { lat: 0, lng: 0 }
    }));
}

function transformCognates(cognates: any[]): Word['cognates'] {
  if (!Array.isArray(cognates)) return [];

  return cognates
    .filter(cognate => cognate && (cognate.word || cognate.form))
    .map(cognate => ({
      language: cognate.language || 'Unknown',
      word: cognate.word || cognate.form,
      originalScript: cognate.originalScript,
      meaning: cognate.meaning || '',
      location: getLanguageLocation(cognate.language) || { lat: 0, lng: 0 }
    }));
}