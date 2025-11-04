import { useAuth } from '@clerk/clerk-expo';
import React, { useEffect } from 'react';

import { AchievementList } from '../../components/achievements/AchievementList';
import { useProgressStore } from '../../store/progressStore';
import { trpc } from '../../utils/trpc';

export default function AchievementsScreen() {
  const { userId } = useAuth();
  const { level, wordsLearned, currentStreak } = useProgressStore();

  const { data: achievements } = trpc.achievements.getAll.useQuery();
  const { data: userAchievements } = trpc.achievements.getUserAchievements.useQuery(
    { userId: userId ?? '' },
    { enabled: !!userId }
  );
  const checkAchievementsMutation = trpc.achievements.checkAchievements.useMutation();
  const addXP = useProgressStore((state) => state.addXP);

  // Check achievements when progress changes
  useEffect(() => {
    if (userId && achievements) {
      checkAchievementsMutation.mutate(
        {
          userId,
          streak: currentStreak,
          vocabularyCount: wordsLearned,
          level,
        },
        {
          onSuccess: (data) => {
            // Award XP for newly unlocked achievements
            data.unlocked.forEach((achievement) => {
              addXP(achievement.points);
            });
          },
        }
      );
    }
  }, [userId, currentStreak, wordsLearned, level, achievements, addXP, checkAchievementsMutation]);

  if (!achievements || !userAchievements) {
    return null;
  }

  return (
    <AchievementList
      achievements={achievements}
      userAchievements={userAchievements}
      showProgress={true}
    />
  );
}

