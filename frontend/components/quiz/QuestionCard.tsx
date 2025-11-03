import React from 'react';
import { View, Text, Card, YStack } from 'tamagui';
import { QuizQuestion } from '../../src/types/quiz';

interface QuestionCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
}

export function QuestionCard({ question, questionNumber, totalQuestions }: QuestionCardProps) {
  return (
    <Card elevate size="$4" bordered padding="$4" marginBottom="$4">
      <YStack gap="$3">
        <Text fontSize="$4" color="$gray10">
          Question {questionNumber} of {totalQuestions}
        </Text>

        <Text fontSize="$8" fontWeight="700" color="$color" textAlign="center">
          {question.question}
        </Text>

        {question.type === 'multiple-choice' && (
          <Text fontSize="$5" color="$gray10" textAlign="center" marginTop="$2">
            Choose the correct answer:
          </Text>
        )}

        {question.type === 'true-false' && (
          <Text fontSize="$5" color="$gray10" textAlign="center" marginTop="$2">
            Is this correct?
          </Text>
        )}

        {question.type === 'translation' && (
          <Text fontSize="$5" color="$gray10" textAlign="center" marginTop="$2">
            Translate this word:
          </Text>
        )}
      </YStack>
    </Card>
  );
}

