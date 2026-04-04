import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { type, contextData } = await req.json();

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "Gemini API Key tidak dikonfigurasi." }, { status: 500 });
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" },
  });

  let prompt = "";

  if (type === "mingguan") {
    prompt = `Berdasarkan fokus minggu ini: "${contextData.focus || 'Belum ditentukan'}" dan tugas yang sudah ada (${contextData.taskCount} tugas). 
    Berikan 3 rekomendasi tugas konkret, operasional, dan actionable (ukuran gigitan/bisa dikerjakan cepat) untuk mendukung fokus mereka.
    Kembalikan HANYA JSON: { "suggestions": ["tugas 1", "tugas 2", "tugas 3"] }`;
  } else if (type === "tahunan") {
    prompt = `Berdasarkan goals tahunan saat ini (ada ${contextData.goalCount} goals). 
    Saran terbaik untuk merencanakan goal tahunan yang seimbang di 4 aspek (Karier, Kesehatan, Keuangan, Belajar).
    Bantu buatkan 3 ide Goal tahunan yang SMART (Specific, Measurable, Achievable, Relevant, Time-bound).
    Kembalikan HANYA JSON: { "suggestions": ["Judul Goal 1", "Judul Goal 2", "Judul Goal 3"] }`;
  }

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return NextResponse.json(JSON.parse(text));
  } catch (error) {
    return NextResponse.json({ error: "Gagal mendapatkan rekomendasi." }, { status: 500 });
  }
}
