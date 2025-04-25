import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { createInitialGreeting } from '../../../lib/agents/createInitialGreeting';
import { createSystemPrompt } from '../../../lib/agents/createSystemPrompt';
import { ChatCompletionMessage } from 'openai/src/resources.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { nativeLanguage, learningLanguage, transcript } = body;

  console.log("Received POST to /api/respond with:", {
    nativeLanguage,
    learningLanguage,
    transcript
  });

  if (!nativeLanguage || !learningLanguage) {
    return new Response(
      JSON.stringify({ error: "Missing language codes in request body." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const systemPrompt = createSystemPrompt(nativeLanguage, learningLanguage);
    const introText = createInitialGreeting(nativeLanguage, learningLanguage);

    console.log(introText);

    const fullSystemPrompt = `${systemPrompt}\n\nStart by saying:\n"${createInitialGreeting(nativeLanguage, learningLanguage)}"`;

    const messages = transcript.trim()
      ? [
          { role: "system", content: fullSystemPrompt },
          { role: "user", content: transcript }
        ]
      : [
          { role: "system", content: fullSystemPrompt },
          { role: "user", content: "..." } // provoke the model to speak
        ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: messages as ChatCompletionMessage[],
    });

    return new Response(JSON.stringify({ reply: completion.choices[0].message.content }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
} 