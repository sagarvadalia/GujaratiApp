import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, View, YStack } from 'tamagui';

import { GrammarCard } from '../components/grammar/GrammarCard';
import { GrammarTip } from '../components/grammar/GrammarTip';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { trpc } from '../utils/trpc';

export default function LessonScreen() {
  const router = useRouter();
  const { skillId } = useLocalSearchParams<{ skillId: string }>();
  const [showGrammar, setShowGrammar] = useState(true);
  const [grammarRuleId, setGrammarRuleId] = useState<string | null>(null);

  const { data: skill } = trpc.path.getSkill.useQuery(
    { skillId: skillId ?? '' },
    { enabled: !!skillId }
  );

  const { data: grammarRules } = trpc.grammar.getAll.useQuery();
  const { data: tips } = trpc.grammar.getTips.useQuery({});

  // Find grammar rules related to this skill
  const relatedGrammarRules = grammarRules?.filter((rule) =>
    skill?.grammarRuleIds?.includes(rule.id)
  ) ?? [];

  const relatedTips = tips?.filter((tip) =>
    relatedGrammarRules.some((rule) => rule.id === tip.ruleId)
  ) ?? [];

  const selectedGrammarRule = grammarRules?.find((r) => r.id === grammarRuleId);

  if (!skill) {
    return (
      <View flex={1} justifyContent="center" alignItems="center" padding="$4">
        <Text color="$mutedForeground">Loading skill...</Text>
      </View>
    );
  }

  if (selectedGrammarRule) {
    return (
      <ScrollView flex={1} backgroundColor="$background" padding="$4">
        <YStack gap="$4">
          <Button variant="outline" onPress={() => setGrammarRuleId(null)}>
            ← Back to Lesson
          </Button>
          <GrammarCard rule={selectedGrammarRule} />
          <Button size="lg" onPress={() => {
            setGrammarRuleId(null);
            setShowGrammar(false);
            router.push('/learn');
          }}>
            Start Exercises
          </Button>
        </YStack>
      </ScrollView>
    );
  }

  if (showGrammar && relatedGrammarRules.length > 0) {
    return (
      <ScrollView flex={1} backgroundColor="$background" padding="$4">
        <YStack gap="$4">
          <Card padding="$4">
            <YStack gap="$2">
              <Text fontSize="$8" fontWeight="700" color="$color">
                {skill.name}
              </Text>
              <Text fontSize="$5" color="$mutedForeground">
                {skill.description}
              </Text>
            </YStack>
          </Card>

          {relatedTips.length > 0 && (
            <YStack gap="$2">
              <Text fontSize="$6" fontWeight="600" color="$color">
                Grammar Tips
              </Text>
              {relatedTips.map((tip) => (
                <GrammarTip key={tip.id} tip={tip} />
              ))}
            </YStack>
          )}

          <YStack gap="$3">
            <Text fontSize="$6" fontWeight="600" color="$color">
              Grammar Rules for This Skill
            </Text>
            {relatedGrammarRules.map((rule) => (
              <View key={rule.id}>
                <GrammarCard rule={rule} showExamples={false} />
                <Button
                  variant="outline"
                  marginTop="$2"
                  onPress={() => setGrammarRuleId(rule.id)}
                >
                  Learn More →
                </Button>
              </View>
            ))}
          </YStack>

          <Button
            size="lg"
            onPress={() => {
              setShowGrammar(false);
              router.push('/learn');
            }}
            marginTop="$4"
          >
            Start Exercises
          </Button>
        </YStack>
      </ScrollView>
    );
  }

  // Default: redirect to learn screen
  router.replace('/learn');
  return null;
}

