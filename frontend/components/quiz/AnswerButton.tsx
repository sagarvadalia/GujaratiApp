import React from 'react';
import { useTheme as useTamaguiTheme } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { Button as UIButton, ButtonProps } from '../ui/button';

interface AnswerButtonProps {
  answer: string;
  onPress: () => void;
  isSelected?: boolean;
  isCorrect?: boolean;
  showFeedback?: boolean;
}

export function AnswerButton({
  answer,
  onPress,
  isSelected,
  isCorrect,
  showFeedback,
}: AnswerButtonProps) {
  const theme = useTamaguiTheme();

  const getVariant = (): ButtonProps['variant'] => {
    if (showFeedback) {
      if (isCorrect) return 'success';
      if (isSelected) return 'destructive';
      return 'outline';
    }

    return isSelected ? 'default' : 'outline';
  };

  const icon = (() => {
    if (!showFeedback) return undefined;
    if (isCorrect) {
      return (
        <Ionicons
          name="checkmark-circle"
          size={20}
          color={theme.successForeground?.val || '#022C22'}
        />
      );
    }
    if (isSelected && !isCorrect) {
      return (
        <Ionicons
          name="close-circle"
          size={20}
          color={theme.destructiveForeground?.val || '#F8FAFC'}
        />
      );
    }
    return undefined;
  })();

  return (
    <UIButton
      size="md"
      variant={getVariant()}
      onPress={onPress}
      disabled={showFeedback}
      icon={icon}
      iconAfter={false}
      fontWeight={isSelected ? '700' : '500'}
    >
      {answer}
    </UIButton>
  );
}

