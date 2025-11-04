import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage,persist } from 'zustand/middleware';

import { type UserProgress } from '../src/types/progress';
import type { Category } from '../src/types/vocabulary';

interface ProgressState extends UserProgress {
  updateWordsLearned: (count: number) => void;
  incrementDailyProgress: () => void;
  updateStreak: () => void;
  updateAccuracy: (correct: number, total: number) => void;
  completeCategory: (category: Category) => void;
  resetDailyProgress: () => void;
  setDailyGoal: (goal: number) => void;
  addXP: (amount: number) => { leveledUp: boolean; previousLevel: number };
  getXPForLevel: (level: number) => number;
  getXPForNextLevel: () => number;
  getXPProgress: () => number; // 0-100 percentage to next level
  loseHeart: () => void;
  regenerateHearts: () => void;
  restoreAllHearts: () => void;
  earnHeart: () => void; // Earn one heart (for practice mode)
  getTimeUntilNextHeart: () => number; // milliseconds until next heart regenerates
  hasHearts: () => boolean;
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
  xp: 0,
  level: 1,
  totalCrowns: 0,
  hearts: 5,
  maxHearts: 5,
  lastHeartRegen: new Date(),
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
      addXP: (amount) => {
        const state = get();
        const calculateXPForLevel = (level: number): number => {
          if (level === 1) return 0;
          return Math.floor(50 * Math.pow(level - 1, 1.5));
        };

        const newXP = state.xp + amount;
        let newLevel = state.level;
        let xpForNextLevel = calculateXPForLevel(newLevel + 1);

        while (newXP >= xpForNextLevel && newLevel < 100) {
          newLevel++;
          xpForNextLevel = calculateXPForLevel(newLevel + 1);
        }

        const leveledUp = newLevel > state.level;
        const previousLevel = state.level;

        set({
          xp: newXP,
          level: newLevel,
        });

        return { leveledUp, previousLevel };
      },
      getXPForLevel: (level) => {
        if (level === 1) return 0;
        return Math.floor(50 * Math.pow(level - 1, 1.5));
      },
      getXPForNextLevel: () => {
        const state = get();
        const nextLevel = state.level + 1;
        return state.getXPForLevel(nextLevel);
      },
      getXPProgress: () => {
        const state = get();
        const currentLevelXP = state.getXPForLevel(state.level);
        const nextLevelXP = state.getXPForNextLevel();
        const xpInCurrentLevel = state.xp - currentLevelXP;
        const xpNeededForNextLevel = nextLevelXP - currentLevelXP;
        
        if (xpNeededForNextLevel === 0) return 100;
        return Math.min(100, (xpInCurrentLevel / xpNeededForNextLevel) * 100);
      },
      loseHeart: () => {
        const state = get();
        set({
          hearts: Math.max(0, state.hearts - 1),
        });
      },
      regenerateHearts: () => {
        const state = get();
        const HEART_REGEN_INTERVAL_MS = 5 * 60 * 60 * 1000; // 5 hours
        const now = new Date();
        const lastRegen = new Date(state.lastHeartRegen);
        const timeSinceLastRegen = now.getTime() - lastRegen.getTime();
        const heartsToRegen = Math.floor(timeSinceLastRegen / HEART_REGEN_INTERVAL_MS);
        
        if (heartsToRegen > 0) {
          const newHearts = Math.min(state.maxHearts, state.hearts + heartsToRegen);
          const newLastRegen = new Date(lastRegen.getTime() + heartsToRegen * HEART_REGEN_INTERVAL_MS);
          set({
            hearts: newHearts,
            lastHeartRegen: newLastRegen,
          });
        }
      },
      restoreAllHearts: () => {
        const state = get();
        set({
          hearts: state.maxHearts,
          lastHeartRegen: new Date(),
        });
      },
      earnHeart: () => {
        const state = get();
        if (state.hearts < state.maxHearts) {
          set({
            hearts: Math.min(state.maxHearts, state.hearts + 1),
          });
        }
      },
      getTimeUntilNextHeart: () => {
        const state = get();
        if (state.hearts >= state.maxHearts) return 0;
        
        const HEART_REGEN_INTERVAL_MS = 5 * 60 * 60 * 1000; // 5 hours
        const now = new Date();
        const lastRegen = new Date(state.lastHeartRegen);
        const timeSinceLastRegen = now.getTime() - lastRegen.getTime();
        const timeUntilNext = HEART_REGEN_INTERVAL_MS - (timeSinceLastRegen % HEART_REGEN_INTERVAL_MS);
        
        return Math.max(0, timeUntilNext);
      },
      hasHearts: () => {
        const state = get();
        return state.hearts > 0;
      },
    }),
    {
      name: 'progress-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

