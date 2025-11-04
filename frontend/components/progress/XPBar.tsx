import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { AnimatePresence, Progress, Text, View, XStack, YStack } from 'tamagui';

import { useProgressStore } from '../../store/progressStore';
import { Card } from '../ui';

interface XPBarProps {
  showLevel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function XPBar({ showLevel = true, size = 'md' }: XPBarProps) {
  const { xp, level, getXPProgress, getXPForLevel, getXPForNextLevel } = useProgressStore();
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [previousLevel, setPreviousLevel] = useState(level);

  const progress = getXPProgress();
  const currentLevelXP = getXPForLevel(level);
  const nextLevelXP = getXPForNextLevel();
  const xpInCurrentLevel = xp - currentLevelXP;
  const xpNeeded = nextLevelXP - currentLevelXP;

  useEffect(() => {
    if (level > previousLevel) {
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 3000);
    }
    setPreviousLevel(level);
  }, [level, previousLevel]);

  const sizeStyles = {
    sm: { fontSize: '$3', iconSize: 16, barHeight: 6 },
    md: { fontSize: '$4', iconSize: 20, barHeight: 8 },
    lg: { fontSize: '$6', iconSize: 24, barHeight: 10 },
  };

  const styles = sizeStyles[size];

  return (
    <View>
      <Card tone="subtle" padding={size === 'sm' ? '$2' : '$3'}>
        <XStack alignItems="center" gap="$3">
          {showLevel && (
            <XStack alignItems="center" gap="$2">
              <Ionicons name="trophy" size={styles.iconSize} color="$primary" />
              <Text fontSize={styles.fontSize as any} fontWeight="700" color="$foreground">
                {level}
              </Text>
            </XStack>
          )}
          <YStack flex={1} gap="$1">
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize="$2" color="$mutedForeground">
                {xpInCurrentLevel} / {xpNeeded} XP
              </Text>
              <Text fontSize="$2" color="$mutedForeground">
                {Math.round(progress)}%
              </Text>
            </XStack>
            <Progress
              value={progress}
              max={100}
              backgroundColor="$muted"
              height={styles.barHeight}
              borderRadius="$2"
            >
              <Progress.Indicator
                animation="bouncy"
                backgroundColor="$primary"
                borderRadius="$2"
              />
            </Progress>
          </YStack>
        </XStack>
      </Card>

      <AnimatePresence>
        {showLevelUp && (
          <View
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            alignItems="center"
            justifyContent="center"
            zIndex={1000}
            pointerEvents="none"
          >
            <Card
              tone="primary"
              elevated
              padding="$6"
              animation="bouncy"
              enterStyle={{ scale: 0.5, opacity: 0 }}
              exitStyle={{ scale: 1.2, opacity: 0 }}
            >
              <YStack alignItems="center" gap="$3">
                <Ionicons name="trophy" size={64} color="$primaryForeground" />
                <Text fontSize="$10" fontWeight="700" color="$primaryForeground">
                  Level Up!
                </Text>
                <Text fontSize="$6" fontWeight="600" color="$primaryForeground">
                  Level {level}
                </Text>
              </YStack>
            </Card>
          </View>
        )}
      </AnimatePresence>
    </View>
  );
}

