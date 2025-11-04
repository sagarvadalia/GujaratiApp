import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import React, { useEffect, useState } from 'react';
import { Text, XStack, YStack } from 'tamagui';

import type { SpeakExercise } from '../../src/types/exercise';
import { Button, Card } from '../ui';
import { AudioPlayer } from '../vocabulary/AudioPlayer';

interface SpeakPracticeProps {
  exercise: SpeakExercise;
  onComplete: (recorded: boolean) => void;
}

export function SpeakPractice({ exercise, onComplete }: SpeakPracticeProps) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingStatus, setRecordingStatus] = useState<'idle' | 'recording' | 'recorded' | 'playing'>('idle');
  const [recordedUri, setRecordedUri] = useState<string | null>(null);

  useEffect(() => {
    // Request permissions on mount
    Audio.requestPermissionsAsync().catch(console.error);

    return () => {
      // Cleanup: stop recording if component unmounts
      if (recording) {
        recording.stopAndUnloadAsync().catch(console.error);
      }
    };
  }, [recording]);

  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(newRecording);
      setRecordingStatus('recording');
    } catch (error) {
      console.error('Failed to start recording', error);
      alert('Failed to start recording. Please check microphone permissions.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordedUri(uri);
      setRecording(null);
      setRecordingStatus('recorded');
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  };

  const playRecording = async () => {
    if (!recordedUri) return;

    try {
      setRecordingStatus('playing');
      const { sound } = await Audio.Sound.createAsync({ uri: recordedUri });
      await sound.playAsync();
      
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setRecordingStatus('recorded');
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error('Failed to play recording', error);
      setRecordingStatus('recorded');
    }
  };

  const handleSubmit = () => {
    if (recordedUri) {
      onComplete(true);
    }
  };

  const handleRetry = () => {
    setRecordedUri(null);
    setRecordingStatus('idle');
    setHasPlayedReference(false);
  };

  return (
    <YStack gap="$4" padding="$4">
      <Text fontSize="$6" fontWeight="700" color="$foreground">
        {exercise.instructions}
      </Text>

      {/* Reference Audio */}
      <Card tone="primary" elevated padding="$4">
        <YStack gap="$3" alignItems="center">
          <Ionicons name="volume-high" size={32} color="$primaryForeground" />
          <Text fontSize="$5" fontWeight="600" color="$primaryForeground" textAlign="center">
            Listen to the reference pronunciation:
          </Text>
          <Text fontSize="$6" fontWeight="700" color="$color" textAlign="center">
            {exercise.text}
          </Text>
          <AudioPlayer
            gujaratiText={exercise.text}
            audioUrl={exercise.audioUrl}
          />
          {exercise.transcription && (
            <Text fontSize="$4" color="$mutedForeground" fontStyle="italic">
              {exercise.transcription}
            </Text>
          )}
        </YStack>
      </Card>

      {/* Recording Section */}
      <Card tone="accent" elevated padding="$4">
        <YStack gap="$3" alignItems="center">
          <Ionicons
            name={recordingStatus === 'recording' ? 'mic' : 'mic-outline'}
            size={48}
            color={
              recordingStatus === 'recording'
                ? '$red11'
                : recordingStatus === 'recorded'
                  ? '$green11'
                  : '$accentForeground'
            }
          />
          <Text fontSize="$5" fontWeight="600" color="$accentForeground" textAlign="center">
            {recordingStatus === 'recording'
              ? 'Recording... Tap to stop'
              : recordingStatus === 'recorded'
                ? 'Recording complete! Tap to play'
                : 'Tap to start recording'}
          </Text>

          {recordingStatus === 'idle' && (
            <Button size="lg" onPress={startRecording}>
              <XStack gap="$2" alignItems="center">
                <Ionicons name="mic" size={24} />
                <Text fontSize="$5" fontWeight="600">
                  Start Recording
                </Text>
              </XStack>
            </Button>
          )}

          {recordingStatus === 'recording' && (
            <Button size="lg" variant="destructive" onPress={stopRecording}>
              <XStack gap="$2" alignItems="center">
                <Ionicons name="stop" size={24} />
                <Text fontSize="$5" fontWeight="600">
                  Stop Recording
                </Text>
              </XStack>
            </Button>
          )}

          {recordingStatus === 'recorded' && (
            <YStack gap="$2" width="100%">
              <Button size="lg" variant="secondary" onPress={playRecording}>
                <XStack gap="$2" alignItems="center">
                  <Ionicons name="play" size={24} />
                  <Text fontSize="$5" fontWeight="600">
                    Play Your Recording
                  </Text>
                </XStack>
              </Button>
              <XStack gap="$2">
                <Button variant="outline" flex={1} onPress={handleRetry}>
                  <Text fontSize="$4">Retry</Text>
                </Button>
                <Button flex={1} onPress={handleSubmit}>
                  <Text fontSize="$4" fontWeight="600">
                    Submit
                  </Text>
                </Button>
              </XStack>
            </YStack>
          )}
        </YStack>
      </Card>

      {/* Tips */}
      <Card tone="subtle" padding="$3">
        <YStack gap="$2">
          <Text fontSize="$4" fontWeight="600" color="$color">
            💡 Tips:
          </Text>
          <Text fontSize="$3" color="$mutedForeground">
            • Listen to the reference audio carefully
          </Text>
          <Text fontSize="$3" color="$mutedForeground">
            • Speak clearly and at a normal pace
          </Text>
          <Text fontSize="$3" color="$mutedForeground">
            • Try to match the pronunciation
          </Text>
        </YStack>
      </Card>
    </YStack>
  );
}

