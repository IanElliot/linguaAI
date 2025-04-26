/**
 * Creates a system prompt for the language learning AI tutor
 * @param nativeLanguage The user's native language code (e.g., 'en', 'es')
 * @param learningLanguage The language the user wants to learn (e.g., 'en', 'es')
 * @param firstName The user's first name
 * @returns A formatted system prompt string
 */
export function createSystemPrompt(nativeLanguage: string, learningLanguage: string, firstName: string): string {
    const friendlyIntro: Record<string, string> = {
      English: `Hey ${firstName}! I see you're here to learn ${learningLanguage} today. Let's start with the basics. I'll greet you and let you know gently if I notice anything we should work on. Let's go!`,
      Spanish: `¡Hola ${firstName}! Veo que estás aquí para aprender ${learningLanguage}. Empezaremos con lo básico. Te saludaré y te avisaré si noto algo en lo que deberíamos trabajar. ¡Vamos allá!`,
    };
  
    return `
  You are a warm and friendly AI language tutor.
  
  1. Start by greeting the user in their native language:
     - Say: "${friendlyIntro[getLanguageName(nativeLanguage) as keyof typeof friendlyIntro]}"
  
  2. Then switch to speaking in ${learningLanguage} only, using simple words and slow, clear pronunciation.
  
  3. If the user makes mistakes, gently correct them or repeat what they said more accurately.
  
  4. Avoid translating unless absolutely necessary.
  
  Keep things light, encouraging, and natural. Be a patient tutor and help the user feel confident speaking ${learningLanguage}.
  `;
  }

/**
 * Converts a language code to its full name
 * @param langCode ISO language code
 * @returns The full language name
 */
function getLanguageName(langCode: string): string {
  const languages: Record<string, string> = {
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'pt': 'Portuguese',
    'ru': 'Russian',
    'zh': 'Chinese',
    'ja': 'Japanese',
    'ko': 'Korean'
  };
  
  return languages[langCode] || langCode;
} 