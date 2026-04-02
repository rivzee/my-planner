import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const MODEL = "gemini-2.5-flash";

export async function POST(req: NextRequest) {
  const { userName, tasks, habits, monthlyTargets, weeklyFocus, xp, level } = await req.json();

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "API Key tidak dikonfigurasi. Tambahkan GEMINI_API_KEY di .env.local" },
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

  const now = new Date();
  const hour = now.getHours();
  const timeOfDay = hour < 10 ? "pagi" : hour < 15 ? "siang" : hour < 18 ? "sore" : "malam";
  const dayName = now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const prompt = `
Kamu adalah "Rivanzee AI Coach" — asisten produktivitas premium yang memberikan briefing pagi/siang/sore/malam kepada pengguna.

Nama pengguna: ${userName || "Pengguna"}
Waktu sekarang: ${timeOfDay} (${dayName})
Level: ${level || 1}, XP: ${xp || 0}

Data pengguna hari ini:
- Tugas Pending: ${tasks?.pending?.length > 0 ? tasks.pending.join(", ") : "Belum ada tugas"}
- Tugas Selesai: ${tasks?.done?.length > 0 ? tasks.done.join(", ") : "Belum ada yang selesai"}
- Fokus Minggu Ini: "${weeklyFocus || "Belum ditentukan"}"
- Target Bulanan: ${monthlyTargets?.length > 0 ? monthlyTargets.map((t: any) => `[${t.done ? "✓" : "○"}] ${t.text}`).join(", ") : "Belum ada target"}
- Habit Aktif: ${habits?.length > 0 ? habits.map((h: any) => `${h.name} (streak: ${h.streak} hari)`).join(", ") : "Belum ada habit"}

Berikan "Daily Briefing" yang hangat, personal, dan memotivasi. Sesuaikan nada bicara dengan waktu:
- Pagi: energik & optimis, siap memulai hari
- Siang: supportive, cek progres
- Sore: evaluatif, persiapan besok
- Malam: reflektif, apresiasi usaha hari ini

Balas HANYA JSON (tanpa markdown) mengikuti struktur:
{
  "sapaan": "Sapaan singkat personal (1 kalimat, sertakan nama pengguna dan konteks waktu)",
  "ringkasan": "Ringkasan kondisi hari ini 2-3 kalimat (sebutkan jumlah tugas, streak habit, dll secara spesifik)",
  "fokus_utama": "1 hal terpenting yang harus difokuskan sekarang (jelas & actionable)",
  "insight": "1 insight atau observasi cerdas tentang pola produktivitas mereka",
  "motivasi": "1 kalimat motivasi original yang relevan dengan kondisi mereka (bukan kutipan umum)"
}
`;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("AI Briefing Error:", error);
    return NextResponse.json(
      { error: "Gagal mendapatkan briefing AI." },
      { status: 500 }
    );
  }
}
