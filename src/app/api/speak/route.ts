import { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  if (!text) {
    return new Response("Missing text", { status: 400 });
  }

  try {
    const speech = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova", // or alloy, echo, shimmer, fable
      input: text,
    });

    const buffer = Buffer.from(await speech.arrayBuffer());

    return new Response(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": "inline; filename=output.mp3",
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}