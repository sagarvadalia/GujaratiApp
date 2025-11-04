import { z } from 'zod';

import { prisma } from '../db/client';
import type { Lesson, Path, PathProgress, Skill, Unit } from '../types/path';
import { publicProcedure, router } from './_app';

// Helper functions to transform Prisma data
function transformSkill(skill: any): Skill {
  return {
    id: skill.id,
    name: skill.name,
    description: skill.description,
    vocabularyIds: skill.vocabularyIds,
    grammarRuleIds: skill.grammarRuleIds,
    difficulty: skill.difficulty,
    xpReward: skill.xpReward,
    prerequisites: skill.prerequisites,
    unitId: skill.lesson.unitId,
    lessonId: skill.lessonId,
    order: skill.order,
  };
}

function transformLesson(lesson: any): Lesson {
  return {
    id: lesson.id,
    name: lesson.name,
    description: lesson.description,
    unitId: lesson.unitId,
    order: lesson.order,
    skills: lesson.skills.map(transformSkill),
  };
}

function transformUnit(unit: any): Unit {
  return {
    id: unit.id,
    name: unit.name,
    description: unit.description,
    order: unit.order,
    lessons: unit.lessons.map(transformLesson),
  };
}

// In-memory storage for path progress (can be migrated to database later)
const pathProgressData: Map<string, PathProgress> = new Map();

const initializePathProgress = (userId: string): PathProgress => {
  // This will be populated from database units/lessons/skills
  const progress: PathProgress = {
    userId,
    pathId: 'main-path',
    unitsProgress: [],
    totalCrowns: 0,
    totalXP: 0,
  };
  return progress;
};

export const pathRouter = router({
  getPath: publicProcedure.query(async () => {
    const units = await prisma.unit.findMany({
      include: {
        lessons: {
          include: {
            skills: {
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    });

    const transformedUnits = units.map(transformUnit);
    const totalXP = transformedUnits.reduce(
      (sum, unit) =>
        sum +
        unit.lessons.reduce(
          (lessonSum, lesson) =>
            lessonSum + lesson.skills.reduce((skillSum, skill) => skillSum + skill.xpReward, 0),
          0
        ),
      0
    );

    const path: Path = {
      id: 'main-path',
      name: 'Gujarati Learning Path',
      description: 'Complete path to learn Gujarati',
      units: transformedUnits,
      totalXP,
    };

    return path;
  }),

  getProgress: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      let progress = pathProgressData.get(input.userId);
      if (!progress) {
        progress = initializePathProgress(input.userId);
        pathProgressData.set(input.userId, progress);
      }
      return progress;
    }),

  getSkill: publicProcedure
    .input(z.object({ skillId: z.string() }))
    .query(async ({ input }) => {
      const skill = await prisma.skill.findUnique({
        where: { id: input.skillId },
        include: {
          lesson: {
            include: {
              unit: true,
            },
          },
        },
      });
      return skill ? transformSkill(skill) : null;
    }),

  updateSkillProgress: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        skillId: z.string(),
        crowns: z.number().min(0).max(5).optional(),
        masteryLevel: z.number().min(0).max(100).optional(),
        completed: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      let progress = pathProgressData.get(input.userId);
      if (!progress) {
        progress = initializePathProgress(input.userId);
        pathProgressData.set(input.userId, progress);
      }

      // Find and update skill progress
      for (const unitProgress of progress.unitsProgress) {
        for (const lessonProgress of unitProgress.lessonsProgress) {
          const skillProgress = lessonProgress.skillsProgress.find(
            (s) => s.skillId === input.skillId
          );
          if (skillProgress) {
            if (input.crowns !== undefined) {
              skillProgress.crowns = input.crowns;
              progress.totalCrowns = progress.unitsProgress.reduce(
                (sum, up) =>
                  sum +
                  up.lessonsProgress.reduce(
                    (lessonSum, lp) =>
                      lessonSum +
                      lp.skillsProgress.reduce((skillSum, sp) => skillSum + sp.crowns, 0),
                    0
                  ),
                0
              );
            }
            if (input.masteryLevel !== undefined) {
              skillProgress.masteryLevel = input.masteryLevel;
            }
            if (input.completed !== undefined) {
              skillProgress.completed = input.completed;
              skillProgress.lastPracticed = new Date();
            }

            const allSkillsCompleted = lessonProgress.skillsProgress.every((s) => s.completed);
            if (allSkillsCompleted) {
              lessonProgress.completed = true;
              lessonProgress.completedAt = new Date();
            }

            const allLessonsCompleted = unitProgress.lessonsProgress.every((l) => l.completed);
            if (allLessonsCompleted) {
              unitProgress.completed = true;
            }

            pathProgressData.set(input.userId, progress);
            return progress;
          }
        }
      }

      return progress;
    }),
});
