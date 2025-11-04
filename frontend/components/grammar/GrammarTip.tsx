import React from 'react';
import { Text, View, XStack, YStack } from 'tamagui';

import type { GrammarTip as GrammarTipType } from '../../src/types/grammar';
import { Card } from '../ui/card';

interface GrammarTipProps {
  tip: GrammarTipType;
  onDismiss?: () => void;
}

export function GrammarTip({ tip }: GrammarTipProps) {
  return (
    <Card
      tone="primary"
      padding="$3"
      borderLeftWidth={4}
      borderLeftColor="$blue9"
      backgroundColor="$blue2"
    >
      <XStack gap="$2" alignItems="flex-start">
        <View
          backgroundColor="$blue9"
          borderRadius="$10"
          width={24}
          height={24}
          alignItems="center"
          justifyContent="center"
          marginTop="$1"
        >
          <Text fontSize="$3" color="white" fontWeight="700">
            💡
          </Text>
        </View>
        <YStack flex={1} gap="$1">
          <Text fontSize="$4" fontWeight="600" color="$blue11">
            Grammar Tip
          </Text>
          <Text fontSize="$4" color="$blue12" lineHeight="$1">
            {tip.tip}
          </Text>
        </YStack>
      </XStack>
    </Card>
  );
}

