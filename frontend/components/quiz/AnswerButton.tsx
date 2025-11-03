import React from 'react';
import { Button, Text } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

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
  const getButtonColor = () => {
    if (!showFeedback) {
      return isSelected ? '$blue10' : '$gray5';
    }
    if (isCorrect) {
      return '$green10';
    }
    if (isSelected && !isCorrect) {
      return '$red10';
    }
    return '$gray5';
  };

  const getIcon = () => {
    if (!showFeedback) return null;
    if (isCorrect) {
      return <Ionicons name="checkmark-circle" size={20} color="#fff" />;
    }
    if (isSelected && !isCorrect) {
      return <Ionicons name="close-circle" size={20} color="#fff" />;
    }
    return null;
  };

  return (
    <Button
      size="$5"
      backgroundColor={getButtonColor()}
      onPress={onPress}
      disabled={showFeedback}
      icon={getIcon()}
      iconAfter={false}
    >
      <Text
        fontSize="$5"
        fontWeight="500"
        color={showFeedback && (isCorrect || (isSelected && !isCorrect)) ? '#fff' : '$color'}
      >
        {answer}
      </Text>
    </Button>
  );
}

