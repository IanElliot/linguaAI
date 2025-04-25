// app/api/transcribe/route.ts
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return new Response(JSON.stringify({ error: "No file uploaded" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const openAiForm = new FormData();
  openAiForm.append("file", new Blob([buffer], { type: "audio/webm" }), file.name);
  openAiForm.append("model", "whisper-1");

  try {
    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
      },
      body: openAiForm,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to transcribe");
    }

    return new Response(JSON.stringify({ text: data.text }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
