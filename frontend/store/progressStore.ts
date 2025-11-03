import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProgress } from '../src/types/progress';

interface ProgressState extends UserProgress {
  updateWordsLearned: (count: number) => void;
  incrementDailyProgress: () => void;
  updateStreak: () => void;
  updateAccuracy: (correct: number, total: number) => void;
  completeCategory: (category: string) => void;
  resetDailyProgress: () => void;
  setDailyGoal: (goal: number) => void;
}

const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const isToday = (date: Date) => {
  const today = getToday();
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  return today.getTime() === checkDate.getTime();
};

const getInitialState = (): UserProgress => ({
  userId: '',
  wordsLearned: 0,
  currentStreak: 0,
  longestStreak: 0,
  dailyGoal: 10,
  dailyProgress: 0,
  accuracyRate: 0,
  lastActiveDate: new Date(),
  completedCategories: [],
});

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...getInitialState(),
      updateWordsLearned: (count) =>
        set((state) => ({
          wordsLearned: Math.max(state.wordsLearned, count),
        })),
      incrementDailyProgress: () => {
        const state = get();
        const today = getToday();
        const lastActive = new Date(state.lastActiveDate);

        // Reset daily progress if it's a new day
        if (!isToday(lastActive)) {
          set({
            dailyProgress: 1,
            lastActiveDate: today,
          });
          return;
        }

        set((state) => ({
          dailyProgress: state.dailyProgress + 1,
          lastActiveDate: today,
        }));
      },
      updateStreak: () => {
        const state = get();
        const today = getToday();
        const lastActive = new Date(state.lastActiveDate);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);

        const lastActiveDate = new Date(lastActive);
        lastActiveDate.setHours(0, 0, 0, 0);

        if (isToday(lastActive)) {
          // Already updated today, no change
          return;
        }

        if (lastActiveDate.getTime() === yesterday.getTime()) {
          // Continuing streak
          set((state) => ({
            currentStreak: state.currentStreak + 1,
            longestStreak: Math.max(state.longestStreak, state.currentStreak + 1),
            lastActiveDate: today,
          }));
        } else {
          // Streak broken, start new streak
          set({
            currentStreak: 1,
            lastActiveDate: today,
          });
        }
      },
      updateAccuracy: (correct, total) => {
        const state = get();
        const newAccuracy = total > 0 ? (correct / total) * 100 : 0;
        const currentAccuracy = state.accuracyRate;
        const totalAnswers = state.wordsLearned || 1;

        // Weighted average
        const weightedAccuracy =
          (currentAccuracy * (totalAnswers - total) + newAccuracy * total) / totalAnswers;

        set({
          accuracyRate: Math.round(weightedAccuracy * 10) / 10,
        });
      },
      completeCategory: (category) =>
        set((state) => ({
          completedCategories: state.completedCategories.includes(category)
            ? state.completedCategories
            : [...state.completedCategories, category],
        })),
      resetDailyProgress: () =>
        set({
          dailyProgress: 0,
        }),
      setDailyGoal: (goal) =>
        set({
          dailyGoal: goal,
        }),
    }),
    {
      name: 'progress-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

