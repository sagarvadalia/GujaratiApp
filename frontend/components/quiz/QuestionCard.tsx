import React from 'react';
import { Text, YStack } from 'tamagui';

import { type QuizQuestion } from '../../src/types/quiz';
import { Card as UICard } from '../ui/card';

interface QuestionCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
}

export function QuestionCard({ question, questionNumber, totalQuestions }: QuestionCardProps) {
  return (
    <UICard elevated>
      <YStack gap="$3">
        <Text fontSize="$4" color="$mutedForeground">
          Question {questionNumber} of {totalQuestions}
        </Text>

        <Text fontSize="$8" fontWeight="700" color="$foreground" textAlign="center">
          {question.question}
        </Text>

        {question.type === 'multiple-choice' && (
          <Text fontSize="$5" color="$mutedForeground" textAlign="center" marginTop="$2">
            Choose the correct answer:
          </Text>
        )}

        {question.type === 'true-false' && (
          <Text fontSize="$5" color="$mutedForeground" textAlign="center" marginTop="$2">
            Is this correct?
          </Text>
        )}

        {question.type === 'translation' && (
          <Text fontSize="$5" color="$mutedForeground" textAlign="center" marginTop="$2">
            Translate this word:
          </Text>
        )}
      </YStack>
    </UICard>
  );
}

