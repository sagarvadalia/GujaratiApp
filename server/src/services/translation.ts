export class TranslationService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.GOOGLE_CLOUD_API_KEY || "";
  }

  async translateText(
    text: string,
    targetLanguage: string = "gu"
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error("GOOGLE_CLOUD_API_KEY not configured");
    }

    try {
      const url = `https://translation.googleapis.com/language/translate/v2?key=${this.apiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: text,
          target: targetLanguage,
          format: "text",
        }),
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.statusText}`);
      }

      const data = (await response.json()) as {
        data: {
          translations: Array<{
            translatedText: string;
          }>;
        };
      };
      return data.data.translations[0].translatedText;
    } catch (error) {
      console.error("Translation error:", error);
      throw error;
    }
  }

  async transliterateText(
    text: string,
    sourceLanguage: string = "gu"
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error("GOOGLE_CLOUD_API_KEY not configured");
    }

    try {
      // Google Transliteration API (if available) or use translation with transliteration
      const url = `https://translation.googleapis.com/language/translate/v2?key=${this.apiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: text,
          source: sourceLanguage,
          target: "en",
          format: "text",
        }),
      });

      if (!response.ok) {
        throw new Error(`Transliteration API error: ${response.statusText}`);
      }

      const data = (await response.json()) as {
        data: {
          translations: Array<{
            translatedText: string;
          }>;
        };
      };
      // Note: Google Translate API doesn't directly provide transliteration
      // This is a placeholder - you may need to use a different service
      // or maintain a transliteration mapping
      return data.data.translations[0].translatedText;
    } catch (error) {
      console.error("Transliteration error:", error);
      throw error;
    }
  }
}
