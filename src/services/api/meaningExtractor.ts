import { cheerio } from 'cheerio';
import { Language } from '../../types';
import { languageInfo } from '../../utils/languageUtils';

export function extractMeaning($: cheerio.CheerioAPI, language: Language): string {
  // Try language-specific section first
  const langName = languageInfo[language]?.name || language;
  const langSection = $(`#${langName}, .${language}, h2:contains("${langName}")`).next();
  
  if (langSection.length) {
    // Try different meaning selectors in order of preference
    const meaningSelectors = [
      'ol > li:first-child',
      '.definition',
      '.meaning',
      '.gloss',
      'p:first-of-type'
    ];

    for (const selector of meaningSelectors) {
      const meaning = langSection.find(selector).first().text().trim();
      if (meaning && !meaning.includes('Etymology') && !meaning.includes('Pronunciation')) {
        return cleanMeaning(meaning);
      }
    }
  }

  // Fallback to general definition search
  const definitionSelectors = [
    '#Noun ol > li:first-child',
    '#Verb ol > li:first-child',
    '#Adjective ol > li:first-child',
    '.definition:first',
    '.meaning:first',
    'ol > li:first-child'
  ];

  for (const selector of definitionSelectors) {
    const meaning = $(selector).first().text().trim();
    if (meaning && !meaning.includes('Etymology') && !meaning.includes('Pronunciation')) {
      return cleanMeaning(meaning);
    }
  }

  return '';
}

function cleanMeaning(meaning: string): string {
  return meaning
    .replace(/^\d+\.\s*/, '') // Remove leading numbers
    .replace(/\([^)]+\)/g, '') // Remove parenthetical notes
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}