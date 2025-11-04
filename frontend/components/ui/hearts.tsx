import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Text, XStack } from 'tamagui';

import { useProgressStore } from '../../store/progressStore';

interface HeartsProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Hearts({ size = 'md', showText = true }: HeartsProps) {
  const { hearts, maxHearts, regenerateHearts, getTimeUntilNextHeart } = useProgressStore();
  const [timeUntilNext, setTimeUntilNext] = useState(0);

  useEffect(() => {
    // Regenerate hearts on mount and check periodically
    regenerateHearts();
    
    const interval = setInterval(() => {
      regenerateHearts();
      setTimeUntilNext(getTimeUntilNextHeart());
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [regenerateHearts, getTimeUntilNextHeart]);

  useEffect(() => {
    setTimeUntilNext(getTimeUntilNextHeart());
    const interval = setInterval(() => {
      setTimeUntilNext(getTimeUntilNextHeart());
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [getTimeUntilNextHeart]);

  const iconSize = size === 'sm' ? 16 : size === 'md' ? 20 : 24;
  const formatTime = (ms: number): string => {
    if (ms === 0) return '';
    const hours = Math.floor(ms / (60 * 60 * 1000));
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <XStack alignItems="center" gap="$2">
      {Array.from({ length: maxHearts }).map((_, index) => {
        const isFull = index < hearts;
        return (
          <Ionicons
            key={index}
            name={isFull ? 'heart' : 'heart-outline'}
            size={iconSize}
            color={isFull ? '$red10' : '$mutedForeground'}
          />
        );
      })}
      {showText && timeUntilNext > 0 && hearts < maxHearts && (
        <Text fontSize="$2" color="$mutedForeground">
          {formatTime(timeUntilNext)}
        </Text>
      )}
    </XStack>
  );
}

