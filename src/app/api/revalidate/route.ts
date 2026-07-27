import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { message: "Invalid revalidation secret token" },
      { status: 401 }
    );
  }

  try {
    const customPath = request.nextUrl.searchParams.get("path");
    
    if (customPath) {
      revalidatePath(customPath);
    } else {
      revalidatePath("/blog");
      revalidatePath("/careers");
    }

    return NextResponse.json({
      revalidated: true,
      paths: customPath ? [customPath] : ["/blog", "/careers"],
      now: Date.now(),
      message: "Successfully revalidated paths",
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Error revalidating path", error: String(err) },
      { status: 500 }
    );
  }
}

