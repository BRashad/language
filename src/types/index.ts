export type Language = 
  | 'arabic' 
  | 'persian'
  | 'turkish' 
  | 'azerbaijani' 
  | 'uzbek' 
  | 'kazakh' 
  | 'kyrgyz'
  | 'turkmen'
  | 'uyghur'
  | 'tatar';

export interface Word {
  word: string;
  language: Language;
  meaning: string;
  etymology: Etymology[];
  cognates?: Cognate[];
}

export interface Etymology {
  year: number;
  language: Language;
  form: string;
  originalScript?: string;
  meaning: string;
  location: {
    lat: number;
    lng: number;
  };
}

export interface Cognate {
  language: string;
  word: string;
  originalScript?: string;
  meaning: string;
  location: {
    lat: number;
    lng: number;
  };
}

export interface LanguageInfo {
  name: string;
  family: string;
  script: 'latin' | 'arabic' | 'cyrillic';
  location: {
    lat: number;
    lng: number;
  };
}