const NextResponse = {
  json(body: unknown, init?: ResponseInit) {
    return Response.json(body, init)
  }
} as const
import fs from 'fs'
import path from 'path'

export async function POST(request: Request) {
  try {
    const { topic } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: "No topic provided" }, { status: 400 })
    }

    // Load publications from PMC database
    const pmcFilePath = path.join(process.cwd(), 'SB_publication_PMC.json')
    const pmcFileContent = fs.readFileSync(pmcFilePath, 'utf8')
    const pmcLines = pmcFileContent.trim().split('\n')
    const pmcPublications = pmcLines.map(line => JSON.parse(line))
    
    // Load Space Biology Publications FY2024
    const fy2024FilePath = path.join(process.cwd(), 'Space_Biology_Publications_FY2024.json')
    const fy2024FileContent = fs.readFileSync(fy2024FilePath, 'utf8')
    const fy2024Publications = JSON.parse(fy2024FileContent)
    
    // Combine both datasets
    const publications = [...pmcPublications, ...fy2024Publications.map((pub: any) => ({
      Title: pub.Journal_Info || `Publication ${pub.Number}`,
      Link: pub.DOI_Link
    }))]

    // Filter publications by topic
    const topicPubs = publications.filter((pub: any) => 
      pub.Title.toLowerCase().includes(topic.toLowerCase())
    )

    // Generate timeline data
    const timelineData = generateTimelineData(topicPubs)
    
    // Generate AI summary
    const aiSummary = await generateAISummary(topic, topicPubs, timelineData)

    // Get NASA events
    const nasaEvents = getNASAEvents()

    return NextResponse.json({
      timeline: timelineData,
      summary: aiSummary,
      publications: topicPubs.slice(0, 10),
      events: nasaEvents,
      totalCount: topicPubs.length
    })

  } catch (error) {
    console.error("Timeline analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze timeline" }, { status: 500 })
  }
}

function generateTimelineData(publications: any[]) {
  const yearCounts: { [key: string]: number } = {}
  
  publications.forEach(pub => {
    // Generate random years between 1990-2024 for demo
    const year = Math.floor(Math.random() * 35) + 1990
    yearCounts[year] = (yearCounts[year] || 0) + 1
  })

  return Object.entries(yearCounts)
    .map(([year, count]) => ({ year: parseInt(year), count }))
    .sort((a, b) => a.year - b.year)
}

async function generateAISummary(topic: string, publications: any[], timeline: any[]) {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat',
        messages: [{
          role: 'user',
          content: `Analyze the research evolution for topic "${topic}" in NASA space biology. 
          
Publications found: ${publications.length}
Timeline data: ${JSON.stringify(timeline.slice(0, 5))}

Generate a summary covering:
1. When research started and key periods
2. Research peaks and trends
3. Current status and future outlook
4. Any notable patterns or insights

Keep it concise (3-4 sentences) and scientific.`
        }],
        max_tokens: 300,
        temperature: 0.7
      })
    })

    if (response.ok) {
      const data = await response.json()
      return data.choices[0]?.message?.content || generateFallbackSummary(topic, timeline)
    }
  } catch (error) {
    console.error('AI summary generation failed:', error)
  }
  
  return generateFallbackSummary(topic, timeline)
}

function generateFallbackSummary(topic: string, timeline: any[]) {
  const startYear = timeline[0]?.year || 1990
  const peakYear = timeline.reduce((max, curr) => curr.count > max.count ? curr : max, timeline[0])?.year || 2000
  const totalPubs = timeline.reduce((sum, item) => sum + item.count, 0)

  return `Research on ${topic} in NASA space biology began around ${startYear}, with significant activity peaking in ${peakYear}. The field has produced ${totalPubs} publications, showing ${timeline.length > 10 ? 'sustained' : 'emerging'} research interest. Current trends indicate ${peakYear > 2015 ? 'continued growth' : 'mature research area'} with ongoing investigations into space-related effects.`
}

function getNASAEvents() {
  return [
    { year: 1998, event: "ISS Construction Begins", type: "mission" },
    { year: 2000, event: "ISS Permanent Crew", type: "milestone" },
    { year: 2003, event: "Mars Exploration Rovers", type: "mission" },
    { year: 2011, event: "Space Shuttle Program Ends", type: "milestone" },
    { year: 2020, event: "Artemis Program Launch", type: "mission" }
  ]
}