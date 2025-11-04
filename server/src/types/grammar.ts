export interface GrammarRule {
  id: string;
  title: string;
  description: string;
  category: GrammarCategory;
  explanation: string; // Detailed explanation in English
  examples: GrammarExample[];
  difficulty: number; // 1-5
  conjugationPatterns?: ConjugationPattern[];
  relatedVocabularyIds: string[];
}

export type GrammarCategory =
  | 'verbs'
  | 'nouns'
  | 'adjectives'
  | 'pronouns'
  | 'prepositions'
  | 'tenses'
  | 'sentence-structure'
  | 'negation'
  | 'questions'
  | 'plural'
  | 'gender';

export interface GrammarExample {
  gujarati: string;
  transliteration: string;
  english: string;
  audioUrl?: string;
}

export interface ConjugationPattern {
  tense: Tense;
  person: Person;
  forms: ConjugationForm[];
}

export type Tense = 'present' | 'past' | 'future' | 'imperfect' | 'perfect';
export type Person = 'first' | 'second' | 'third';
export type Number = 'singular' | 'plural';

export interface ConjugationForm {
  person: Person;
  number: Number;
  form: string; // Gujarati form
  transliteration: string;
  example?: string;
}

export interface GrammarTip {
  id: string;
  ruleId: string;
  tip: string; // Short tip text
  context: string; // When to show this tip
}

