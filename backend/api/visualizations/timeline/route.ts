const NextResponse = {
  json(body: unknown, init?: ResponseInit) {
    return Response.json(body, init)
  }
} as const
import { getTimelineData } from "@/lib/visualizations/timeline"

export async function POST(request: Request) {
  try {
    const filters = await request.json()
    const events = await getTimelineData(filters)
    return NextResponse.json({ events })
  } catch (error) {
    console.error("[v0] Timeline error:", error)
    return NextResponse.json({ error: "Failed to get timeline data" }, { status: 500 })
  }
}
