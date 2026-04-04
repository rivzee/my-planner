import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const MODELS = {
  flash25: "gemini-2.5-flash",
};

export async function POST(req: NextRequest) {
  const { monthName, targets, reflection } = await req.json();

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "API Key tidak dikonfigurasi. Tambahkan GEMINI_API_KEY di .env.local" },
      { status: 500 }
    );
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: MODELS.flash25,
    generationConfig: {
      responseMimeType: "application/json",
      maxOutputTokens: 2048,
    },
  });

  const prompt = `
Kamu adalah pelatih produktivitas tingkat tinggi (Productivity Coach).

Konteks pengguna saat ini:
- Laporan Bulanan: ${monthName}
- Refleksi / Jurnal Pengguna: "${reflection || "Pengguna belum menuliskan refleksi manualnya."}"

Daftar Target Bulanan & Pencapaian:
${targets.length > 0 
    ? targets.map((t: any) => `- [${t.done ? "SELESAI" : "TERTUNDA"}] ${t.text} ${t.note ? `(Catatan khusus: ${t.note})` : ""}`).join("\n") 
    : "- Pengguna belum/tidak memiliki target bulan ini."}

Berikan review eksklusif yang sangat memotivasi, detail, dan empatik menggunakan Bahasa Indonesia.
Berikan analisa berdasarkan 'catatan khusus' mereka jika ada (misal overachieving atau penundaan tugas).

Balas HANYA dengan format JSON yang ketat (tanpa markdown), menggunakan struktur berikut:
{
  "apresiasi": "Satu paragraf pujian atas pencapaian atau usaha mereka bulan ini.",
  "evaluasi": "Satu paragraf evaluasi objektif tentang hal yang tidak tercapai (tertunda) atau catatan overachieve mereka.",
  "saran_bulan_depan": "Satu paragraf langkah strategis/nasehat nyata untuk bulan berikutnya.",
  "saran_target_baru": ["Ide target baru 1", "Ide target baru 2", "Ide target baru 3"]
}
`;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Gemini AI Review Error:", error);
    return NextResponse.json(
      { error: "Gagal mendapatkan evaluasi AI. Server token habis atau format salah." },
      { status: 500 }
    );
  }
}
