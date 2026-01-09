export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = "https://space-jump.vercel.app"; // ← ganti setelah deploy
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Space Explorer</title>
  <meta property="fc:frame" content="vNext" />
  <meta property="fc:frame:image" content="${baseUrl}/image?d=0&s=0&over=0" />
  <meta property="fc:frame:button:1" content="Mulai Misi!" />
  <meta property="fc:frame:post_url" content="${baseUrl}/api/play" />
</head>
</html>
  `;
  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
}
