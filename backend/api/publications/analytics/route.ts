import { NextResponse } from "next/server"
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'Space_Biology_Publications_FY2024.json')
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const publications = JSON.parse(fileContent)

    // Impact factor distribution
    const impactDistribution = getImpactDistribution(publications)
    
    // Research areas from parsed entries
    const researchAreas = getResearchAreas(publications)
    
    // Monthly publication trends (simulated)
    const monthlyTrends = getMonthlyTrends(publications)

    return NextResponse.json({
      impactDistribution,
      researchAreas,
      monthlyTrends,
      totalPublications: publications.length,
      parsedEntries: publications.filter(p => p.Journal_Info !== "Parsing Failed").length
    })
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json({ error: "Failed to generate analytics" }, { status: 500 })
  }
}

function getImpactDistribution(publications: any[]) {
  const ranges = { "0-5": 0, "5-10": 0, "10-15": 0, "15+": 0, "N/A": 0 }
  
  publications.forEach(pub => {
    const impact = parseFloat(pub.Journal_Impact_Factor)
    if (isNaN(impact)) {
      ranges["N/A"]++
    } else if (impact < 5) {
      ranges["0-5"]++
    } else if (impact < 10) {
      ranges["5-10"]++
    } else if (impact < 15) {
      ranges["10-15"]++
    } else {
      ranges["15+"]++
    }
  })

  return Object.entries(ranges).map(([range, count]) => ({ range, count }))
}

function getResearchAreas(publications: any[]) {
  const areas = {
    "Cardiovascular": 0,
    "Plant Biology": 0,
    "Microbiology": 0,
    "Radiation Effects": 0,
    "Cell Biology": 0,
    "Other": 0
  }

  publications.forEach(pub => {
    if (pub.Journal_Info && pub.Journal_Info !== "Parsing Failed") {
      const info = pub.Journal_Info.toLowerCase()
      if (info.includes("cardiovascular") || info.includes("heart")) areas["Cardiovascular"]++
      else if (info.includes("arabidopsis") || info.includes("plant") || info.includes("brassica")) areas["Plant Biology"]++
      else if (info.includes("biofilm") || info.includes("pseudomonas")) areas["Microbiology"]++
      else if (info.includes("radiation") || info.includes("irradiation")) areas["Radiation Effects"]++
      else if (info.includes("cell") || info.includes("calcium")) areas["Cell Biology"]++
      else areas["Other"]++
    }
  })

  return Object.entries(areas).map(([area, count]) => ({ area, count }))
}

function getMonthlyTrends(publications: any[]) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  
  // Extract actual months from parsed entries
  const monthCounts = new Array(12).fill(0)
  
  publications.forEach(pub => {
    if (pub.Journal_Info && pub.Journal_Info !== "Parsing Failed") {
      const monthMatch = pub.Journal_Info.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i)
      if (monthMatch) {
        const monthIndex = months.findIndex(m => m.toLowerCase() === monthMatch[1].toLowerCase())
        if (monthIndex !== -1) monthCounts[monthIndex]++
      }
    }
  })

  return months.map((month, index) => ({ month, count: monthCounts[index] }))
}