import { CheerioAPI } from 'cheerio';
import { Word, Language, Etymology } from '../../types';
import { getLanguageLocation } from '../../utils/languageUtils';
import { extractMeaning } from './meaningExtractor';

interface LanguageMatch {
  language: Language;
  form: string;
  originalScript?: string;
  meaning: string;
  year: number;
}

export function extractEtymology($: CheerioAPI, word: string, language: Language): Etymology[] {
  const etymology: Etymology[] = [];
  const etymologySection = $('.etymology, .derivation, .borrowed');
  
  if (!etymologySection.length) {
    return [createCurrentForm($, word, language)];
  }

  const text = etymologySection.text();
  const html = etymologySection.html() || '';

  // Extract Arabic origins
  const arabicMatch = extractArabicOrigin(text, html);
  if (arabicMatch) {
    etymology.push(createEtymologyEntry(arabicMatch));
  }

  // Extract Persian intermediary
  const persianMatch = extractPersianIntermediary(text, html);
  if (persianMatch) {
    etymology.push(createEtymologyEntry(persianMatch));
  }

  // Extract Turkic intermediaries
  const turkicMatches = extractTurkicIntermediaries(text, html);
  turkicMatches.forEach(match => {
    etymology.push(createEtymologyEntry(match));
  });

  // Add current form
  etymology.push(createCurrentForm($, word, language));

  return etymology;
}

function extractArabicOrigin(text: string, html: string): LanguageMatch | null {
  const arabicMatch = text.match(/from Arabic (?:([^\s,]+)|[^\s,]+ \(([^\)]+)\))/i);
  if (!arabicMatch) return null;

  const arabicScript = html.match(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+/);
  const meaning = extractLanguageMeaning(text, 'Arabic');

  return {
    language: 'arabic',
    form: arabicMatch[1] || arabicMatch[2],
    originalScript: arabicScript ? arabicScript[0] : undefined,
    meaning,
    year: 650 // Approximate year for Classical Arabic period
  };
}

function extractPersianIntermediary(text: string, html: string): LanguageMatch | null {
  const persianMatch = text.match(/from Persian (?:([^\s,]+)|[^\s,]+ \(([^\)]+)\))/i);
  if (!persianMatch) return null;

  const persianScript = html.match(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+/);
  const meaning = extractLanguageMeaning(text, 'Persian');

  return {
    language: 'persian',
    form: persianMatch[1] || persianMatch[2],
    originalScript: persianScript ? persianScript[0] : undefined,
    meaning,
    year: 800 // Approximate year for Classical Persian period
  };
}

function extractTurkicIntermediaries(text: string, html: string): LanguageMatch[] {
  const matches: LanguageMatch[] = [];
  const turkicLanguages = ['Ottoman Turkish', 'Old Turkic', 'Chagatai'];
  
  turkicLanguages.forEach((lang, index) => {
    const regex = new RegExp(`from ${lang} (?:([^\\s,]+)|[^\\s,]+ \\(([^\\)]+)\\))`, 'i');
    const match = text.match(regex);
    
    if (match) {
      const script = html.match(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+/);
      matches.push({
        language: 'turkish',
        form: match[1] || match[2],
        originalScript: script ? script[0] : undefined,
        meaning: extractLanguageMeaning(text, lang),
        year: 900 + (index * 100) // Approximate historical dating
      });
    }
  });

  return matches;
}

function createEtymologyEntry(match: LanguageMatch): Etymology {
  return {
    year: match.year,
    language: match.language,
    form: match.form,
    originalScript: match.originalScript,
    meaning: match.meaning,
    location: getLanguageLocation(match.language) || { lat: 0, lng: 0 }
  };
}

function createCurrentForm($: CheerioAPI, word: string, language: Language): Etymology {
  return {
    year: new Date().getFullYear(),
    language,
    form: word,
    meaning: extractMeaning($, language),
    location: getLanguageLocation(language) || { lat: 0, lng: 0 }
  };
}

function extractLanguageMeaning(text: string, language: string): string {
  const meaningMatch = text.match(new RegExp(`${language}[^"]*"([^"]+)"`, 'i'));
  return meaningMatch ? meaningMatch[1].trim() : '';
}