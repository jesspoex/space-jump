import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const buttonIndex = body.untrustedData.buttonIndex;
  const imageUrl = body.untrustedData.imageUrl || "";

  let distance = 0;
  let score = 0;
  let gameOver = false;

  if (imageUrl.includes("/image?")) {
    try {
      const url = new URL(imageUrl, "https://dummy.com");
      distance = parseInt(url.searchParams.get("d") || "0");
      score = parseInt(url.searchParams.get("s") || "0");
      gameOver = url.searchParams.get("over") === "1";
    } catch (e) {}
  }

  if (gameOver && buttonIndex === 1) {
    distance = 0; score = 0; gameOver = false;
  } else if (!gameOver) {
    if (distance === 0) distance = 10;
    else if (buttonIndex === 1) {
      distance += 10;
      if (Math.random() < 0.3) { gameOver = true; score = Math.floor(distance * 0.5); }
    } else if (buttonIndex === 2) {
      gameOver = true; score = distance;
    }
  }

  const baseUrl = "https://space-jump.vercel.app"; // ← ganti setelah deploy
  const imageParams = new URLSearchParams({ d: distance.toString(), s: score.toString(), over: gameOver ? "1" : "0" });
  const imageUrlOut = `${baseUrl}/image?${imageParams}`;
  const postUrl = gameOver ? `${baseUrl}/game` : `${baseUrl}/api/play`;
  const button1 = gameOver ? "Misi Baru" : "Lanjut ke Jupiter!";
  const button2 = gameOver ? "" : "Pulang ke Bumi!";

  let html = `
<!DOCTYPE html>
<html>
<head>
  <title>Space Explorer</title>
  <meta property="fc:frame" content="vNext" />
  <meta property="fc:frame:image" content="${imageUrlOut}" />
  <meta property="fc:frame:button:1" content="${button1}" />
  <meta property="fc:frame:post_url" content="${postUrl}" />
`;
  if (!gameOver) html += `<meta property="fc:frame:button:2" content="${button2}" />\n`;
  html += `</head></html>`;

  return new Response(html, { headers: { "Content-Type": "text/html" } });
    }
