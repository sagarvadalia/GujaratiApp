import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { View } from 'tamagui';

import { PathTree } from '../../components/path/PathTree';
import type { Skill } from '../../src/types/path';
import { usePathStore } from '../../store/pathStore';
import { trpc } from '../../utils/trpc';

export default function PathScreen() {
  const router = useRouter();
  const { userId } = useAuth();
  const { path, progress, setPath, setProgress, setCurrentSkill } = usePathStore();

  const { data: pathData } = trpc.path.getPath.useQuery();
  const { data: progressData } = trpc.path.getProgress.useQuery(
    { userId: userId ?? 'guest' },
    { enabled: !!userId }
  );

  useEffect(() => {
    if (pathData) {
      setPath(pathData);
    }
  }, [pathData, setPath]);

  useEffect(() => {
    if (progressData) {
      // Convert date strings back to Date objects for tRPC serialization
      const normalizedProgress = {
        ...progressData,
        unitsProgress: progressData.unitsProgress.map((up) => ({
          ...up,
          lessonsProgress: up.lessonsProgress.map((lp) => ({
            ...lp,
            completedAt: lp.completedAt ? new Date(lp.completedAt) : undefined,
            skillsProgress: lp.skillsProgress.map((sp) => ({
              ...sp,
              lastPracticed: new Date(sp.lastPracticed),
            })),
          })),
          completedAt: up.completedAt ? new Date(up.completedAt) : undefined,
        })),
      };
      setProgress(normalizedProgress);
    }
  }, [progressData, setProgress]);

  const handleSkillPress = (skill: Skill) => {
    setCurrentSkill(skill);
    // Navigate to lesson screen (will be created in next phase)
    router.push({
      pathname: '/lesson',
      params: { skillId: skill.id },
    });
  };

  if (!path || !progress) {
    return (
      <View flex={1} justifyContent="center" alignItems="center">
        {/* Loading state */}
      </View>
    );
  }

  return (
    <View flex={1} backgroundColor="$background">
      <PathTree path={path} progress={progress} onSkillPress={handleSkillPress} />
    </View>
  );
}

