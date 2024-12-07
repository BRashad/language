import { Word } from '../types';

const mockWords: Word[] = [
  {
    word: "kitab",
    language: "azerbaijani",
    meaning: "book",
    etymology: [
      {
        year: 750,
        language: "arabic",
        form: "kitāb",
        originalScript: "كتاب",
        meaning: "book, writing",
        location: { lat: 24, lng: 45 }
      },
      {
        year: 900,
        language: "persian",
        form: "ketāb",
        originalScript: "کتاب",
        meaning: "book",
        location: { lat: 32, lng: 53 }
      },
      {
        year: 1100,
        language: "turkish",
        form: "kitap",
        meaning: "book",
        location: { lat: 39, lng: 35 }
      },
      {
        year: 1200,
        language: "azerbaijani",
        form: "kitab",
        meaning: "book",
        location: { lat: 40, lng: 47 }
      }
    ],
    cognates: [
      {
        language: "Arabic",
        word: "kitāb",
        originalScript: "كتاب",
        meaning: "book, writing",
        location: { lat: 24, lng: 45 }
      },
      {
        language: "Persian",
        word: "ketāb",
        originalScript: "کتاب",
        meaning: "book",
        location: { lat: 32, lng: 53 }
      },
      {
        language: "Turkish",
        word: "kitap",
        meaning: "book",
        location: { lat: 39, lng: 35 }
      },
      {
        language: "Uzbek",
        word: "kitob",
        meaning: "book",
        location: { lat: 41, lng: 64 }
      },
      {
        language: "Kazakh",
        word: "кітап",
        originalScript: "кітап",
        meaning: "book",
        location: { lat: 48, lng: 67 }
      },
      {
        language: "Kyrgyz",
        word: "китеп",
        originalScript: "китеп",
        meaning: "book",
        location: { lat: 41, lng: 74 }
      },
      {
        language: "Uyghur",
        word: "kitab",
        originalScript: "كىتاب",
        meaning: "book",
        location: { lat: 41, lng: 84 }
      },
      {
        language: "Turkmen",
        word: "kitap",
        meaning: "book",
        location: { lat: 38, lng: 59 }
      }
    ]
  },
  {
    word: "күн",
    language: "kazakh",
    meaning: "sun; day",
    etymology: [
      {
        year: 735,
        language: "turkish",
        form: "kün",
        meaning: "sun, day",
        location: { lat: 47, lng: 102 }
      },
      {
        year: 900,
        language: "uzbek",
        form: "kun",
        meaning: "day",
        location: { lat: 41, lng: 64 }
      },
      {
        year: 1100,
        language: "kazakh",
        form: "күн",
        meaning: "sun; day",
        location: { lat: 48, lng: 67 }
      }
    ],
    cognates: [
      {
        language: "Turkish",
        word: "gün",
        meaning: "day",
        location: { lat: 39, lng: 35 }
      },
      {
        language: "Azerbaijani",
        word: "gün",
        meaning: "day",
        location: { lat: 40, lng: 47 }
      },
      {
        language: "Uzbek",
        word: "kun",
        meaning: "day",
        location: { lat: 41, lng: 64 }
      },
      {
        language: "Kyrgyz",
        word: "күн",
        originalScript: "күн",
        meaning: "sun; day",
        location: { lat: 41, lng: 74 }
      },
      {
        language: "Uyghur",
        word: "kün",
        originalScript: "كۈن",
        meaning: "sun; day",
        location: { lat: 41, lng: 84 }
      },
      {
        language: "Turkmen",
        word: "gün",
        meaning: "day",
        location: { lat: 38, lng: 59 }
      }
    ]
  }
];

export function findMockWord(searchTerm: string): Word | null {
  const normalizedSearch = searchTerm.toLowerCase().trim();
  
  // First try exact match
  let result = mockWords.find(
    word => word.word.toLowerCase() === normalizedSearch
  );

  // If no exact match, try matching original scripts
  if (!result) {
    result = mockWords.find(word => 
      word.etymology.some(e => e.originalScript?.toLowerCase() === normalizedSearch) ||
      word.cognates?.some(c => c.originalScript?.toLowerCase() === normalizedSearch)
    );
  }

  // If still no match, try matching cognates
  if (!result) {
    result = mockWords.find(word =>
      word.cognates?.some(c => c.word.toLowerCase() === normalizedSearch)
    );
  }

  return result || null;
}

export { mockWords };