import { LanguageInfo } from '../types';

export const languageInfo: Record<string, LanguageInfo> = {
  arabic: {
    name: 'Arabic',
    family: 'Semitic',
    script: 'arabic',
    location: { lat: 24, lng: 45 }
  },
  persian: {
    name: 'Persian',
    family: 'Iranian',
    script: 'arabic',
    location: { lat: 32, lng: 53 }
  },
  turkish: {
    name: 'Turkish',
    family: 'Oghuz Turkic',
    script: 'latin',
    location: { lat: 39, lng: 35 }
  },
  azerbaijani: {
    name: 'Azerbaijani',
    family: 'Oghuz Turkic',
    script: 'latin',
    location: { lat: 40, lng: 47 }
  },
  turkmen: {
    name: 'Turkmen',
    family: 'Oghuz Turkic',
    script: 'latin',
    location: { lat: 38, lng: 59 }
  },
  uzbek: {
    name: 'Uzbek',
    family: 'Karluk Turkic',
    script: 'latin',
    location: { lat: 41, lng: 64 }
  },
  uyghur: {
    name: 'Uyghur',
    family: 'Karluk Turkic',
    script: 'arabic',
    location: { lat: 41, lng: 84 }
  },
  kazakh: {
    name: 'Kazakh',
    family: 'Kipchak Turkic',
    script: 'cyrillic',
    location: { lat: 48, lng: 67 }
  },
  kyrgyz: {
    name: 'Kyrgyz',
    family: 'Kipchak Turkic',
    script: 'cyrillic',
    location: { lat: 41, lng: 74 }
  },
  tatar: {
    name: 'Tatar',
    family: 'Kipchak Turkic',
    script: 'cyrillic',
    location: { lat: 55, lng: 49 }
  }
};

export function getLanguageFamily(language: string): string {
  return languageInfo[language.toLowerCase()]?.family || 'Other Languages';
}

export function getLanguageInfo(language: string): LanguageInfo | undefined {
  return languageInfo[language.toLowerCase()];
}

export function getLanguageScript(language: string): 'latin' | 'arabic' | 'cyrillic' | undefined {
  return languageInfo[language.toLowerCase()]?.script;
}

export function getLanguageLocation(language: string): { lat: number; lng: number } | undefined {
  return languageInfo[language.toLowerCase()]?.location;
}