import { useAuth } from '@clerk/clerk-expo';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, View, XStack, YStack } from 'tamagui';

import { StoryExercises } from '../../components/stories/StoryExercises';
import { StoryReader } from '../../components/stories/StoryReader';
import { Card } from '../../components/ui';
import { useProgressStore } from '../../store/progressStore';
import { trpc } from '../../utils/trpc';

export default function StoriesScreen() {
  const { userId } = useAuth();
  const router = useRouter();
  const { storyId } = useLocalSearchParams<{ storyId?: string }>();
  const [showQuestions, setShowQuestions] = useState(false);
  const { addXP } = useProgressStore();

  const { data: stories } = trpc.story.getAll.useQuery();
  const { data: questions } = trpc.story.getComprehensionQuestions.useQuery(
    { storyId: storyId ?? '' },
    { enabled: !!storyId && showQuestions }
  );
  const recordProgressMutation = trpc.story.recordProgress.useMutation();

  const selectedStory = stories?.find((s) => s.id === storyId);

  const handleStoryComplete = () => {
    setShowQuestions(false);
  };

  const handleStartQuestions = () => {
    setShowQuestions(true);
  };

  const handleQuestionsComplete = async (score: number, totalPoints: number) => {
    if (!storyId || !userId) return;

    const comprehensionScore = (score / totalPoints) * 100;
    
    await recordProgressMutation.mutateAsync({
      userId,
      storyId,
      completed: true,
      comprehensionScore,
    });

    // Award XP
    if (selectedStory) {
      addXP(selectedStory.xpReward);
    }
  };

  if (storyId && selectedStory) {
    if (showQuestions && questions) {
      return (
        <StoryExercises
          questions={questions}
          onComplete={handleQuestionsComplete}
        />
      );
    }

    return (
      <StoryReader
        story={selectedStory}
        onComplete={handleStoryComplete}
        onStartQuestions={handleStartQuestions}
      />
    );
  }

  return (
    <ScrollView flex={1} backgroundColor="$background" padding="$4">
      <YStack gap="$4">
        <Card tone="primary" elevated padding="$4">
          <YStack gap="$2">
            <Text fontSize="$8" fontWeight="700" color="$primaryForeground">
              Stories
            </Text>
            <Text fontSize="$4" color="$mutedForeground">
              Read stories in Gujarati and test your comprehension
            </Text>
          </YStack>
        </Card>

        {!stories || stories.length === 0 ? (
          <Card padding="$4">
            <Text color="$mutedForeground" textAlign="center">
              No stories available yet. Check back soon!
            </Text>
          </Card>
        ) : (
          <YStack gap="$3">
            {stories.map((story) => (
              <Card
                key={story.id}
                elevated
                padding="$4"
                interactive
                onPress={() => router.push(`/(tabs)/stories?storyId=${story.id}`)}
              >
                <YStack gap="$2">
                  <Text fontSize="$6" fontWeight="700" color="$color">
                    {story.title}
                  </Text>
                  <Text fontSize="$4" color="$mutedForeground">
                    {story.description}
                  </Text>
                  <XStack gap="$2" alignItems="center" marginTop="$2">
                    <View
                      backgroundColor="$blue5"
                      paddingHorizontal="$2"
                      paddingVertical="$1"
                      borderRadius="$2"
                    >
                      <Text fontSize="$2" color="$blue11" fontWeight="600">
                        {'⭐'.repeat(story.difficulty)}
                      </Text>
                    </View>
                    <View
                      backgroundColor="$green5"
                      paddingHorizontal="$2"
                      paddingVertical="$1"
                      borderRadius="$2"
                    >
                      <Text fontSize="$2" color="$green11" fontWeight="600">
                        {story.xpReward} XP
                      </Text>
                    </View>
                  </XStack>
                </YStack>
              </Card>
            ))}
          </YStack>
        )}
      </YStack>
    </ScrollView>
  );
}

