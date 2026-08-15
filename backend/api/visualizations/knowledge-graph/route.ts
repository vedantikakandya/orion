import { NextResponse } from "next/server"
import { buildKnowledgeGraph } from "@/lib/visualizations/knowledge-graph"

export async function POST(request: Request) {
  try {
    const filters = await request.json()
    const graph = await buildKnowledgeGraph(filters)
    return NextResponse.json(graph)
  } catch (error) {
    console.error("[v0] Knowledge graph error:", error)
    return NextResponse.json({ error: "Failed to build knowledge graph" }, { status: 500 })
  }
}
