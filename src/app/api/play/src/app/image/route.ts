import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const distance = parseInt(searchParams.get("d") || "0");
  const score = parseInt(searchParams.get("s") || "0");
  const gameOver = searchParams.get("over") === "1";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1160px",
          height: "600px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#00001a",
          color: "#4fc3f7",
          fontFamily: "Arial, sans-serif",
          textAlign: "center",
          padding: "60px",
          gap: "20px",
        }}
      >
        {gameOver ? (
          <>
            <div style={{ fontSize: "100px" }}>💥</div>
            <div style={{ fontSize: "64px", fontWeight: "bold", color: "#ff5252" }}>
              Misi Gagal!
            </div>
            <div style={{ fontSize: "56px", color: "#ffd740" }}>
              Jarak: {score} juta km
            </div>
          </>
        ) : distance === 0 ? (
          <>
            <div style={{ fontSize: "100px" }}>🌌</div>
            <div style={{ fontSize: "72px", fontWeight: "bold" }}>Space Explorer</div>
            <div style={{ fontSize: "40px", color: "#81d4fa" }}>
              Tekan "Mulai Misi!"
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: "90px" }}>🚀</div>
            <div style={{ fontSize: "72px", fontWeight: "bold" }}>
              {distance} juta km
            </div>
            <div style={{ fontSize: "40px", color: "#a5d6a7" }}>
              Risiko asteroid: {Math.min(30 + distance * 2, 90)}%
            </div>
          </>
        )}
      </div>
    ),
    {
      width: 1160,
      height: 600,
    }
  );
          }
