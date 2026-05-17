import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, imageBase64 } = await req.json();

    const response = await fetch("https://fal.run/fal-ai/flux-pro/v1/redux", {
      method: "POST",
      headers: {
        "Authorization": `Key ${process.env.FAL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        image_url: imageBase64,
        num_images: 1,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || "Error generando imagen");

    return NextResponse.json({ imageUrl: data.images[0].url });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
