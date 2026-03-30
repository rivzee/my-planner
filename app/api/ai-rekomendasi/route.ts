import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const MODELS = {
  flashLite31: "gemini-3.1-flash-lite-preview",
  flash3: "gemini-3-flash-preview",
  flash25: "gemini-2.5-flash",
  gemma3: "gemma-3-27b-it"
};

export async function POST(req: NextRequest) {
  const { tasks, habits, goals, context } = await req.json();

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "API Key tidak dikonfigurasi. Tambahkan GEMINI_API_KEY di .env.local (gratis di aistudio.google.com)" },
      { status: 500 }
    );
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  // Menggunakan model Gemini 2.5 Flash dari daftar MODELS
  const model = genAI.getGenerativeModel({
    model: MODELS.flash25,
    generationConfig: {
      responseMimeType: "application/json",
      maxOutputTokens: 4096, // Ditingkatkan agar jawaban komprehensif tidak terpotong
    },
  });

  const prompt = `
Kamu adalah asisten perencanaan pribadi yang membantu pengguna merencanakan harinya dengan bijak.

Konteks pengguna saat ini:
- Hari: ${context.day}
- Jam: ${context.time}
- Area fokus: ${context.focusAreas.join(", ")}

Tugas yang belum selesai (${tasks.pending.length} tugas):
${tasks.pending.length > 0 ? tasks.pending.map((t: string) => `- ${t}`).join("\n") : "- Tidak ada tugas pending"}

Progress habit minggu ini:
${habits.length > 0 ? habits.map((h: { name: string; streak: number }) => `- ${h.name}: ${h.streak}/7 hari`).join("\n") : "- Belum ada habit yang dilacak"}

Goals tahunan:
${goals.length > 0 ? goals.map((g: { title: string; progress: number; cat: string }) => `- [${g.cat}] ${g.title}: ${g.progress}%`).join("\n") : "- Belum ada goals yang ditentukan"}

Berikan rekomendasi yang singkat, praktis, dan memotivasi dalam Bahasa Indonesia:
1. 3 prioritas utama untuk hari ini
2. Saran penjadwalan komprehensif (Sertakan estimasi jadwal waktu kasar untuk: rutinitas wajib seperti jadwal sholat 5 waktu, jadwal makan, olahraga ringan, dan jadwal kuliah/belajar yang disesuaikan dengan daftar prioritas. Buat dalam format narasi singkat.)
3. 1 pengingat terkait habit atau goal yang perlu perhatian
4. 1 kalimat motivasi yang relevan dengan kondisi saat ini

Balas HANYA dengan JSON (tanpa markdown) mengikuti struktur ini persis:
{
  "prioritas": ["string", "string", "string"],
  "saran_jadwal": "string",
  "pengingat": "string",
  "motivasi": "string"
}
`;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text();
    // Berjaga-jaga jika AI menaruh tag markdown ```json ... ```
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return NextResponse.json(
      { error: "Gagal mendapatkan rekomendasi AI. Pastikan GEMINI_API_KEY sudah benar." },
      { status: 500 }
    );
  }
}
