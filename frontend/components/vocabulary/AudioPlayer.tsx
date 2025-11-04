import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';
import { Button, View } from 'tamagui';

import { useTheme } from '../../hooks/useTheme';

interface AudioPlayerProps {
  audioUrl?: string;
  text?: string; // For TTS fallback
}

export function AudioPlayer({ audioUrl, text }: AudioPlayerProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { isDark } = useTheme();

  const playSound = async () => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      if (audioUrl) {
        // Play from URL
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: true }
        );
        setSound(newSound);
        setIsPlaying(true);

        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            setIsPlaying(false);
          }
        });
      } else if (text) {
        // For future: Implement Text-to-Speech
        // For now, we'll just show a button that doesn't do anything
        console.info('TTS not implemented yet for:', text);
      }
    } catch (error) {
      console.error('Error playing sound:', error);
      setIsPlaying(false);
    }
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    return () => {
      if (sound) {
        void sound.unloadAsync();
      }
    };
  }, [sound]);

  if (!audioUrl && !text) {
    return null;
  }

  return (
    <View alignItems="center" marginTop="$2">
      <Button
        circular
        size="$4"
        icon={
          <Ionicons
            name={isPlaying ? 'stop' : 'play'}
            size={24}
            color={isDark ? '$foreground' : '$foreground'}
          />
        }
        onPress={isPlaying ? stopSound : playSound}
      />
    </View>
  );
}

