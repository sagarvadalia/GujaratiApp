import React, { useMemo, useState } from 'react';
import { Text, View, YStack } from 'tamagui';

import type { GrammarRule } from '../../src/types/grammar';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { AudioPlayer } from '../vocabulary/AudioPlayer';

interface GrammarExerciseProps {
  rule: GrammarRule;
  onComplete: (correct: boolean) => void;
}

type ExerciseData = {
  type: 'conjugation-mc' | 'conjugation-write' | 'translation';
  question: string;
  correctAnswer: string;
  hint?: string;
  options?: string[];
};

export function GrammarExercise({ rule, onComplete }: GrammarExerciseProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [exerciseKey, setExerciseKey] = useState(0); // Key to force re-generation

  // Generate exercise based on rule type
  const exercise = useMemo<ExerciseData | null>(() => {
    if (rule.category === 'verbs' && rule.conjugationPatterns && rule.conjugationPatterns.length > 0) {
      // Conjugation exercise - randomly choose between multiple choice and write
      const pattern = rule.conjugationPatterns[Math.floor(Math.random() * rule.conjugationPatterns.length)];
      if (pattern && pattern.forms.length > 0) {
        const randomForm = pattern.forms[Math.floor(Math.random() * pattern.forms.length)];
        const otherForms = pattern.forms.filter(f => f.form !== randomForm.form);
        const wrongOptions = otherForms
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(f => f.form);
        
        const useMultipleChoice = Math.random() > 0.5;
        
        return {
          type: useMultipleChoice ? 'conjugation-mc' as const : 'conjugation-write' as const,
          question: `Conjugate the verb for ${randomForm.person} person, ${randomForm.number}:`,
          correctAnswer: randomForm.form,
          hint: randomForm.transliteration,
          options: useMultipleChoice ? [...wrongOptions, randomForm.form].sort(() => Math.random() - 0.5) : undefined,
        };
      }
    }

    // Default: translation exercise
    if (rule.examples.length > 0) {
      const randomExample = rule.examples[Math.floor(Math.random() * rule.examples.length)];
      return {
        type: 'translation' as const,
        question: `Translate to Gujarati: "${randomExample.english}"`,
        correctAnswer: randomExample.gujarati,
        hint: randomExample.transliteration,
      };
    }

    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- exerciseKey is used to force re-generation
  }, [rule, exerciseKey]);

  if (!exercise) {
    return (
      <Card padding="$4">
        <Text color="$mutedForeground">No exercise available for this grammar rule.</Text>
      </Card>
    );
  }

  const handleSubmit = () => {
    if (!exercise) return;
    
    let correct = false;
    if (exercise.type === 'conjugation-mc') {
      correct = selectedOption === exercise.correctAnswer;
    } else {
      correct = selectedAnswer.trim() === exercise.correctAnswer;
    }
    setIsCorrect(correct);
    setShowFeedback(true);
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setSelectedAnswer(option);
  };

  const handleContinue = () => {
    onComplete(isCorrect);
    setSelectedAnswer('');
    setSelectedOption(null);
    setShowFeedback(false);
    // Generate new exercise by updating key
    setExerciseKey(prev => prev + 1);
  };

  return (
    <Card padding="$4">
      <YStack gap="$4">
        <YStack gap="$2">
          <Text fontSize="$6" fontWeight="600" color="$color">
            Grammar Practice
          </Text>
          <Text fontSize="$5" color="$color">
            {exercise.question}
          </Text>
        </YStack>

        {!showFeedback && (
          <YStack gap="$3">
            {exercise.type === 'conjugation-mc' && exercise.options ? (
              <YStack gap="$2">
                {exercise.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedOption === option ? 'secondary' : 'outline'}
                    size="lg"
                    onPress={() => handleOptionSelect(option)}
                  >
                    <Text fontSize="$5" fontWeight="600">
                      {option}
                    </Text>
                  </Button>
                ))}
                <Button onPress={handleSubmit} disabled={!selectedOption} marginTop="$2">
                  Submit Answer
                </Button>
              </YStack>
            ) : (
              <>
                <Input
                  placeholder="Type your answer in Gujarati"
                  value={selectedAnswer}
                  onChangeText={setSelectedAnswer}
                  size="$4"
                />
                <Button onPress={handleSubmit} disabled={!selectedAnswer.trim()}>
                  Submit Answer
                </Button>
              </>
            )}
          </YStack>
        )}

        {showFeedback && (
          <YStack gap="$3">
            <View
              padding="$3"
              borderRadius="$3"
              backgroundColor={isCorrect ? '$green2' : '$red2'}
              borderWidth={1}
              borderColor={isCorrect ? '$green9' : '$red9'}
            >
              <Text
                fontSize="$5"
                fontWeight="600"
                color={isCorrect ? '$green11' : '$red11'}
                marginBottom="$2"
              >
                {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
              </Text>
              <YStack gap="$2">
                <Text fontSize="$4" color={isCorrect ? '$green12' : '$red12'}>
                  Correct answer: {exercise.correctAnswer}
                </Text>
                <AudioPlayer gujaratiText={exercise.correctAnswer} />
              </YStack>
              {exercise.hint && (
                <Text fontSize="$3" color="$mutedForeground" marginTop="$1">
                  Pronunciation: {exercise.hint}
                </Text>
              )}
            </View>
            <Button onPress={handleContinue}>Continue</Button>
          </YStack>
        )}
      </YStack>
    </Card>
  );
}

