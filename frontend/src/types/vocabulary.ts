export interface Vocabulary {
  id: string;
  gujarati: string;        // Native script: "નમસ્તે"
  transliteration: string;  // English pronunciation: "Namaste"
  english: string;         // English meaning: "Hello"
  category: string;        // e.g., "greetings", "numbers", "common"
  audioUrl?: string;       // Audio pronunciation file URL
  difficulty: number;      // 1-5 difficulty level
}

// Initial vocabulary data - common Gujarati words
export const initialVocabulary: Vocabulary[] = [
  // Greetings
  {
    id: '1',
    gujarati: 'નમસ્તે',
    transliteration: 'Namaste',
    english: 'Hello / Greetings',
    category: 'greetings',
    difficulty: 1,
  },
  {
    id: '2',
    gujarati: 'કેમ છો?',
    transliteration: 'Kem cho?',
    english: 'How are you?',
    category: 'greetings',
    difficulty: 1,
  },
  {
    id: '3',
    gujarati: 'આવજો',
    transliteration: 'Aavjo',
    english: 'Welcome / Come',
    category: 'greetings',
    difficulty: 2,
  },
  {
    id: '4',
    gujarati: 'આભાર',
    transliteration: 'Aabhar',
    english: 'Thank you',
    category: 'greetings',
    difficulty: 1,
  },
  {
    id: '5',
    gujarati: 'બાય',
    transliteration: 'Bai',
    english: 'Bye',
    category: 'greetings',
    difficulty: 1,
  },
  // Numbers
  {
    id: '6',
    gujarati: 'એક',
    transliteration: 'Ek',
    english: 'One',
    category: 'numbers',
    difficulty: 1,
  },
  {
    id: '7',
    gujarati: 'બે',
    transliteration: 'Be',
    english: 'Two',
    category: 'numbers',
    difficulty: 1,
  },
  {
    id: '8',
    gujarati: 'ત્રણ',
    transliteration: 'Tran',
    english: 'Three',
    category: 'numbers',
    difficulty: 1,
  },
  {
    id: '9',
    gujarati: 'ચાર',
    transliteration: 'Char',
    english: 'Four',
    category: 'numbers',
    difficulty: 1,
  },
  {
    id: '10',
    gujarati: 'પાંચ',
    transliteration: 'Panch',
    english: 'Five',
    category: 'numbers',
    difficulty: 1,
  },
  // Common words
  {
    id: '11',
    gujarati: 'પાણી',
    transliteration: 'Pani',
    english: 'Water',
    category: 'common',
    difficulty: 1,
  },
  {
    id: '12',
    gujarati: 'ખાવું',
    transliteration: 'Khavu',
    english: 'To eat',
    category: 'common',
    difficulty: 2,
  },
  {
    id: '13',
    gujarati: 'પીવું',
    transliteration: 'Pivu',
    english: 'To drink',
    category: 'common',
    difficulty: 2,
  },
  {
    id: '14',
    gujarati: 'ઘર',
    transliteration: 'Ghar',
    english: 'Home',
    category: 'common',
    difficulty: 1,
  },
  {
    id: '15',
    gujarati: 'માતા',
    transliteration: 'Mata',
    english: 'Mother',
    category: 'common',
    difficulty: 1,
  },
  {
    id: '16',
    gujarati: 'પિતા',
    transliteration: 'Pita',
    english: 'Father',
    category: 'common',
    difficulty: 1,
  },
];

export const categories = ['greetings', 'numbers', 'common'] as const;
export type Category = typeof categories[number];

