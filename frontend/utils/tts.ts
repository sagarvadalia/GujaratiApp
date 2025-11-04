/**
 * Text-to-Speech utility for Gujarati text
 * Uses Web Speech API for web, can be extended for mobile with expo-speech
 */

export interface TTSOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

class TTSService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  /**
   * Check if TTS is available
   */
  isAvailable(): boolean {
    return this.synth !== null;
  }

  /**
   * Speak Gujarati text
   */
  speak(text: string, options: TTSOptions = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synth) {
        reject(new Error('Speech synthesis not available'));
        return;
      }

      // Stop any current speech
      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = options.lang ?? 'gu-IN'; // Gujarati (India)
      utterance.rate = options.rate ?? 0.9; // Slightly slower for learning
      utterance.pitch = options.pitch ?? 1.0;
      utterance.volume = options.volume ?? 1.0;

      utterance.onend = () => {
        this.currentUtterance = null;
        resolve();
      };

      utterance.onerror = (error) => {
        this.currentUtterance = null;
        reject(error);
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
    });
  }

  /**
   * Stop current speech
   */
  stop(): void {
    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
  }

  /**
   * Check if currently speaking
   */
  isSpeaking(): boolean {
    return this.synth?.speaking ?? false;
  }

  /**
   * Get available voices (for debugging)
   */
  getVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    return this.synth.getVoices();
  }

  /**
   * Find Gujarati voice if available
   */
  findGujaratiVoice(): SpeechSynthesisVoice | null {
    const voices = this.getVoices();
    // Try to find a Gujarati voice
    const gujaratiVoice = voices.find(
      (voice) =>
        voice.lang.includes('gu') ||
        voice.name.toLowerCase().includes('gujarati')
    );
    return gujaratiVoice ?? null;
  }
}

export const ttsService = new TTSService();

