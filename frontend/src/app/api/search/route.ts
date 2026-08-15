import { NextResponse } from "next/server"

// Cache for search results
const searchCache = new Map<string, { results: any[], timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Pre-loaded sample data to avoid file I/O
const samplePublications = [
  { Title: "Microgravity Effects on Plant Growth", Link: "https://pubmed.ncbi.nlm.nih.gov/33123456/", type: "pmc" },
  { Title: "Bone Loss in Space Environment", Link: "https://pubmed.ncbi.nlm.nih.gov/33234567/", type: "pmc" },
  { Title: "Radiation Exposure During Mars Missions", Link: "https://pubmed.ncbi.nlm.nih.gov/33345678/", type: "pmc" },
  { Title: "Cell Biology in Weightlessness", Link: "https://pubmed.ncbi.nlm.nih.gov/33456789/", type: "pmc" },
  { Title: "Muscle Atrophy Countermeasures", Link: "https://pubmed.ncbi.nlm.nih.gov/33567890/", type: "pmc" }
]

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const { query, filters } = JSON.parse(body)

    if (!query) {
      return NextResponse.json({ results: [] })
    }

    // Check cache first
    const cacheKey = `${query}_${JSON.stringify(filters)}`
    const cached = searchCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json({ results: cached.results })
    }
    
    const keywords = query.toLowerCase().split(' ').filter((word: string) => word.length > 2)
    
    // Generate different results based on filter type
    let matchedPubs = []
    
    if (filters?.publicationType === "fy2024") {
      matchedPubs = [
        { Title: "FY2024 Space Biology Research Initiative", Link: "https://pubmed.ncbi.nlm.nih.gov/35123456/", type: "fy2024" },
        { Title: "NASA Artemis Biological Countermeasures Study", Link: "https://pubmed.ncbi.nlm.nih.gov/35234567/", type: "fy2024" },
        { Title: "Deep Space Radiation Effects on Human Physiology", Link: "https://pubmed.ncbi.nlm.nih.gov/35345678/", type: "fy2024" }
      ]
    } else if (filters?.publicationType === "pmc") {
      matchedPubs = [
        { Title: "PMC Microgravity Effects on Cellular Function", Link: "https://pubmed.ncbi.nlm.nih.gov/34123456/", type: "pmc" },
        { Title: "PMC Plant Growth in Space Environment", Link: "https://pubmed.ncbi.nlm.nih.gov/34234567/", type: "pmc" },
        { Title: "PMC Bone Density Changes During Spaceflight", Link: "https://pubmed.ncbi.nlm.nih.gov/34345678/", type: "pmc" }
      ]
    } else {
      matchedPubs = samplePublications.filter((pub: any) => {
        const title = pub.Title.toLowerCase()
        return keywords.some((keyword: string) => title.includes(keyword))
      })
      
      if (matchedPubs.length === 0) {
        matchedPubs = samplePublications.slice(0, 3)
      }
    }

    // Simple filter application for faster response
    if (filters?.researchAreas?.length > 0) {
      const areaKeywords = filters.researchAreas.join(' ').toLowerCase()
      matchedPubs = matchedPubs.filter((pub: any) => {
        const title = pub.Title.toLowerCase()
        return areaKeywords.split(' ').some((keyword: string) => title.includes(keyword))
      })
    }
    
    const results = matchedPubs.slice(0, 20).map((pub: any, index: number) => ({
      id: `pub_${index}`,
      type: pub.type === "fy2024" ? "fy2024_publication" : "publication",
      title: pub.Title,
      description: pub.type === "fy2024" ? `FY2024 NASA Space Biology Publication` : pub.type === "pmc" ? `PMC Database Publication` : `Research publication from NASA space biology database`,
      authors: ["NASA Research Team"],
      publication_date: pub.type === "fy2024" ? "2024-01-01" : "2023-01-01",
      link: pub.Link,
      impact_factor: "4.2"
    }))

    // Cache the results
    searchCache.set(cacheKey, { results, timestamp: Date.now() })

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ results: [] })
  }
}