// src/app/api/play/route.ts
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const buttonIndex = body.untrustedData.buttonIndex;
  const imageUrl = body.untrustedData.imageUrl || "";

  let distance = 0;
  let score = 0;
  let gameOver = false;

  // Opsional: tetap baca state dari URL jika ingin skor akurat
  // Tapi karena kita pakai gambar statis, ini hanya untuk logika internal
  if (imageUrl.includes("image?")) {
    try {
      const url = new URL(imageUrl, "https://dummy.com");
      distance = parseInt(url.searchParams.get("d") || "0");
      score = parseInt(url.searchParams.get("s") || "0");
      gameOver = url.searchParams.get("over") === "1";
    } catch (e) {}
  }

  // Reset game jika game over dan klik "Misi Baru"
  if (gameOver && buttonIndex === 1) {
    distance = 0;
    score = 0;
    gameOver = false;
  } else if (!gameOver) {
    if (distance === 0) {
      distance = 10; // Mulai misi
    } else if (buttonIndex === 1) {
      // Lanjut ke Jupiter
      distance += 10;
      if (Math.random() < 0.3) {
        gameOver = true;
        score = Math.floor(distance * 0.5); // Tabrak asteroid
      }
    } else if (buttonIndex === 2) {
      // Pulang ke Bumi
      gameOver = true;
      score = distance; // Skor penuh
    }
  }

  // 🔁 GANTI DI SINI: Gunakan gambar statis berdasarkan state
  let imageUrlOut = "https://i.imgur.com/5Yp7Q8F.png"; // Gambar awal

  if (distance > 0 && !gameOver) {
    imageUrlOut = "https://i.imgur.com/8QzR9wG.png"; // Gambar saat main
  } else if (gameOver) {
    imageUrlOut = "https://i.imgur.com/9VXr0lA.png"; // Gambar game over
  }

  // 🔁 GANTI baseUrl SESUAI DENGAN URL VERCEL-MU SETELAH DEPLOY
  const baseUrl = "https://space-jump.vercel.app"; // ← GANTI INI!

  const postUrl = gameOver ? `${baseUrl}/game` : `${baseUrl}/api/play`;
  const button1 = gameOver ? "Misi Baru" : "Lanjut ke Jupiter!";
  const button2 = gameOver ? "" : "Pulang ke Bumi!";

  let html = `
<!DOCTYPE html>
<html>
<head>
  <title>Space Jump</title>
  <meta property="fc:frame" content="vNext" />
  <meta property="fc:frame:image" content="${imageUrlOut}" />
  <meta property="fc:frame:button:1" content="${button1}" />
  <meta property="fc:frame:post_url" content="${postUrl}" />
`;

  if (!gameOver) {
    html += `<meta property="fc:frame:button:2" content="${button2}" />\n`;
  }

  html += `</head></html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
}
