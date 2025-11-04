import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type {
  Path,
  PathProgress,
  Skill,
  SkillProgress,
} from '../src/types/path';

interface PathState {
  path: Path | null;
  progress: PathProgress | null;
  currentSkill: Skill | null;
  setPath: (path: Path) => void;
  setProgress: (progress: PathProgress) => void;
  setCurrentSkill: (skill: Skill | null) => void;
  updateSkillProgress: (
    skillId: string,
    updates: Partial<SkillProgress>
  ) => void;
  getSkillProgress: (skillId: string) => SkillProgress | null;
  isSkillUnlocked: (skillId: string) => boolean;
  getNextUnlockedSkill: () => Skill | null;
}

export const usePathStore = create<PathState>()(
  persist(
    (set, get) => ({
      path: null,
      progress: null,
      currentSkill: null,
      setPath: (path) => set({ path }),
      setProgress: (progress) => set({ progress }),
      setCurrentSkill: (skill) => set({ currentSkill: skill }),
      updateSkillProgress: (skillId, updates) => {
        const state = get();
        if (!state.progress) return;

        const newProgress = { ...state.progress };
        for (const unitProgress of newProgress.unitsProgress) {
          for (const lessonProgress of unitProgress.lessonsProgress) {
            const skillProgress = lessonProgress.skillsProgress.find(
              (s) => s.skillId === skillId
            );
            if (skillProgress) {
              Object.assign(skillProgress, updates);
              set({ progress: newProgress });
              return;
            }
          }
        }
      },
      getSkillProgress: (skillId) => {
        const state = get();
        if (!state.progress) return null;

        for (const unitProgress of state.progress.unitsProgress) {
          for (const lessonProgress of unitProgress.lessonsProgress) {
            const skillProgress = lessonProgress.skillsProgress.find(
              (s) => s.skillId === skillId
            );
            if (skillProgress) return skillProgress;
          }
        }
        return null;
      },
      isSkillUnlocked: (skillId) => {
        const skillProgress = get().getSkillProgress(skillId);
        return skillProgress ? !skillProgress.isLocked : false;
      },
      getNextUnlockedSkill: () => {
        const state = get();
        if (!state.path || !state.progress) return null;

        for (const unit of state.path.units) {
          for (const lesson of unit.lessons) {
            for (const skill of lesson.skills) {
              const skillProgress = state.getSkillProgress(skill.id);
              if (skillProgress && !skillProgress.isLocked && !skillProgress.completed) {
                return skill;
              }
            }
          }
        }
        return null;
      },
    }),
    {
      name: 'path-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

