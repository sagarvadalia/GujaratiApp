import { useAuth } from '@clerk/clerk-expo';
import React, { useState } from 'react';
import { ScrollView, Text, View, YStack } from 'tamagui';

import { AnswerButton } from '../../components/quiz/AnswerButton';
import { QuestionCard } from '../../components/quiz/QuestionCard';
import { QuizFeedback } from '../../components/quiz/QuizFeedback';
import { Button, Card } from '../../components/ui';
import type { QuizQuestion } from '../../src/types/quiz';
import { useProgressStore } from '../../store/progressStore';
import { useQuizStore } from '../../store/quizStore';
import { trpc } from '../../utils/trpc';

export default function PracticeScreen() {
  // Auth context may be needed by child components
  void useAuth();
  const {
    currentSession,
    startQuiz,
    answerQuestion,
    nextQuestion,
    completeQuiz,
  } = useQuizStore();
  const { incrementDailyProgress, updateStreak, updateAccuracy, hearts, maxHearts, earnHeart } =
    useProgressStore();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [practiceXP, setPracticeXP] = useState(0);

  const { data: vocabulary } = trpc.vocabulary.getAll.useQuery();

  // Generate quiz questions from vocabulary
  const generateQuizQuestions = (): QuizQuestion[] => {
    if (!vocabulary || vocabulary.length < 4) {
      return [];
    }

    const questions: QuizQuestion[] = [];
    const shuffled = [...vocabulary]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10); // Practice mode has more questions

    shuffled.forEach((item, index) => {
      if (index % 3 === 0) {
        // Multiple choice: Gujarati to English
        const wrongAnswers = vocabulary
          .filter((v) => v.id !== item.id)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map((v) => v.english);
        questions.push({
          id: `q-${item.id}-1`,
          type: 'multiple-choice',
          question: item.gujarati,
          correctAnswer: item.english,
          options: [...wrongAnswers, item.english].sort(
            () => Math.random() - 0.5
          ),
          vocabularyId: item.id,
        });
      } else if (index % 3 === 1) {
        // True/False
        const isTrue = Math.random() > 0.5;
        questions.push({
          id: `q-${item.id}-2`,
          type: 'true-false',
          question: `${item.gujarati} means "${item.english}"`,
          correctAnswer: isTrue ? 'True' : 'False',
          options: ['True', 'False'],
          vocabularyId: item.id,
        });
      } else {
        // Translation
        questions.push({
          id: `q-${item.id}-3`,
          type: 'translation',
          question: item.english,
          correctAnswer: item.gujarati,
          vocabularyId: item.id,
        });
      }
    });

    return questions;
  };

  const handleStartPractice = () => {
    const questions = generateQuizQuestions();
    if (questions.length > 0) {
      startQuiz(questions);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setPracticeXP(0);
      updateStreak();
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (showFeedback) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!currentSession || selectedAnswer === null) return;

    const currentQuestion =
      currentSession.questions[currentSession.currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    // In practice mode, don't lose hearts for wrong answers
    answerQuestion(currentQuestion.id, selectedAnswer, isCorrect);
    setShowFeedback(true);

    // Update progress
    if (isCorrect) {
      incrementDailyProgress();
      // Award XP for correct answers in practice mode
      setPracticeXP((prev) => prev + 5);
    }
  };

  const handleContinue = () => {
    if (!currentSession) return;

    if (
      currentSession.currentQuestionIndex <
      currentSession.questions.length - 1
    ) {
      nextQuestion();
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      // Update accuracy when practice completes
      const correctAnswers = currentSession.answers.filter(
        (a) => a.isCorrect
      ).length;
      updateAccuracy(correctAnswers, currentSession.questions.length);

      // Earn hearts based on performance
      const accuracy = correctAnswers / currentSession.questions.length;
      if (accuracy >= 0.8 && hearts < maxHearts) {
        // Earn 1 heart for 80%+ accuracy
        earnHeart();
      }

      completeQuiz();
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  if (!currentSession) {
    return (
      <View
        flex={1}
        justifyContent="center"
        alignItems="center"
        padding="$4"
        backgroundColor="$background"
      >
        <YStack gap="$4" alignItems="center" maxWidth={400}>
          <Card tone="primary" padding="$4" elevated>
            <YStack gap="$3" alignItems="center">
              <Text fontSize="$9" fontWeight="700" color="$primaryForeground">
                Practice Mode
              </Text>
              <Text fontSize="$5" color="$primaryForeground" textAlign="center" opacity={0.9}>
                Practice without losing hearts!
              </Text>
            </YStack>
          </Card>
          
          <Card tone="subtle" padding="$4">
            <YStack gap="$2">
              <Text fontSize="$5" fontWeight="600" color="$color">
                Practice Mode Benefits:
              </Text>
              <Text fontSize="$4" color="$mutedForeground">
                ✓ No hearts lost for wrong answers
              </Text>
              <Text fontSize="$4" color="$mutedForeground">
                ✓ Earn hearts back with 80%+ accuracy
              </Text>
              <Text fontSize="$4" color="$mutedForeground">
                ✓ Unlimited practice sessions
              </Text>
              <Text fontSize="$4" color="$mutedForeground">
                ✓ XP rewards for correct answers
              </Text>
            </YStack>
          </Card>

          <Button size="lg" onPress={handleStartPractice} marginTop="$2">
            Start Practice
          </Button>
        </YStack>
      </View>
    );
  }

  const currentQuestion =
    currentSession.questions[currentSession.currentQuestionIndex];
  const isCorrect =
    currentSession.answers.find((a) => a.questionId === currentQuestion.id)
      ?.isCorrect ?? false;

  return (
    <ScrollView flex={1} backgroundColor="$background" padding="$4">
      <YStack gap="$4">
        {/* Practice Mode Banner */}
        <Card tone="accent" padding="$3">
          <YStack gap="$1">
            <Text fontSize="$5" fontWeight="700" color="$accentForeground">
              Practice Mode - No Hearts Lost!
            </Text>
            <Text fontSize="$3" color="$accentForeground" opacity={0.9}>
              Practice XP: {practiceXP}
            </Text>
          </YStack>
        </Card>

        {/* Progress */}
        <Card tone="subtle">
          <Text fontSize="$4" color="$mutedForeground">
            Score: {currentSession.score} / {currentSession.answers.length}
          </Text>
        </Card>

        {/* Question */}
        <QuestionCard
          question={currentQuestion}
          questionNumber={currentSession.currentQuestionIndex + 1}
          totalQuestions={currentSession.questions.length}
        />

        {/* Answer Options */}
        {currentQuestion.type === 'multiple-choice' &&
          currentQuestion.options && (
            <YStack gap="$3">
              {currentQuestion.options.map((option, index) => (
                <AnswerButton
                  key={index}
                  answer={option}
                  onPress={() => handleAnswerSelect(option)}
                  isSelected={selectedAnswer === option}
                  isCorrect={option === currentQuestion.correctAnswer}
                  showFeedback={showFeedback}
                />
              ))}
            </YStack>
          )}

        {currentQuestion.type === 'true-false' && (
          <YStack gap="$3">
            <AnswerButton
              answer="True"
              onPress={() => handleAnswerSelect('True')}
              isSelected={selectedAnswer === 'True'}
              isCorrect={currentQuestion.correctAnswer === 'True'}
              showFeedback={showFeedback}
            />
            <AnswerButton
              answer="False"
              onPress={() => handleAnswerSelect('False')}
              isSelected={selectedAnswer === 'False'}
              isCorrect={currentQuestion.correctAnswer === 'False'}
              showFeedback={showFeedback}
            />
          </YStack>
        )}

        {currentQuestion.type === 'translation' && (
          <View>
            <Text fontSize="$5" color="$gray10" marginBottom="$3">
              Type your answer (Gujarati):
            </Text>
            <Text fontSize="$4" color="$gray10">
              Translation input coming soon...
            </Text>
          </View>
        )}

        {/* Submit Button */}
        {!showFeedback && selectedAnswer && (
          <Button size="lg" onPress={handleSubmitAnswer} marginTop="$2">
            Submit Answer
          </Button>
        )}

        {/* Feedback */}
        {showFeedback && (
          <QuizFeedback
            isCorrect={isCorrect}
            correctAnswer={currentQuestion.correctAnswer}
            onContinue={handleContinue}
          />
        )}

        {/* Practice Complete */}
        {currentSession.completed && (
          <Card tone="primary" elevated marginTop="$4">
            <YStack gap="$3" alignItems="center">
              <Text fontSize="$8" fontWeight="700" color="$primaryForeground">
                Practice Complete!
              </Text>
              <Text fontSize="$6" color="$primaryForeground" opacity={0.9}>
                Score: {currentSession.score} /{' '}
                {currentSession.questions.length}
              </Text>
              {practiceXP > 0 && (
                <Text fontSize="$5" color="$primaryForeground" opacity={0.9}>
                  Practice XP Earned: {practiceXP}
                </Text>
              )}
              {currentSession.score / currentSession.questions.length >= 0.8 && hearts < maxHearts && (
                <Card tone="accent" padding="$3" marginTop="$2">
                  <Text fontSize="$5" fontWeight="600" color="$accentForeground">
                    🎉 Heart Restored!
                  </Text>
                </Card>
              )}
              <Button
                size="md"
                variant="secondary"
                onPress={handleStartPractice}
                marginTop="$2"
              >
                Practice Again
              </Button>
            </YStack>
          </Card>
        )}
      </YStack>
    </ScrollView>
  );
}

