import { NextResponse } from "next/server"
import { getFilterOptions } from "@/lib/search"

export async function GET() {
  try {
    const options = await getFilterOptions()
    return NextResponse.json(options)
  } catch (error) {
    console.error("[v0] Filter options error:", error)
    return NextResponse.json({
      missions: [],
      organisms: [],
      researchAreas: [],
    })
  }
}
