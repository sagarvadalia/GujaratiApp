import React from 'react';
import { ScrollView, Text, View, XStack, YStack } from 'tamagui';

import type { GrammarExample, GrammarRule } from '../../src/types/grammar';
import { Card } from '../ui/card';
import { AudioPlayer } from '../vocabulary/AudioPlayer';

interface GrammarCardProps {
  rule: GrammarRule;
  showExamples?: boolean;
}

export function GrammarCard({ rule, showExamples = true }: GrammarCardProps) {
  return (
    <Card elevated padding="$4">
      <YStack gap="$3">
        <YStack gap="$2">
          <XStack alignItems="center" gap="$2">
            <Text fontSize="$7" fontWeight="700" color="$color">
              {rule.title}
            </Text>
            <View
              backgroundColor="$blue5"
              paddingHorizontal="$2"
              paddingVertical="$1"
              borderRadius="$2"
            >
              <Text fontSize="$2" color="$blue11" fontWeight="600">
                {rule.category}
              </Text>
            </View>
          </XStack>
          <Text fontSize="$4" color="$mutedForeground">
            {rule.description}
          </Text>
        </YStack>

        <View
          backgroundColor="$gray3"
          padding="$3"
          borderRadius="$3"
          borderLeftWidth={3}
          borderLeftColor="$blue9"
        >
          <Text fontSize="$4" color="$color" lineHeight="$1">
            {rule.explanation}
          </Text>
        </View>

        {showExamples && rule.examples.length > 0 && (
          <YStack gap="$2">
            <Text fontSize="$5" fontWeight="600" color="$color">
              Examples:
            </Text>
            <YStack gap="$2">
              {rule.examples.map((example, index) => (
                <ExampleCard key={index} example={example} />
              ))}
            </YStack>
          </YStack>
        )}

        {rule.conjugationPatterns && rule.conjugationPatterns.length > 0 && (
          <YStack gap="$2">
            <Text fontSize="$5" fontWeight="600" color="$color">
              Conjugation Patterns:
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <XStack gap="$2">
                {rule.conjugationPatterns.map((pattern, index) => (
                  <ConjugationTable
                    key={index}
                    tense={pattern.tense}
                    person={pattern.person}
                    forms={pattern.forms}
                  />
                ))}
              </XStack>
            </ScrollView>
          </YStack>
        )}
      </YStack>
    </Card>
  );
}

function ExampleCard({ example }: { example: GrammarExample }) {
  return (
    <View
      backgroundColor="$gray2"
      padding="$3"
      borderRadius="$2"
      borderWidth={1}
      borderColor="$gray6"
    >
      <YStack gap="$1">
        <XStack alignItems="center" gap="$2" justifyContent="space-between">
          <Text fontSize="$6" fontWeight="600" color="$color" flex={1}>
            {example.gujarati}
          </Text>
          <AudioPlayer gujaratiText={example.gujarati} />
        </XStack>
        <Text fontSize="$4" color="$blue10" fontStyle="italic">
          {example.transliteration}
        </Text>
        <Text fontSize="$4" color="$mutedForeground">
          {example.english}
        </Text>
      </YStack>
    </View>
  );
}

function ConjugationTable({
  tense,
  person,
  forms,
}: {
  tense: string;
  person: string;
  forms: {
    person: string;
    number: string;
    form: string;
    transliteration: string;
    example?: string;
  }[];
}) {
  return (
    <View
      backgroundColor="$gray2"
      padding="$3"
      borderRadius="$3"
      minWidth={200}
      borderWidth={1}
      borderColor="$gray6"
    >
      <YStack gap="$2">
        <Text fontSize="$5" fontWeight="600" color="$color">
          {tense} - {person}
        </Text>
        <YStack gap="$1">
          {forms.map((form, index) => (
            <View key={index} padding="$2" backgroundColor="$gray1" borderRadius="$2">
              <Text fontSize="$4" fontWeight="500" color="$color">
                {form.form}
              </Text>
              <Text fontSize="$3" color="$blue10" fontStyle="italic">
                {form.transliteration}
              </Text>
              {form.example && (
                <Text fontSize="$3" color="$mutedForeground" marginTop="$1">
                  {form.example}
                </Text>
              )}
            </View>
          ))}
        </YStack>
      </YStack>
    </View>
  );
}

