import { NextResponse } from "next/server"
import { getRecommendations } from "@/lib/ai/recommendations"

export async function POST(request: Request) {
  try {
    const { contentType, contentId } = await request.json()

    if (!contentType || !contentId) {
      return NextResponse.json({ error: "Content type and ID are required" }, { status: 400 })
    }

    const recommendations = await getRecommendations(contentType, contentId)

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error("[v0] Recommendations error:", error)
    return NextResponse.json({ error: "Failed to get recommendations" }, { status: 500 })
  }
}
