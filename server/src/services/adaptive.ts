/**
 * Adaptive Difficulty Service
 * Adjusts exercise difficulty based on user performance
 */

import { prisma } from '../db/client';

export interface UserPerformance {
  userId: string;
  skillId: string;
  vocabularyId?: string;
  totalAttempts: number;
  correctAttempts: number;
  averageTime: number; // Average time to complete exercise in seconds
  lastUpdated: Date;
}

export interface DifficultyAdjustment {
  recommendedDifficulty: number; // 1-5
  confidence: number; // 0-1, how confident we are in this difficulty
  shouldSkip: boolean; // Whether user has mastered this content
}

export class AdaptiveDifficultyService {
  /**
   * Record an exercise attempt
   */
  async recordAttempt(
    userId: string,
    skillId: string,
    correct: boolean,
    timeSpent: number,
    vocabularyId?: string
  ): Promise<void> {
    const existing = await prisma.userPerformance.findUnique({
      where: {
        userId_skillId_vocabularyId: {
          userId,
          skillId,
          vocabularyId: vocabularyId ?? '',
        },
      },
    });

    if (existing) {
      const newTotal = existing.totalAttempts + 1;
      const newCorrect = existing.correctAttempts + (correct ? 1 : 0);
      const newAverageTime =
        (existing.averageTime * existing.totalAttempts + timeSpent) / newTotal;

      await prisma.userPerformance.update({
        where: {
          userId_skillId_vocabularyId: {
            userId,
            skillId,
            vocabularyId: vocabularyId ?? '',
          },
        },
        data: {
          totalAttempts: newTotal,
          correctAttempts: newCorrect,
          averageTime: newAverageTime,
          lastUpdated: new Date(),
        },
      });
    } else {
      await prisma.userPerformance.create({
        data: {
          userId,
          skillId,
          vocabularyId: vocabularyId ?? '',
          totalAttempts: 1,
          correctAttempts: correct ? 1 : 0,
          averageTime: timeSpent,
        },
      });
    }
  }

  /**
   * Get user performance for a skill
   */
  async getPerformance(
    userId: string,
    skillId: string,
    vocabularyId?: string
  ): Promise<UserPerformance | null> {
    const performance = await prisma.userPerformance.findUnique({
      where: {
        userId_skillId_vocabularyId: {
          userId,
          skillId,
          vocabularyId: vocabularyId ?? '',
        },
      },
    });

    if (!performance) return null;

      return {
        userId: performance.userId,
        skillId: performance.skillId,
        vocabularyId: performance.vocabularyId && performance.vocabularyId !== '' ? performance.vocabularyId : undefined,
        totalAttempts: performance.totalAttempts,
        correctAttempts: performance.correctAttempts,
        averageTime: performance.averageTime,
        lastUpdated: performance.lastUpdated,
      };
  }

  /**
   * Calculate recommended difficulty based on performance
   */
  async calculateDifficulty(
    userId: string,
    skillId: string,
    baseDifficulty: number,
    vocabularyId?: string
  ): Promise<DifficultyAdjustment> {
    const performance = await this.getPerformance(userId, skillId, vocabularyId);

    // If no performance data, use base difficulty
    if (!performance || performance.totalAttempts < 3) {
      return {
        recommendedDifficulty: baseDifficulty,
        confidence: 0.3,
        shouldSkip: false,
      };
    }

    const accuracy = performance.correctAttempts / performance.totalAttempts;
    const avgTime = performance.averageTime;

    // Calculate recommended difficulty
    let recommendedDifficulty = baseDifficulty;
    let shouldSkip = false;

    // High accuracy (>85%) and fast completion (<10s) -> increase difficulty or skip
    if (accuracy >= 0.85 && avgTime < 10) {
      if (performance.totalAttempts >= 5) {
        // User has mastered this - suggest skipping
        shouldSkip = true;
        recommendedDifficulty = Math.min(5, baseDifficulty + 1);
      } else {
        // Increase difficulty
        recommendedDifficulty = Math.min(5, baseDifficulty + 1);
      }
    }
    // High accuracy (>75%) -> slight increase
    else if (accuracy >= 0.75) {
      recommendedDifficulty = Math.min(5, baseDifficulty + 0.5);
    }
    // Medium accuracy (50-75%) -> keep same difficulty
    else if (accuracy >= 0.5) {
      recommendedDifficulty = baseDifficulty;
    }
    // Low accuracy (<50%) -> decrease difficulty
    else {
      recommendedDifficulty = Math.max(1, baseDifficulty - 1);
    }

    // Confidence increases with more attempts
    const confidence = Math.min(1, performance.totalAttempts / 10);

    return {
      recommendedDifficulty: Math.round(recommendedDifficulty * 2) / 2, // Round to 0.5
      confidence,
      shouldSkip,
    };
  }

  /**
   * Get vocabulary items that need extra practice (low accuracy)
   */
  async getWeakAreas(userId: string, skillId: string): Promise<string[]> {
      const performances = await prisma.userPerformance.findMany({
        where: {
          userId,
          skillId,
          vocabularyId: { not: '' },
        },
      });

    const weakAreas: string[] = [];

    for (const performance of performances) {
      if (performance.vocabularyId) {
        const accuracy = performance.correctAttempts / performance.totalAttempts;
        if (accuracy < 0.6 && performance.totalAttempts >= 3) {
          weakAreas.push(performance.vocabularyId);
        }
      }
    }

    return weakAreas;
  }

  /**
   * Check if user should review a skill (based on mastery decay)
   */
  async shouldReviewSkill(
    userId: string,
    skillId: string,
    daysSinceLastReview: number
  ): Promise<boolean> {
    const performance = await this.getPerformance(userId, skillId);

    if (!performance) return false;

    const accuracy = performance.correctAttempts / performance.totalAttempts;

    // If user had high accuracy, they might need review after some time
    if (accuracy >= 0.8) {
      // Review after 7 days for high performers
      return daysSinceLastReview >= 7;
    } else if (accuracy >= 0.6) {
      // Review after 3 days for medium performers
      return daysSinceLastReview >= 3;
    } else {
      // Review daily for low performers
      return daysSinceLastReview >= 1;
    }
  }

  /**
   * Get personalized learning speed (multiplier for difficulty progression)
   */
  async getLearningSpeed(userId: string, skillId: string): Promise<number> {
    const performance = await this.getPerformance(userId, skillId);

    if (!performance || performance.totalAttempts < 5) {
      return 1.0; // Default speed
    }

    const accuracy = performance.correctAttempts / performance.totalAttempts;
    const avgTime = performance.averageTime;

    // Fast learners: high accuracy + fast completion
    if (accuracy >= 0.85 && avgTime < 8) {
      return 1.5; // Progress 50% faster
    }
    // Slow learners: low accuracy or slow completion
    else if (accuracy < 0.6 || avgTime > 20) {
      return 0.7; // Progress 30% slower
    }

    return 1.0; // Normal speed
  }
}

export const adaptiveDifficultyService = new AdaptiveDifficultyService();
