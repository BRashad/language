import { Word, Etymology, Cognate } from '../types';

const WIKTIONARY_API_BASE = 'https://en.wiktionary.org/w/api.php';

interface WiktionaryResponse {
  parse?: {
    title: string;
    text: {
      '*': string;
    };
  };
  error?: {
    code: string;
    info: string;
  };
}

export async function searchWord(word: string): Promise<Word | null> {
  try {
    const response = await fetch(
      `${WIKTIONARY_API_BASE}?action=parse&format=json&page=${encodeURIComponent(word)}&prop=text&origin=*`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: WiktionaryResponse = await response.json();
    
    if (data.error) {
      console.log('Wiktionary API error:', data.error);
      return null;
    }

    if (!data.parse) {
      console.log('No parse data returned from Wiktionary');
      return null;
    }

    const parsedWord = parseWiktionaryResponse(data.parse, word);
    if (parsedWord) {
      const cognates = await fetchCognates(word);
      return {
        ...parsedWord,
        cognates
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching word data:', error);
    return null;
  }
}

function parseWiktionaryResponse(parseData: WiktionaryResponse['parse'], word: string): Word | null {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(parseData.text['*'], 'text/html');
    
    // Look for Turkic language sections
    const turkicLanguages = ['Turkish', 'Azerbaijani', 'Uzbek', 'Kazakh', 'Kyrgyz'];
    let wordData: Word | null = null;

    for (const language of turkicLanguages) {
      const section = doc.querySelector(`#${language}, .language-${language}`);
      if (section) {
        const meaningEl = section.querySelector('.meaning, .definition, .gloss');
        const meaning = meaningEl?.textContent?.trim() || '';

        wordData = {
          word,
          language: language.toLowerCase() as Word['language'],
          meaning,
          etymology: []
        };
        break;
      }
    }

    return wordData;
  } catch (error) {
    console.error('Error parsing Wiktionary response:', error);
    return null;
  }
}

async function fetchCognates(word: string): Promise<Cognate[]> {
  try {
    const response = await fetch(
      `${WIKTIONARY_API_BASE}?action=parse&format=json&page=${encodeURIComponent(word)}&prop=text&section=Etymology&origin=*`
    );
    
    if (!response.ok) return [];

    const data: WiktionaryResponse = await response.json();
    
    if (!data.parse) return [];

    const parser = new DOMParser();
    const doc = parser.parseFromString(data.parse.text['*'], 'text/html');
    
    const cognates: Cognate[] = [];
    const cognateLists = doc.querySelectorAll('.cognate, .derived, .etymology-derived');
    
    cognateLists.forEach(list => {
      const items = list.querySelectorAll('li');
      items.forEach(item => {
        const cognate = parseCognateItem(item.textContent || '');
        if (cognate) {
          cognates.push(cognate);
        }
      });
    });

    return cognates;
  } catch (error) {
    console.error('Error fetching cognates:', error);
    return [];
  }
}

function parseCognateItem(text: string): Cognate | null {
  const match = text.match(/([^:]+):\s*([^\s]+)(?:\s*\(([^)]+)\))?/);
  if (!match) return null;

  const [, language, word, meaning] = match;
  const location = getLanguageLocation(language.trim().toLowerCase());
  
  return {
    language: language.trim(),
    word: word.trim(),
    meaning: meaning?.trim() || '',
    location
  };
}

function getLanguageLocation(language: string): { lat: number; lng: number } {
  const locations: Record<string, { lat: number; lng: number }> = {
    turkish: { lat: 39, lng: 35 },
    azerbaijani: { lat: 40, lng: 47 },
    uzbek: { lat: 41, lng: 64 },
    kazakh: { lat: 48, lng: 67 },
    kyrgyz: { lat: 41, lng: 74 },
    turkmen: { lat: 38, lng: 59 },
    uyghur: { lat: 41, lng: 84 },
    tatar: { lat: 55, lng: 49 }
  };
  
  return locations[language] || { lat: 0, lng: 0 };
}