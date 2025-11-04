import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useEffect } from "react";
import { Button, Text, View, YStack } from "tamagui";

interface QuizFeedbackProps {
  isCorrect: boolean;
  correctAnswer: string;
  explanation?: string;
  onContinue: () => void;
}

export function QuizFeedback({
  isCorrect,
  correctAnswer,
  explanation,
  onContinue,
}: QuizFeedbackProps) {
  useEffect(() => {
    if (isCorrect) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [isCorrect]);

  return (
    <View
      padding="$4"
      borderRadius="$4"
      backgroundColor={isCorrect ? "$green2" : "$red2"}
      borderWidth={2}
      borderColor={isCorrect ? "$green10" : "$red10"}
      marginTop="$4"
    >
      <YStack gap="$3" alignItems="center">
        <Ionicons
          name={isCorrect ? "checkmark-circle" : "close-circle"}
          size={48}
          color={isCorrect ? "#22c55e" : "#ef4444"}
        />

        <Text
          fontSize="$7"
          fontWeight="700"
          color={isCorrect ? "$green10" : "$red10"}
        >
          {isCorrect ? "Correct!" : "Incorrect"}
        </Text>

        {!isCorrect && (
          <Text fontSize="$5" color="$color" textAlign="center">
            Correct answer: <Text fontWeight="700">{correctAnswer}</Text>
          </Text>
        )}

        {explanation && (
          <Text fontSize="$4" color="$color" opacity={0.8} textAlign="center">
            {explanation}
          </Text>
        )}

        <Button
          size="$5"
          backgroundColor={isCorrect ? "$green10" : "$red10"}
          color="#fff"
          onPress={onContinue}
          marginTop="$2"
        >
          Continue
        </Button>
      </YStack>
    </View>
  );
}
