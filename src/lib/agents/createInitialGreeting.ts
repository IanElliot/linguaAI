import { getLanguageName } from "./getLanguageName";

export function createInitialGreeting(nativeLang: string, targetLang: string, firstName: string): string {
  const native = getLanguageName(nativeLang);
  const target = getLanguageName(targetLang);

  const greeting: Record<string, string> = {
    English: `Hey ${firstName}! I see you're here to learn ${target} today. Let's start with the basics. I'll greet you and gently correct anything I notice. Let's go!`,
    Spanish: `¡Hola ${firstName}! Veo que estás aquí para aprender ${target}. Empezaremos con lo básico. Te saludaré y te avisaré si noto algo que debamos mejorar. ¡Vamos allá!`
  };

  const fallback = `Welcome ${firstName}! Let's start learning ${target}.`;

  return greeting[native] || fallback;
}