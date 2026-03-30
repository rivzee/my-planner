import type { Quote } from "@/types";

export const QUOTES: Quote[] = [
  { text: "Kamu tidak harus hebat untuk memulai, tapi kamu harus memulai untuk menjadi hebat.", author: "Zig Ziglar" },
  { text: "Disiplin adalah jembatan antara tujuan dan pencapaian.", author: "Jim Rohn" },
  { text: "Satu-satunya cara untuk melakukan pekerjaan yang luar biasa adalah mencintai apa yang kamu lakukan.", author: "Steve Jobs" },
  { text: "Jangan hitung hari-harinya. Buat setiap hari berarti.", author: "Muhammad Ali" },
  { text: "Keberhasilan adalah jumlah dari usaha-usaha kecil yang diulang setiap hari.", author: "Robert Collier" },
  { text: "Mimpi bukan tentang apa yang kamu lihat saat tidur. Mimpi adalah sesuatu yang tak membiarkanmu tidur.", author: "A.P.J. Abdul Kalam" },
  { text: "Langkah terkecil ke depan lebih baik daripada diam di tempat selamanya.", author: "Anonim" },
  { text: "Energimu pergi ke mana perhatianmu berada. Pilih dengan bijak.", author: "Anonim" },
  { text: "Produktivitas bukan tentang sibuk. Ini tentang hasil.", author: "Anonim" },
  { text: "Setiap pagi adalah kesempatan baru untuk menjadi versi terbaik dirimu.", author: "Anonim" },
  { text: "Rencana tanpa aksi hanyalah mimpi. Aksi tanpa rencana adalah mimpi buruk.", author: "Pepatah Jepang" },
  { text: "Kamu adalah rata-rata dari lima kebiasaan yang paling sering kamu lakukan.", author: "Adaptasi James Clear" },
  { text: "Fokus pada kemajuan, bukan kesempurnaan.", author: "Anonim" },
  { text: "Satu jam perencanaan dapat menghemat sepuluh jam pekerjaan yang tidak terarah.", author: "Dale Carnegie" },
  { text: "Masa depanmu dibentuk oleh apa yang kamu lakukan hari ini, bukan hari esok.", author: "Robert Kiyosaki" },
  { text: "Kemenangan besar dimulai dari keputusan-keputusan kecil setiap hari.", author: "Anonim" },
  { text: "Bukan tentang seberapa keras kamu bekerja, tapi seberapa cerdas kamu berencana.", author: "Anonim" },
  { text: "Setiap malam sebelum tidur, tanyakan: apa yang sudah aku lakukan hari ini?", author: "Anonim" },
  { text: "Orang sukses membuat keputusan cepat dan mengubahnya perlahan. Orang gagal sebaliknya.", author: "Napoleon Hill" },
  { text: "Konsistensi adalah bahan bakar dari semua pencapaian besar.", author: "Anonim" },
  { text: "Jangan tunggu motivasi. Mulai dulu, motivasi akan mengikuti.", author: "Anonim" },
  { text: "Tubuh yang sehat adalah rumah dari jiwa yang kuat.", author: "Francis Bacon" },
  { text: "Investasi terbaik yang bisa kamu buat adalah investasi pada dirimu sendiri.", author: "Warren Buffett" },
  { text: "Belajar satu hal kecil setiap hari berarti 365 hal baru dalam setahun.", author: "Anonim" },
  { text: "Jangan takut bergerak perlahan, takutlah diam tidak bergerak.", author: "Pepatah Cina" },
];

export function getDailyQuoteIndex(): number {
  const seed = new Date().toDateString();
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(hash) % QUOTES.length;
}

export function getDailyQuote(): Quote {
  return QUOTES[getDailyQuoteIndex()];
}
