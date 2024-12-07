import { Word, Language } from '../../types';
import { API_CONFIG, APIError, fetchWithRetry } from './config';
import { getLanguageLocation } from '../../utils/languageUtils';

export async function searchWiktionary(word: string, language: Language): Promise<Word | null> {
  try {
    const params = new URLSearchParams({
      action: 'query',
      format: 'json',
      titles: word,
      prop: 'extracts|pageprops',
      exintro: '1',
      explaintext: '1',
      redirects: '1',
      origin: '*'
    });

    const response = await fetchWithRetry(`${API_CONFIG.WIKTIONARY_API}?${params}`);
    const data = await response.json();

    if (data.error) {
      throw new APIError('Wiktionary API error', undefined, data.error.code);
    }

    const pages = data.query?.pages;
    if (!pages) return null;

    const pageId = Object.keys(pages)[0];
    if (pageId === '-1') return null; // Page not found

    const page = pages[pageId];
    return transformWiktionaryResponse(page, word, language);
  } catch (error) {
    console.error('Error in searchWiktionary:', error);
    return null;
  }
}

function transformWiktionaryResponse(page: any, word: string, language: Language): Word | null {
  try {
    const extract = page.extract || '';
    const sections = extract.split('\n\n');
    
    // Find relevant language section
    const languageSection = sections.find(section => 
      section.toLowerCase().includes(language) ||
      section.toLowerCase().includes('etymology')
    );

    if (!languageSection) return null;

    // Extract meaning
    const meaning = extractMeaning(languageSection);
    if (!meaning) return null;

    // Create etymology entries
    const etymology = extractEtymology(languageSection, language);

    return {
      word,
      language,
      meaning,
      etymology,
      cognates: extractCognates(languageSection)
    };
  } catch (error) {
    console.error('Error transforming Wiktionary response:', error);
    return null;
  }
}

function extractMeaning(text: string): string {
  const meaningMatch = text.match(/(?:^|\n)([^.]+\.)/);
  return meaningMatch ? meaningMatch[1].trim() : '';
}

function extractEtymology(text: string, language: Language): Word['etymology'] {
  const etymology: Word['etymology'] = [];
  const matches = text.match(/From ([^.]+)\./);

  if (matches) {
    const [, etymologyText] = matches;
    const parts = etymologyText.split(/,\s*/);

    parts.forEach((part, index) => {
      const wordMatch = part.match(/(\w+)\s+["']([^"']+)["']/);
      if (wordMatch) {
        const [, sourceLang, form] = wordMatch;
        etymology.push({
          year: 1000 - (parts.length - index) * 100,
          language: sourceLang.toLowerCase() as Language,
          form,
          meaning: '',
          location: getLanguageLocation(sourceLang.toLowerCase()) || { lat: 0, lng: 0 }
        });
      }
    });
  }

  // Add current form
  etymology.push({
    year: 1000,
    language,
    form: text.split('\n')[0].split(' ')[0],
    meaning: extractMeaning(text),
    location: getLanguageLocation(language) || { lat: 0, lng: 0 }
  });

  return etymology;
}

function extractCognates(text: string): Word['cognates'] {
  const cognates: Word['cognates'] = [];
  const cognateSection = text.match(/(?:Cognates?|Related terms?):[^\n]+/);

  if (cognateSection) {
    const matches = cognateSection[0].matchAll(/(\w+)\s+["']([^"']+)["']/g);
    for (const match of matches) {
      const [, language, word] = match;
      cognates.push({
        language,
        word,
        meaning: '',
        location: getLanguageLocation(language.toLowerCase()) || { lat: 0, lng: 0 }
      });
    }
  }

  return cognates;
}