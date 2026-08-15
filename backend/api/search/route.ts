const NextResponse = {
  json(body: unknown, init?: ResponseInit) {
    return Response.json(body, init)
  }
} as const
import fs from 'fs'
import path from 'path'

export async function POST(request: Request) {
  try {
    const { query, filters } = await request.json()

    if (!query) {
      return NextResponse.json({ results: [] })
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
    
    // Load and filter FY2024 publications (only complete entries)
    const completeFY2024Pubs = fy2024Publications
      .filter((pub: any) => pub.Journal_Info !== "Parsing Failed" && pub.Authors !== "Parsing Failed")
      .map((pub: any) => ({
        Title: pub.Journal_Info,
        Link: pub.DOI_Link,
        type: "fy2024_publication",
        impact_factor: pub.Journal_Impact_Factor,
        number: pub.Number
      }))
    
    // All FY2024 publications for research queries
    const allFY2024Pubs = fy2024Publications
      .filter((pub: any) => pub.DOI_Link !== "Not Found")
      .map((pub: any) => ({
        Title: pub.Journal_Info !== "Parsing Failed" ? pub.Journal_Info : `NASA Space Biology Publication #${pub.Number}`,
        Link: pub.DOI_Link,
        type: "fy2024_publication",
        impact_factor: pub.Journal_Impact_Factor,
        number: pub.Number
      }))
    
    // Combine datasets
    const publications = [...pmcPublications, ...completeFY2024Pubs]
    
    const keywords = query.toLowerCase().split(' ').filter((word: string) => word.length > 2)
    const researchTerms = ['research', 'study', 'analysis', 'investigation', 'experiment', 'biology', 'space', 'nasa', 'publication']
    const isResearchQuery = keywords.some((keyword: string) => researchTerms.includes(keyword))
    
    let matchedPubs = publications.filter((pub: any) => {
      const title = pub.Title.toLowerCase()
      return keywords.some((keyword: string) => title.includes(keyword))
    })
    
    // If research-related query and FY2024 filter, show all FY2024 publications
    if (isResearchQuery) {
      matchedPubs = [...matchedPubs, ...allFY2024Pubs]
      // Remove duplicates
      matchedPubs = matchedPubs.filter((pub: any, index: number, self: any[]) => 
        index === self.findIndex((p: any) => p.Link === pub.Link)
      )
    }

    // Apply filters
    if (filters) {
      // Filter by publication type first
      if (filters.publicationType && filters.publicationType !== 'all') {
        if (filters.publicationType === 'fy2024') {
          matchedPubs = allFY2024Pubs
        } else if (filters.publicationType === 'pmc') {
          matchedPubs = matchedPubs.filter((pub: any) => !pub.type || pub.type !== 'fy2024_publication')
        }
      }
      
      // Filter by research areas
      if (filters.researchAreas && filters.researchAreas.length > 0) {
        matchedPubs = matchedPubs.filter((pub: any) => {
          const title = pub.Title.toLowerCase()
          return filters.researchAreas.some((area: string) => {
            const areaLower = area.toLowerCase()
            if (areaLower.includes('plant')) return title.includes('plant') || title.includes('arabidopsis') || title.includes('seedling')
            if (areaLower.includes('microbiology')) return title.includes('bacteria') || title.includes('microbial') || title.includes('coli')
            if (areaLower.includes('bone')) return title.includes('bone') || title.includes('skeletal') || title.includes('osteoblast')
            if (areaLower.includes('radiation')) return title.includes('radiation') || title.includes('cosmic') || title.includes('ionizing')
            if (areaLower.includes('microgravity')) return title.includes('microgravity') || title.includes('weightless') || title.includes('gravity')
            if (areaLower.includes('cell')) return title.includes('cell') || title.includes('cellular')
            if (areaLower.includes('genetics')) return title.includes('gene') || title.includes('genetic') || title.includes('dna')
            return false
          })
        })
      }

      // Filter by organisms
      if (filters.organisms && filters.organisms.length > 0) {
        matchedPubs = matchedPubs.filter((pub: any) => {
          const title = pub.Title.toLowerCase()
          return filters.organisms.some((organism: string) => {
            const orgLower = organism.toLowerCase()
            if (orgLower.includes('arabidopsis')) return title.includes('arabidopsis')
            if (orgLower.includes('coli')) return title.includes('coli') || title.includes('escherichia')
            if (orgLower.includes('yeast')) return title.includes('yeast') || title.includes('saccharomyces')
            if (orgLower.includes('mouse')) return title.includes('mouse') || title.includes('mice')
            if (orgLower.includes('rat')) return title.includes('rat')
            if (orgLower.includes('drosophila')) return title.includes('drosophila') || title.includes('fly')
            if (orgLower.includes('elegans')) return title.includes('elegans') || title.includes('worm')
            return title.includes(orgLower)
          })
        })
      }

      // Filter by missions
      if (filters.missions && filters.missions.length > 0) {
        matchedPubs = matchedPubs.filter((pub: any) => {
          const title = pub.Title.toLowerCase()
          return filters.missions.some((mission: string) => {
            const missionLower = mission.toLowerCase()
            return title.includes(missionLower) || title.includes('space') || title.includes('flight')
          })
        })
      }
    }
    
    const results = matchedPubs.slice(0, 50).map((pub: any, index: number) => ({
      id: `pub_${index}`,
      type: pub.type === 'fy2024_publication' ? 'fy2024_publication' : 'publication',
      title: pub.Title,
      description: pub.type === 'fy2024_publication' 
        ? `FY2024 NASA Space Biology Publication (Impact Factor: ${pub.impact_factor})` 
        : `Research publication from NASA space biology database`,
      authors: ["NASA Research Team"],
      publication_date: pub.type === 'fy2024_publication' ? "2024-01-01" : "2023-01-01",
      link: pub.Link,
      impact_factor: pub.impact_factor,
      number: pub.number
    }))

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ results: [] })
  }
}