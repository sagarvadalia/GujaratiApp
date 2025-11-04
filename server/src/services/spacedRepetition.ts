/**
 * Spaced Repetition System (SM-2 Algorithm)
 * Based on SuperMemo 2 algorithm for optimal review scheduling
 */

export interface SRSData {
  vocabularyId: string;
  easeFactor: number; // Starting at 2.5, adjusts based on performance
  interval: number; // Days until next review
  repetitions: number; // Number of successful reviews
  lastReview: Date;
  nextReview: Date;
  quality: number; // 0-5 (last quality score)
}

export type QualityScore = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * SM-2 Algorithm implementation
 * Quality scores:
 * 5: Perfect response
 * 4: Correct response after hesitation
 * 3: Correct response with serious difficulty
 * 2: Incorrect response; correct one remembered
 * 1: Incorrect response; correct one seemed familiar
 * 0: Complete blackout
 */
export class SpacedRepetitionService {
  /**
   * Calculate next review date and update SRS data based on quality score
   */
  calculateNextReview(srsData: SRSData, quality: QualityScore): SRSData {
    let { easeFactor, interval, repetitions } = srsData;

    // Update ease factor based on quality
    easeFactor = Math.max(
      1.3,
      easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    );

    if (quality < 3) {
      // If quality is less than 3, reset repetitions
      repetitions = 0;
      interval = 1; // Review again tomorrow
    } else {
      // Increase repetitions
      repetitions += 1;

      // Calculate new interval
      if (repetitions === 1) {
        interval = 1; // Review tomorrow
      } else if (repetitions === 2) {
        interval = 6; // Review in 6 days
      } else {
        interval = Math.round(interval * easeFactor);
      }
    }

    // Calculate next review date
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + interval);

    return {
      ...srsData,
      easeFactor,
      interval,
      repetitions,
      quality,
      lastReview: new Date(),
      nextReview,
    };
  }

  /**
   * Initialize SRS data for a new vocabulary item
   */
  initializeSRSData(vocabularyId: string): SRSData {
    const now = new Date();
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + 1); // Review tomorrow

    return {
      vocabularyId,
      easeFactor: 2.5,
      interval: 1,
      repetitions: 0,
      lastReview: now,
      nextReview,
      quality: 0,
    };
  }

  /**
   * Get vocabulary items due for review
   */
  getDueItems(
    allSRSData: SRSData[],
    limit?: number
  ): SRSData[] {
    const now = new Date();
    const dueItems = allSRSData.filter(
      (item) => new Date(item.nextReview) <= now
    );

    // Sort by priority (items that are overdue longer have higher priority)
    dueItems.sort((a, b) => {
      const aOverdue = now.getTime() - new Date(a.nextReview).getTime();
      const bOverdue = now.getTime() - new Date(b.nextReview).getTime();
      return bOverdue - aOverdue;
    });

    return limit ? dueItems.slice(0, limit) : dueItems;
  }

  /**
   * Get weak words (low ease factor or overdue)
   */
  getWeakWords(allSRSData: SRSData[]): SRSData[] {
    const now = new Date();
    return allSRSData
      .filter(
        (item) =>
          item.easeFactor < 2.0 ||
          (new Date(item.nextReview) <= now && item.interval > 7)
      )
      .sort((a, b) => a.easeFactor - b.easeFactor);
  }

  /**
   * Calculate mastery level (0-100) based on SRS data
   */
  calculateMasteryLevel(srsData: SRSData): number {
    // Mastery is based on ease factor, repetitions, and how recent the review was
    const easeScore = Math.min(100, (srsData.easeFactor / 2.5) * 100);
    const repetitionScore = Math.min(100, (srsData.repetitions / 10) * 100);
    const recencyBonus =
      srsData.repetitions > 0 && srsData.interval > 7 ? 10 : 0;

    return Math.min(100, Math.round((easeScore + repetitionScore) / 2 + recencyBonus));
  }
}

export const spacedRepetitionService = new SpacedRepetitionService();

