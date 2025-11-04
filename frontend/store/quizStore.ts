import { create } from 'zustand';

import { type QuizQuestion, type QuizSession } from '../src/types/quiz';

interface QuizState {
  currentSession: QuizSession | null;
  history: QuizSession[];
  startQuiz: (questions: QuizQuestion[]) => void;
  answerQuestion: (questionId: string, answer: string, isCorrect: boolean) => void;
  nextQuestion: () => void;
  completeQuiz: () => void;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  currentSession: null,
  history: [],
  startQuiz: (questions) =>
    set({
      currentSession: {
        id: Date.now().toString(),
        questions,
        currentQuestionIndex: 0,
        answers: [],
        score: 0,
        completed: false,
      },
    }),
  answerQuestion: (questionId, answer, isCorrect) => {
    const session = get().currentSession;
    if (!session) return;

    const newAnswers = [
      ...session.answers,
      { questionId, answer, isCorrect },
    ];

    set({
      currentSession: {
        ...session,
        answers: newAnswers,
        score: newAnswers.filter((a) => a.isCorrect).length,
      },
    });
  },
  nextQuestion: () => {
    const session = get().currentSession;
    if (!session) return;

    if (session.currentQuestionIndex < session.questions.length - 1) {
      set({
        currentSession: {
          ...session,
          currentQuestionIndex: session.currentQuestionIndex + 1,
        },
      });
    }
  },
  completeQuiz: () => {
    const session = get().currentSession;
    if (!session) return;

    const completedSession = {
      ...session,
      completed: true,
    };

    set({
      currentSession: null,
      history: [...get().history, completedSession],
    });
  },
  resetQuiz: () => set({ currentSession: null }),
}));

