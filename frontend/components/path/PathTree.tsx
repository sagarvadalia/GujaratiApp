import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, View, XStack, YStack } from 'tamagui';

import type { Path, PathProgress, Skill, Unit } from '../../src/types/path';
import { Card } from '../ui';
import { SkillIcon } from './SkillIcon';

interface PathTreeProps {
  path: Path;
  progress: PathProgress;
  onSkillPress: (skill: Skill) => void;
}

export function PathTree({ path, progress, onSkillPress }: PathTreeProps) {
  const getSkillProgress = (skillId: string) => {
    for (const unitProgress of progress.unitsProgress) {
      for (const lessonProgress of unitProgress.lessonsProgress) {
        const skillProgress = lessonProgress.skillsProgress.find(
          (s) => s.skillId === skillId
        );
        if (skillProgress) return skillProgress;
      }
    }
    return undefined;
  };

  const renderUnit = (unit: Unit, unitIndex: number) => {
    const unitProgress = progress.unitsProgress.find(
      (up) => up.unitId === unit.id
    );
    const isUnitCompleted = unitProgress?.completed ?? false;

    return (
      <View key={unit.id} marginBottom="$6">
        <Card tone="subtle" elevated padding="$4" marginBottom="$3">
          <XStack alignItems="center" gap="$3">
            <View
              backgroundColor={isUnitCompleted ? '$accent' : '$primary'}
              borderRadius="$6"
              width={40}
              height={40}
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="$6" fontWeight="700" color="$primaryForeground">
                {unitIndex + 1}
              </Text>
            </View>
            <YStack flex={1}>
              <Text fontSize="$6" fontWeight="700" color="$foreground">
                {unit.name}
              </Text>
              <Text fontSize="$3" color="$mutedForeground">
                {unit.description}
              </Text>
            </YStack>
            {isUnitCompleted && (
              <Ionicons name="checkmark-circle" size={24} color="$accent" />
            )}
          </XStack>
        </Card>

        {unit.lessons.map((lesson, _lessonIndex) => {
          const lessonProgress = unitProgress?.lessonsProgress.find(
            (lp) => lp.lessonId === lesson.id
          );
          const isLessonCompleted = lessonProgress?.completed ?? false;

          return (
            <View key={lesson.id} marginLeft="$4" marginBottom="$4">
              <Card tone="subtle" padding="$3" marginBottom="$2">
                <XStack alignItems="center" gap="$2">
                  <Ionicons
                    name={isLessonCompleted ? 'checkmark-circle' : 'book-outline'}
                    size={20}
                    color={isLessonCompleted ? '$accent' : '$mutedForeground'}
                  />
                  <Text fontSize="$5" fontWeight="600" color="$foreground">
                    {lesson.name}
                  </Text>
                </XStack>
              </Card>

              <XStack gap="$2" flexWrap="wrap" marginTop="$2">
                {lesson.skills.map((skill) => {
                  const skillProgress = getSkillProgress(skill.id);
                  const isCurrent =
                    progress.currentSkillId === skill.id &&
                    progress.currentLessonId === lesson.id &&
                    progress.currentUnitId === unit.id;

                  return (
                    <SkillIcon
                      key={skill.id}
                      skill={skill}
                      progress={skillProgress}
                      onPress={() => onSkillPress(skill)}
                      isCurrent={isCurrent}
                    />
                  );
                })}
              </XStack>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <ScrollView flex={1} padding="$4">
      <YStack gap="$4">
        <Card tone="primary" elevated padding="$4">
          <YStack gap="$2">
            <Text fontSize="$8" fontWeight="700" color="$primaryForeground">
              {path.name}
            </Text>
            <Text fontSize="$4" color="$primaryForeground" opacity={0.9}>
              {path.description}
            </Text>
            <XStack gap="$4" marginTop="$2">
              <YStack alignItems="center">
                <Text fontSize="$6" fontWeight="700" color="$primaryForeground">
                  {progress.totalCrowns}
                </Text>
                <Text fontSize="$2" color="$primaryForeground" opacity={0.8}>
                  Crowns
                </Text>
              </YStack>
              <YStack alignItems="center">
                <Text fontSize="$6" fontWeight="700" color="$primaryForeground">
                  {progress.totalXP}
                </Text>
                <Text fontSize="$2" color="$primaryForeground" opacity={0.8}>
                  XP
                </Text>
              </YStack>
            </XStack>
          </YStack>
        </Card>

        {path.units.map((unit, index) => renderUnit(unit, index))}
      </YStack>
    </ScrollView>
  );
}

