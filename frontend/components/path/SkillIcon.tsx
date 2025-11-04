import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View, XStack, YStack } from 'tamagui';

import type { Skill, SkillProgress } from '../../src/types/path';
import { Card } from '../ui';

interface SkillIconProps {
  skill: Skill;
  progress?: SkillProgress;
  onPress?: () => void;
  isCurrent?: boolean;
}

export function SkillIcon({ skill, progress, onPress, isCurrent }: SkillIconProps) {
  const crowns = progress?.crowns ?? 0;
  const isLocked = progress?.isLocked ?? true;
  const isCompleted = progress?.completed ?? false;
  const masteryLevel = progress?.masteryLevel ?? 0;

  const getSkillColor = () => {
    if (isLocked) return '$mutedForeground';
    if (isCompleted && crowns >= 5) return '$accent';
    if (isCompleted) return '$primary';
    if (isCurrent) return '$primary';
    return '$color';
  };

  const getSkillBgColor = () => {
    if (isLocked) return '$muted';
    if (isCompleted && crowns >= 5) return '$green3';
    if (isCompleted) return '$blue3';
    if (isCurrent) return '$blue3';
    return '$background';
  };

  const renderStars = () => {
    return Array.from({ length: skill.difficulty }).map((_, i) => (
      <Ionicons key={i} name="star" size={8} color={getSkillColor()} />
    ));
  };

  const renderCrowns = () => {
    if (crowns === 0) return null;
    return (
      <XStack gap="$1" alignItems="center">
        {Array.from({ length: Math.min(crowns, 5) }).map((_, i) => (
          <Ionicons key={i} name="diamond" size={12} color="$accent" />
        ))}
      </XStack>
    );
  };

  return (
    <Card
      tone={isLocked ? 'subtle' : 'default'}
      elevated={!isLocked}
      interactive={!isLocked && !!onPress}
      onPress={!isLocked ? onPress : undefined}
      opacity={isLocked ? 0.5 : 1}
      padding="$3"
      minWidth={80}
      alignItems="center"
      borderWidth={isCurrent ? 2 : 1}
      borderColor={isCurrent ? '$primary' : '$border'}
    >
      <YStack gap="$1" alignItems="center">
        {isLocked ? (
          <Ionicons name="lock-closed" size={24} color={getSkillColor()} />
        ) : (
          <View
            backgroundColor={getSkillBgColor()}
            borderRadius="$6"
            width={48}
            height={48}
            alignItems="center"
            justifyContent="center"
          >
            <Ionicons name="book" size={24} color={getSkillColor()} />
          </View>
        )}
        <Text
          fontSize="$2"
          fontWeight={isCurrent ? '700' : '500'}
          color={getSkillColor()}
          textAlign="center"
          numberOfLines={2}
        >
          {skill.name}
        </Text>
        <XStack gap="$1" alignItems="center">
          {renderStars()}
        </XStack>
        {renderCrowns()}
        {masteryLevel > 0 && masteryLevel < 100 && (
          <Text fontSize="$1" color="$mutedForeground">
            {masteryLevel}%
          </Text>
        )}
      </YStack>
    </Card>
  );
}

