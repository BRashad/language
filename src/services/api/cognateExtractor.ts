import { CheerioAPI } from 'cheerio';
import { Cognate } from '../../types';
import { getLanguageLocation } from '../../utils/languageUtils';

export function extractCognates($: CheerioAPI): Cognate[] {
  const cognates: Cognate[] = [];
  const cognateSections = $('.cognate, .derived, .related-terms, .etymology-derived');

  cognateSections.find('li').each((_, el) => {
    const $el = $(el);
    const text = $el.text();
    const match = text.match(/(\w+):\s+([^\s]+)(?:\s+\(([^)]+)\))?/);
    
    if (match) {
      const [, language, word, meaning] = match;
      const originalScript = $el.find('span[lang]').text() || undefined;
      
      cognates.push({
        language,
        word: word.trim(),
        originalScript,
        meaning: meaning?.trim() || '',
        location: getLanguageLocation(language.toLowerCase()) || { lat: 0, lng: 0 }
      });
    }
  });

  return cognates;
}