import React, { useState } from 'react';
import { View, Text, ScrollView, YStack } from 'tamagui';
import { QuestionCard } from '../../components/quiz/QuestionCard';
import { AnswerButton } from '../../components/quiz/AnswerButton';
import { QuizFeedback } from '../../components/quiz/QuizFeedback';
import { useQuizStore } from '../../store/quizStore';
import { useProgressStore } from '../../store/progressStore';
import { trpc } from '../../utils/trpc';
import { QuizQuestion } from '../../src/types/quiz';
import { Button as UIButton, Card as UICard } from '../../components/ui';

export default function LearnScreen() {
  const { currentSession, startQuiz, answerQuestion, nextQuestion, completeQuiz } =
    useQuizStore();
  const { incrementDailyProgress, updateStreak, updateAccuracy } = useProgressStore();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const { data: vocabulary } = trpc.vocabulary.getAll.useQuery();

  // Generate quiz questions from vocabulary
  const generateQuizQuestions = (): QuizQuestion[] => {
    if (!vocabulary || vocabulary.length < 4) {
      return [];
    }

    const questions: QuizQuestion[] = [];
    const shuffled = [...vocabulary].sort(() => Math.random() - 0.5).slice(0, 5);

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
          options: [...wrongAnswers, item.english].sort(() => Math.random() - 0.5),
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

  const handleStartQuiz = () => {
    const questions = generateQuizQuestions();
    if (questions.length > 0) {
      startQuiz(questions);
      setSelectedAnswer(null);
      setShowFeedback(false);
      updateStreak();
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (showFeedback) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!currentSession || selectedAnswer === null) return;

    const currentQuestion = currentSession.questions[currentSession.currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    answerQuestion(currentQuestion.id, selectedAnswer, isCorrect);
    setShowFeedback(true);
    
    // Update progress
    if (isCorrect) {
      incrementDailyProgress();
    }
  };

  const handleContinue = () => {
    if (!currentSession) return;

    if (currentSession.currentQuestionIndex < currentSession.questions.length - 1) {
      nextQuestion();
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      // Update accuracy when quiz completes
      const correctAnswers = currentSession.answers.filter((a) => a.isCorrect).length;
      updateAccuracy(correctAnswers, currentSession.questions.length);
      
      completeQuiz();
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  if (!currentSession) {
    return (
      <View flex={1} justifyContent="center" alignItems="center" padding="$4" bg="$background">
        <YStack gap="$4" alignItems="center" maxWidth={400}>
          <Text fontSize="$9" fontWeight="700" color="$color" textAlign="center">
            Practice Quiz
          </Text>
          <Text fontSize="$5" color="$mutedForeground" textAlign="center">
            Test your knowledge with interactive quizzes
          </Text>
          <UIButton size="lg" onPress={handleStartQuiz} marginTop="$2">
            Start Quiz
          </UIButton>
        </YStack>
      </View>
    );
  }

  const currentQuestion = currentSession.questions[currentSession.currentQuestionIndex];
  const isLastQuestion =
    currentSession.currentQuestionIndex === currentSession.questions.length - 1;
  const isCorrect =
    currentSession.answers.find((a) => a.questionId === currentQuestion.id)?.isCorrect ||
    false;

  return (
    <ScrollView flex={1} bg="$background" padding="$4">
      <YStack gap="$4">
        {/* Progress */}
        <UICard tone="subtle">
          <Text fontSize="$4" color="$mutedForeground">
            Score: {currentSession.score} / {currentSession.answers.length}
          </Text>
        </UICard>

        {/* Question */}
        <QuestionCard
          question={currentQuestion}
          questionNumber={currentSession.currentQuestionIndex + 1}
          totalQuestions={currentSession.questions.length}
        />

        {/* Answer Options */}
        {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
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
            {/* TODO: Add text input for translation */}
            <Text fontSize="$4" color="$gray10">
              Translation input coming soon...
            </Text>
          </View>
        )}

        {/* Submit Button */}
        {!showFeedback && selectedAnswer && (
          <UIButton size="lg" onPress={handleSubmitAnswer} marginTop="$2">
            Submit Answer
          </UIButton>
        )}

        {/* Feedback */}
        {showFeedback && (
          <QuizFeedback
            isCorrect={isCorrect}
            correctAnswer={currentQuestion.correctAnswer}
            onContinue={handleContinue}
          />
        )}

        {/* Quiz Complete */}
        {currentSession.completed && (
          <UICard tone="primary" elevated marginTop="$4">
            <YStack gap="$3" alignItems="center">
              <Text fontSize="$8" fontWeight="700" color="$primaryForeground">
                Quiz Complete!
              </Text>
              <Text fontSize="$6" color="$primaryForeground" opacity={0.9}>
                Score: {currentSession.score} / {currentSession.questions.length}
              </Text>
              <UIButton size="md" variant="secondary" onPress={handleStartQuiz} marginTop="$2">
                Try Again
              </UIButton>
            </YStack>
          </UICard>
        )}
      </YStack>
    </ScrollView>
  );
}

