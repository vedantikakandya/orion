import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const [publications, datasets, library, projects] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM publications`,
      sql`SELECT COUNT(*) as count FROM datasets`,
      sql`SELECT COUNT(*) as count FROM library_items`,
      sql`SELECT COUNT(*) as count FROM projects`,
    ])

    return NextResponse.json({
      publications: Number(publications[0].count),
      datasets: Number(datasets[0].count),
      library_items: Number(library[0].count),
      projects: Number(projects[0].count),
      total:
        Number(publications[0].count) +
        Number(datasets[0].count) +
        Number(library[0].count) +
        Number(projects[0].count),
    })
  } catch (error) {
    console.error("[v0] Status check error:", error)
    return NextResponse.json({ error: "Failed to get status" }, { status: 500 })
  }
}
