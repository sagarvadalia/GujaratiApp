import React, { useState } from 'react';
import { ScrollView, Text, YStack } from 'tamagui';

import type { StoryComprehensionQuestion } from '../../src/types/story';
import { Button, Card } from '../ui';
import { Input } from '../ui/input';

interface StoryExercisesProps {
  questions: StoryComprehensionQuestion[];
  onComplete: (score: number, totalPoints: number) => void;
}

export function StoryExercises({ questions, onComplete }: StoryExercisesProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [shortAnswer, setShortAnswer] = useState<string>('');
  const [answers, setAnswers] = useState<Map<string, string | boolean>>(new Map());
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswerSelect = (answer: string | boolean) => {
    if (currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'true-false') {
      setSelectedAnswer(answer as string);
    } else {
      setShortAnswer(answer as string);
    }
  };

  const handleNextQuestion = () => {
    // Save current answer
    const answerValue = currentQuestion.type === 'short-answer' 
      ? shortAnswer 
      : (selectedAnswer ?? false);
    
    setAnswers(new Map(answers.set(currentQuestion.id, answerValue)));

    if (isLastQuestion) {
      // Calculate score
      let score = 0;
      let totalPoints = 0;
      
      questions.forEach((q) => {
        totalPoints += q.points;
        const userAnswer = answers.get(q.id);
        if (userAnswer !== undefined) {
          if (q.type === 'multiple-choice' || q.type === 'short-answer') {
            if (userAnswer === q.correctAnswer) {
              score += q.points;
            }
          } else if (q.type === 'true-false') {
            if (userAnswer === q.correctAnswer) {
              score += q.points;
            }
          }
        }
      });

      // Add final answer to score calculation
      if (answerValue === currentQuestion.correctAnswer) {
        score += currentQuestion.points;
      }
      totalPoints += currentQuestion.points;

      setShowResults(true);
      onComplete(score, totalPoints);
    } else {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShortAnswer('');
    }
  };

  if (showResults) {
    let score = 0;
    let totalPoints = 0;
    
    questions.forEach((q) => {
      totalPoints += q.points;
      const userAnswer = answers.get(q.id);
      if (userAnswer !== undefined && userAnswer === q.correctAnswer) {
        score += q.points;
      }
    });

    return (
      <ScrollView flex={1} backgroundColor="$background" padding="$4">
        <Card tone="primary" elevated padding="$4">
          <YStack gap="$3" alignItems="center">
            <Text fontSize="$8" fontWeight="700" color="$primaryForeground">
              Comprehension Complete!
            </Text>
            <Text fontSize="$6" color="$primaryForeground">
              Score: {score} / {totalPoints}
            </Text>
            <Text fontSize="$5" color="$primaryForeground" opacity={0.9}>
              {Math.round((score / totalPoints) * 100)}% Correct
            </Text>
          </YStack>
        </Card>

        <YStack gap="$3" marginTop="$4">
          <Text fontSize="$6" fontWeight="600" color="$color">
            Review Answers:
          </Text>
          {questions.map((q, index) => {
            const userAnswer = answers.get(q.id);
            const isCorrect = userAnswer === q.correctAnswer;
            
            return (
              <Card key={q.id} padding="$3" borderWidth={1} borderColor={isCorrect ? '$green9' : '$red9'}>
                <YStack gap="$2">
                  <Text fontSize="$5" fontWeight="600" color="$color">
                    {index + 1}. {q.question}
                  </Text>
                  <Text fontSize="$4" color={isCorrect ? '$green11' : '$red11'}>
                    Your answer: {String(userAnswer ?? 'No answer')}
                  </Text>
                  <Text fontSize="$4" color="$mutedForeground">
                    Correct answer: {String(q.correctAnswer)}
                  </Text>
                </YStack>
              </Card>
            );
          })}
        </YStack>
      </ScrollView>
    );
  }

  return (
    <ScrollView flex={1} backgroundColor="$background" padding="$4">
      <YStack gap="$4">
        <Card tone="subtle" padding="$3">
          <Text fontSize="$4" color="$mutedForeground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </Text>
        </Card>

        <Card elevated padding="$4">
          <YStack gap="$4">
            <Text fontSize="$6" fontWeight="600" color="$color">
              {currentQuestion.question}
            </Text>

            {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
              <YStack gap="$2">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    size="lg"
                    variant={selectedAnswer === option ? 'secondary' : 'outline'}
                    onPress={() => handleAnswerSelect(option)}
                  >
                    <Text fontSize="$5" fontWeight="600">
                      {option}
                    </Text>
                  </Button>
                ))}
              </YStack>
            )}

            {currentQuestion.type === 'true-false' && (
              <YStack gap="$2">
                <Button
                  size="lg"
                  variant={selectedAnswer === 'True' ? 'secondary' : 'outline'}
                  onPress={() => handleAnswerSelect('True')}
                >
                  <Text fontSize="$5" fontWeight="600">
                    True
                  </Text>
                </Button>
                <Button
                  size="lg"
                  variant={selectedAnswer === 'False' ? 'secondary' : 'outline'}
                  onPress={() => handleAnswerSelect('False')}
                >
                  <Text fontSize="$5" fontWeight="600">
                    False
                  </Text>
                </Button>
              </YStack>
            )}

            {currentQuestion.type === 'short-answer' && (
              <Input
                placeholder="Type your answer"
                value={shortAnswer}
                onChangeText={setShortAnswer}
                size="$4"
                multiline
              />
            )}

            <Button
              size="lg"
              onPress={handleNextQuestion}
              disabled={
                (currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'true-false')
                  ? !selectedAnswer
                  : !shortAnswer.trim()
              }
            >
              {isLastQuestion ? 'Finish' : 'Next Question'}
            </Button>
          </YStack>
        </Card>
      </YStack>
    </ScrollView>
  );
}

