import { getRecommendations } from "@/lib/ai/recommendations"

const NextResponse = {
  json(body: unknown, init?: ResponseInit) {
    return Response.json(body, init)
  }
} as const

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
