import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useEffect, useState } from 'react';
import { Button, View } from 'tamagui';

import { useTheme } from '../../hooks/useTheme';
import { ttsService } from '../../utils/tts';

interface AudioPlayerProps {
  audioUrl?: string;
  text?: string; // For TTS fallback
  gujaratiText?: string; // Gujarati text for TTS
  rate?: number; // Speech rate (0.1 to 10)
}

export function AudioPlayer({ audioUrl, text, gujaratiText, rate = 0.9 }: AudioPlayerProps) {
  const { isDark } = useTheme();
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Create audio player with the URL (or null if no URL)
  const player = useAudioPlayer(audioUrl ?? null);
  const status = useAudioPlayerStatus(player);

  const handlePlayPause = async () => {
    if (audioUrl) {
      // Use audio file if available
      if (status.playing) {
        player.pause();
      } else {
        player.play();
      }
    } else if (gujaratiText || text) {
      // Use TTS for Gujarati text
      if (isSpeaking) {
        ttsService.stop();
        setIsSpeaking(false);
      } else {
        try {
          setIsSpeaking(true);
          await ttsService.speak(gujaratiText ?? text ?? '', { rate });
          setIsSpeaking(false);
        } catch (error) {
          console.error('TTS error:', error);
          setIsSpeaking(false);
        }
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        // Audio player cleanup is handled by the hook
      } else {
        ttsService.stop();
      }
    };
  }, [audioUrl]);

  if (!audioUrl && !text && !gujaratiText) {
    return null;
  }

  const isPlaying = audioUrl ? status.playing : isSpeaking;

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
        onPress={handlePlayPause}
      />
    </View>
  );
}

