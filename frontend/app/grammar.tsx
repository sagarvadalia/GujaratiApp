import React, { useState } from 'react';
import { ScrollView, Text, View, YStack } from 'tamagui';

import { GrammarCard } from '../components/grammar/GrammarCard';
import { GrammarExercise } from '../components/grammar/GrammarExercise';
import { GrammarTip } from '../components/grammar/GrammarTip';
import { Button } from '../components/ui/button';
import { trpc } from '../utils/trpc';

export default function GrammarScreen() {
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);
  const [showExercise, setShowExercise] = useState(false);

  const { data: rules } = trpc.grammar.getAll.useQuery();
  const { data: tips } = trpc.grammar.getTips.useQuery({});

  const selectedRule = rules?.find((r) => r.id === selectedRuleId);

  const handleRuleSelect = (ruleId: string) => {
    setSelectedRuleId(ruleId);
    setShowExercise(false);
  };

  const handleExerciseComplete = (_correct: boolean) => {
    // Reset after a delay to show next exercise
    setTimeout(() => {
      setShowExercise(false);
    }, 2000);
  };

  if (selectedRule && showExercise) {
    return (
      <ScrollView flex={1} backgroundColor="$background" padding="$4">
        <YStack gap="$4">
          <Button variant="outline" onPress={() => setShowExercise(false)}>
            ← Back to Grammar Rule
          </Button>
          <GrammarExercise rule={selectedRule} onComplete={handleExerciseComplete} />
        </YStack>
      </ScrollView>
    );
  }

  if (selectedRule) {
    return (
      <ScrollView flex={1} backgroundColor="$background" padding="$4">
        <YStack gap="$4">
          <Button variant="outline" onPress={() => setSelectedRuleId(null)}>
            ← Back to All Rules
          </Button>
          <GrammarCard rule={selectedRule} />
          {tips && tips.filter((t) => t.ruleId === selectedRule.id).length > 0 && (
            <YStack gap="$2">
              {tips
                .filter((t) => t.ruleId === selectedRule.id)
                .map((tip) => (
                  <GrammarTip key={tip.id} tip={tip} />
                ))}
            </YStack>
          )}
          <Button size="lg" onPress={() => setShowExercise(true)}>
            Practice This Rule
          </Button>
        </YStack>
      </ScrollView>
    );
  }

  return (
    <ScrollView flex={1} backgroundColor="$background" padding="$4">
      <YStack gap="$4">
        <View>
          <Text fontSize="$9" fontWeight="700" color="$color" marginBottom="$2">
            Grammar Lessons
          </Text>
          <Text fontSize="$5" color="$mutedForeground">
            Learn Gujarati grammar rules and practice conjugations
          </Text>
        </View>

        {tips && tips.length > 0 && (
          <YStack gap="$2">
            <Text fontSize="$6" fontWeight="600" color="$color">
              Quick Tips
            </Text>
            {tips.slice(0, 3).map((tip) => (
              <GrammarTip key={tip.id} tip={tip} />
            ))}
          </YStack>
        )}

        <YStack gap="$3">
          <Text fontSize="$6" fontWeight="600" color="$color">
            Grammar Rules
          </Text>
          {rules?.map((rule) => (
            <View key={rule.id}>
              <GrammarCard rule={rule} showExamples={false} />
              <Button
                variant="outline"
                marginTop="$2"
                onPress={() => handleRuleSelect(rule.id)}
              >
                Learn More →
              </Button>
            </View>
          ))}
        </YStack>
      </YStack>
    </ScrollView>
  );
}

