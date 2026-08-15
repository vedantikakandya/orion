import { NextResponse } from "next/server"
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), '..', 'datasets', 'Space_Biology_Publications_FY2024.json')
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const publications = JSON.parse(fileContent)

    // Calculate statistics
    const validImpacts = publications
      .map(pub => parseFloat(pub.Journal_Impact_Factor))
      .filter(impact => !isNaN(impact))

    const stats = {
      total: publications.length,
      highImpact: validImpacts.filter(impact => impact >= 10).length,
      avgImpact: validImpacts.length > 0 ? validImpacts.reduce((a, b) => a + b, 0) / validImpacts.length : 0,
      topJournals: getTopJournals(publications)
    }

    return NextResponse.json({ publications, stats })
  } catch (error) {
    console.error("FY2024 publications error:", error)
    return NextResponse.json({ error: "Failed to load publications" }, { status: 500 })
  }
}

function getTopJournals(publications: any[]) {
  const journalCounts: { [key: string]: number } = {}
  
  publications.forEach(pub => {
    if (pub.Journal_Info && pub.Journal_Info !== "Parsing Failed") {
      // Extract journal name from citation
      const match = pub.Journal_Info.match(/\.\s([A-Za-z\s]+)\.\s\d{4}/)
      if (match) {
        const journal = match[1].trim()
        journalCounts[journal] = (journalCounts[journal] || 0) + 1
      }
    }
  })

  return Object.entries(journalCounts)
    .map(([journal, count]) => ({ journal, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
}