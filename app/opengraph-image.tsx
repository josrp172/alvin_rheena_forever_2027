import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { wedding } from "@/content/wedding";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Wedding invitation";

export default async function OgImage() {
  const { partnerOne, partnerTwo } = wedding.couple;
  const photo = await readFile(path.join(process.cwd(), "public/photos/hk6.c2b4bcba-700.jpg"));
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#fcf2f2", fontFamily: "serif" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" width={470} height={630} style={{ width: 470, height: 630, objectFit: "cover" }} />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "radial-gradient(circle at 30% 20%, #f9d3dc 0%, #fcf2f2 55%, #f3dcd0 100%)",
            color: "#3e1f2c",
          }}
        >
          <div style={{ fontSize: 20, letterSpacing: 9, textTransform: "uppercase", color: "#7b5662" }}>You’re invited</div>
          <div style={{ display: "flex", alignItems: "center", fontSize: 96, marginTop: 26, fontStyle: "italic" }}>
            {partnerOne}
            <span style={{ color: "#cf6f8c", fontSize: 72, margin: "0 26px" }}>&</span>
            {partnerTwo}
          </div>
          <div style={{ fontSize: 28, marginTop: 26, letterSpacing: 5, color: "#9b3a5c" }}>
            {`${wedding.date.short}`}
          </div>
          <div style={{ fontSize: 22, marginTop: 14, color: "#7b5662", fontStyle: "italic" }}>to celebrate our wedding · Kindly RSVP</div>
        </div>
      </div>
    ),
    size,
  );
}
