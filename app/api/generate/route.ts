import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

fal.config({ credentials: process.env.FAL_KEY });

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, prompt } = await req.json();

    const result = await fal.subscribe("fal-ai/flux-pro/v1/redux", {
      input: {
        image_url: imageUrl,
        prompt: prompt,
        num_images: 1,
      },
    });

    return NextResponse.json({ imageUrl: result.data.images[0].url });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
