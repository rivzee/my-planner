import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const MODEL = "gemini-2.5-flash";

export async function POST(req: NextRequest) {
  const { tasks, context } = await req.json();

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

  const allTasks = [...(tasks?.priority || []), ...(tasks?.regular || [])];

  const prompt = `
Kamu adalah ahli manajemen waktu dan prioritas (menggunakan Eisenhower Matrix, Pareto 80/20, dan Energy Management).

Waktu sekarang: ${context?.time || "Tidak diketahui"}
Hari: ${context?.day || "Tidak diketahui"}

Daftar tugas pengguna (campuran prioritas dan reguler):
${allTasks.length > 0 
  ? allTasks.map((t: any, i: number) => `${i+1}. [${t.done ? "SELESAI" : "BELUM"}] ${t.text} ${t.priority ? `(prioritas: ${t.priority})` : ""}`).join("\n")
  : "Pengguna belum memiliki tugas."}

Analisis dan berikan rekomendasi urutan pengerjaan yang optimal.
Pertimbangkan:
- Waktu saat ini (pagi = deep work, siang = medium, sore = light tasks)
- Tugas yang sudah selesai tidak perlu dibahas lagi
- Berikan estimasi waktu per tugas
- Berikan alasan singkat kenapa urutan ini optimal

Balas HANYA JSON (tanpa markdown):
{
  "analysis": "Analisis singkat 1-2 kalimat tentang komposisi tugas mereka",
  "optimized_order": [
    {
      "task": "Nama tugas",
      "urgency": "tinggi" | "sedang" | "rendah",
      "estimated_time": "estimasi waktu (misal: 30 menit)",
      "reason": "Alasan singkat kenapa dikerjakan di posisi ini",
      "tip": "1 micro-tip untuk menyelesaikan tugas ini lebih efektif"
    }
  ],
  "time_block_suggestion": "Saran pembagian waktu keseluruhan dalam 1 paragraf singkat",
  "productivity_tip": "1 tips produktivitas yang relevan dengan kondisi mereka"
}
`;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("AI Prioritize Error:", error);
    return NextResponse.json(
      { error: "Gagal menganalisis prioritas." },
      { status: 500 }
    );
  }
}
