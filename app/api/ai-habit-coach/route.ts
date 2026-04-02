import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const MODEL = "gemini-2.5-flash";

export async function POST(req: NextRequest) {
  const { habits } = await req.json();

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "API Key tidak dikonfigurasi." },
      { status: 500 }
    );
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: MODEL,
    generationConfig: {
      responseMimeType: "application/json",
      maxOutputTokens: 2048,
    },
  });

  const prompt = `
Kamu adalah Habit Coach profesional yang memahami psikologi kebiasaan (James Clear - Atomic Habits, BJ Fogg - Tiny Habits).

Data habit pengguna (7 hari terakhir):
${habits?.length > 0
  ? habits.map((h: any) => `- "${h.name}": streak ${h.streak} hari, selesai ${h.completedThisWeek}/7 hari minggu ini, total doneDays: ${h.totalDone || 0}`).join("\n")
  : "Pengguna belum memiliki habit yang dilacak."}

Analisis kebiasaan mereka dan berikan coaching yang empatik namun tegas:

Balas HANYA JSON (tanpa markdown):
{
  "overall_score": "A+" | "A" | "B+" | "B" | "C" | "D" (penilaian keseluruhan),
  "overall_verdict": "1 kalimat penilaian overall (misal: 'Konsistensi sangat baik!' atau 'Ada ruang besar untuk perbaikan')",
  "habit_reviews": [
    {
      "name": "Nama habit",
      "status": "excellent" | "good" | "needs_attention" | "critical",
      "feedback": "Feedback personal 1-2 kalimat",
      "action_step": "1 langkah konkret untuk minggu depan"
    }
  ],
  "pattern_insight": "1 insight tentang pola kebiasaan mereka secara keseluruhan (misal: konsisten di weekday tapi drop di weekend)",
  "challenge": "1 tantangan mini untuk minggu depan yang fun & achievable",
  "encouragement": "Pesan penyemangat personal yang hangat (2-3 kalimat)"
}
`;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("AI Habit Coach Error:", error);
    return NextResponse.json(
      { error: "Gagal mendapatkan analisis habit." },
      { status: 500 }
    );
  }
}
