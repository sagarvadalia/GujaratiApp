/**
 * Comprehensive seed script for Gujarati Learning App
 * Run with: pnpm db:seed
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data (in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('🧹 Clearing existing data...');
    await prisma.userChallengeProgress.deleteMany();
    await prisma.dailyChallenge.deleteMany();
    await prisma.userAchievement.deleteMany();
    await prisma.achievement.deleteMany();
    await prisma.storyProgress.deleteMany();
    await prisma.storyComprehensionQuestion.deleteMany();
    await prisma.storySentence.deleteMany();
    await prisma.storyParagraph.deleteMany();
    await prisma.story.deleteMany();
    await prisma.userPerformance.deleteMany();
    await prisma.sRSData.deleteMany();
    await prisma.skill.deleteMany();
    await prisma.lesson.deleteMany();
    await prisma.unit.deleteMany();
    await prisma.grammarTip.deleteMany();
    await prisma.conjugationForm.deleteMany();
    await prisma.conjugationPattern.deleteMany();
    await prisma.grammarExample.deleteMany();
    await prisma.grammarRule.deleteMany();
    await prisma.vocabulary.deleteMany();
  }

  // Seed Vocabulary (500+ words)
  console.log('📚 Seeding vocabulary...');
  const vocabularyData = [
    // Greetings
    { gujarati: 'નમસ્તે', transliteration: 'Namaste', english: 'Hello', category: 'greetings', difficulty: 1 },
    { gujarati: 'આવજો', transliteration: 'Aavjo', english: 'Goodbye', category: 'greetings', difficulty: 1 },
    { gujarati: 'આભાર', transliteration: 'Aabhar', english: 'Thank you', category: 'greetings', difficulty: 1 },
    { gujarati: 'સ્વાગત', transliteration: 'Swagat', english: 'Welcome', category: 'greetings', difficulty: 1 },
    { gujarati: 'કેમ છો?', transliteration: 'Kem cho?', english: 'How are you?', category: 'greetings', difficulty: 1 },
    
    // Numbers
    { gujarati: 'એક', transliteration: 'Ek', english: 'One', category: 'numbers', difficulty: 1 },
    { gujarati: 'બે', transliteration: 'Be', english: 'Two', category: 'numbers', difficulty: 1 },
    { gujarati: 'ત્રણ', transliteration: 'Tran', english: 'Three', category: 'numbers', difficulty: 1 },
    { gujarati: 'ચાર', transliteration: 'Char', english: 'Four', category: 'numbers', difficulty: 1 },
    { gujarati: 'પાંચ', transliteration: 'Panch', english: 'Five', category: 'numbers', difficulty: 1 },
    { gujarati: 'છ', transliteration: 'Chha', english: 'Six', category: 'numbers', difficulty: 1 },
    { gujarati: 'સાત', transliteration: 'Sat', english: 'Seven', category: 'numbers', difficulty: 1 },
    { gujarati: 'આઠ', transliteration: 'Aath', english: 'Eight', category: 'numbers', difficulty: 1 },
    { gujarati: 'નવ', transliteration: 'Nav', english: 'Nine', category: 'numbers', difficulty: 1 },
    { gujarati: 'દસ', transliteration: 'Das', english: 'Ten', category: 'numbers', difficulty: 1 },
    
    // Family
    { gujarati: 'મા', transliteration: 'Ma', english: 'Mother', category: 'family', difficulty: 1 },
    { gujarati: 'પિતા', transliteration: 'Pita', english: 'Father', category: 'family', difficulty: 1 },
    { gujarati: 'ભાઈ', transliteration: 'Bhai', english: 'Brother', category: 'family', difficulty: 1 },
    { gujarati: 'બહેન', transliteration: 'Bahen', english: 'Sister', category: 'family', difficulty: 1 },
    { gujarati: 'દાદા', transliteration: 'Dada', english: 'Grandfather', category: 'family', difficulty: 2 },
    { gujarati: 'દાદી', transliteration: 'Dadi', english: 'Grandmother', category: 'family', difficulty: 2 },
    
    // Common Words
    { gujarati: 'પાણી', transliteration: 'Pani', english: 'Water', category: 'common', difficulty: 1 },
    { gujarati: 'ખોરાક', transliteration: 'Khorak', english: 'Food', category: 'common', difficulty: 1 },
    { gujarati: 'ઘર', transliteration: 'Ghar', english: 'House', category: 'common', difficulty: 1 },
    { gujarati: 'શાળા', transliteration: 'Shala', english: 'School', category: 'common', difficulty: 1 },
    { gujarati: 'કામ', transliteration: 'Kam', english: 'Work', category: 'common', difficulty: 1 },
    
    // Add more vocabulary here - this is a sample, expand to 500+ words
  ];

  const createdVocabulary = await Promise.all(
    vocabularyData.map((v) =>
      prisma.vocabulary.create({
        data: v,
      })
    )
  );

  console.log(`✅ Created ${createdVocabulary.length} vocabulary items`);

  // Seed Grammar Rules
  console.log('📖 Seeding grammar rules...');
  const presentTenseRule = await prisma.grammarRule.create({
    data: {
      title: 'Present Tense Verbs',
      description: 'Learn how to conjugate verbs in present tense',
      category: 'verbs',
      explanation: 'In Gujarati, present tense verbs change based on the subject. The verb stem is modified with endings that indicate person and number.',
      difficulty: 2,
      relatedVocabularyIds: createdVocabulary.slice(0, 5).map((v) => v.id),
      examples: {
        create: [
          {
            gujarati: 'હું ખાઉં છું',
            transliteration: 'Hu khavu chu',
            english: 'I eat',
            order: 0,
          },
          {
            gujarati: 'તમે ખાઓ છો',
            transliteration: 'Tame khawo cho',
            english: 'You eat',
            order: 1,
          },
          {
            gujarati: 'તે ખાય છે',
            transliteration: 'Te khay che',
            english: 'He/She eats',
            order: 2,
          },
        ],
      },
      conjugationPatterns: {
        create: [
          {
            tense: 'Present',
            person: 'First',
            forms: {
              create: [
                {
                  person: 'First',
                  number: 'Singular',
                  form: 'ખાઉં છું',
                  transliteration: 'Khavu chu',
                  order: 0,
                },
                {
                  person: 'First',
                  number: 'Plural',
                  form: 'ખાઈએ છીએ',
                  transliteration: 'Khaie chie',
                  order: 1,
                },
              ],
            },
          },
        ],
      },
      tips: {
        create: [
          {
            tip: 'Present tense verbs always end with "છું", "છો", or "છે"',
            order: 0,
          },
        ],
      },
    },
  });

  console.log('✅ Created grammar rules');

  // Seed Learning Path
  console.log('🗺️ Seeding learning path...');
  const unit1 = await prisma.unit.create({
    data: {
      name: 'Basics',
      description: 'Learn the fundamentals of Gujarati',
      order: 1,
      lessons: {
        create: [
          {
            name: 'Greetings',
            description: 'Learn common greetings',
            order: 1,
            skills: {
              create: [
                {
                  name: 'Hello & Goodbye',
                  description: 'Basic greetings',
                  vocabularyIds: createdVocabulary.slice(0, 2).map((v) => v.id),
                  grammarRuleIds: [presentTenseRule.id],
                  difficulty: 1,
                  xpReward: 10,
                  prerequisites: [],
                  order: 1,
                },
                {
                  name: 'Politeness',
                  description: 'Thank you and welcome',
                  vocabularyIds: createdVocabulary.slice(2, 4).map((v) => v.id),
                  grammarRuleIds: [presentTenseRule.id],
                  difficulty: 1,
                  xpReward: 10,
                  prerequisites: [],
                  order: 2,
                },
              ],
            },
          },
          {
            name: 'Numbers',
            description: 'Learn numbers 1-10',
            order: 2,
            skills: {
              create: [
                {
                  name: 'Numbers 1-10',
                  description: 'Basic counting',
                  vocabularyIds: createdVocabulary.slice(5, 15).map((v) => v.id),
                  difficulty: 1,
                  xpReward: 15,
                  prerequisites: [],
                  order: 1,
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('✅ Created learning path');

  // Seed Stories
  console.log('📚 Seeding stories...');
  const story1 = await prisma.story.create({
    data: {
      title: 'મારી પ્રથમ વાતચીત',
      description: 'A simple conversation about meeting someone for the first time',
      difficulty: 1,
      category: 'beginner',
      vocabularyIds: createdVocabulary.slice(0, 3).map((v) => v.id),
      xpReward: 20,
      paragraphs: {
        create: [
          {
            order: 1,
            sentences: {
              create: [
                {
                  gujarati: 'નમસ્તે! તમારું નામ શું છે?',
                  transliteration: 'Namaste! Tamaru naam shu che?',
                  english: 'Hello! What is your name?',
                  vocabularyIds: [createdVocabulary[0].id],
                  order: 0,
                },
                {
                  gujarati: 'મારું નામ રાજ છે.',
                  transliteration: 'Maru naam Raj che.',
                  english: 'My name is Raj.',
                  vocabularyIds: [createdVocabulary[0].id],
                  order: 1,
                },
              ],
            },
          },
        ],
      },
      questions: {
        create: [
          {
            question: 'What does "નમસ્તે" mean?',
            type: 'multiple-choice',
            options: ['Hello', 'Goodbye', 'Thank you', 'Please'],
            correctAnswer: 'Hello',
            points: 5,
            order: 0,
          },
        ],
      },
    },
  });

  console.log('✅ Created stories');

  // Seed Achievements
  console.log('🏆 Seeding achievements...');
  const achievements = await Promise.all([
    prisma.achievement.create({
      data: {
        name: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        type: 'streak',
        icon: '🔥',
        points: 50,
        requirement: 7,
        rarity: 'common',
      },
    }),
    prisma.achievement.create({
      data: {
        name: 'Vocabulary Master',
        description: 'Learn 500 vocabulary words',
        type: 'vocabulary',
        icon: '📖',
        points: 500,
        requirement: 500,
        rarity: 'rare',
      },
    }),
    prisma.achievement.create({
      data: {
        name: 'Perfect Score',
        description: 'Complete a lesson with 100% accuracy',
        type: 'perfect-lesson',
        icon: '⭐',
        points: 25,
        requirement: 1,
        rarity: 'common',
      },
    }),
  ]);

  console.log(`✅ Created ${achievements.length} achievements`);

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

