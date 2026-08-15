const NextResponse = {
  json(body: unknown, init?: ResponseInit) {
    return Response.json(body, init)
  }
} as const
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    // Load SB_publication_PMC.json data
    const pmcFilePath = path.join(process.cwd(), 'SB_publication_PMC.json')
    const pmcFileContent = fs.readFileSync(pmcFilePath, 'utf8')
    const pmcLines = pmcFileContent.trim().split('\n')
    const pmcPublications = pmcLines.map(line => JSON.parse(line))
    
    // Load FY2024 publications data
    const fy2024FilePath = path.join(process.cwd(), 'Space_Biology_Publications_FY2024.json')
    const fy2024FileContent = fs.readFileSync(fy2024FilePath, 'utf8')
    const fy2024Publications = JSON.parse(fy2024FileContent)
    
    // Calculate statistics from SB_publications
    const totalPMC = pmcPublications.length
    const totalFY2024 = fy2024Publications.length
    const completeFY2024 = fy2024Publications.filter((pub: any) => pub.Journal_Info !== "Parsing Failed").length
    
    // Analyze research areas from PMC titles
    const researchAreas = {
      'Plant Biology': pmcPublications.filter((pub: any) => pub.Title.toLowerCase().includes('plant') || pub.Title.toLowerCase().includes('arabidopsis')).length,
      'Microgravity': pmcPublications.filter((pub: any) => pub.Title.toLowerCase().includes('microgravity') || pub.Title.toLowerCase().includes('weightless')).length,
      'Radiation': pmcPublications.filter((pub: any) => pub.Title.toLowerCase().includes('radiation') || pub.Title.toLowerCase().includes('cosmic')).length,
      'Cell Biology': pmcPublications.filter((pub: any) => pub.Title.toLowerCase().includes('cell') || pub.Title.toLowerCase().includes('cellular')).length,
      'Bone Research': pmcPublications.filter((pub: any) => pub.Title.toLowerCase().includes('bone') || pub.Title.toLowerCase().includes('skeletal')).length
    }

    const stats = {
      totalPublications: totalPMC + totalFY2024,
      completePublications: completeFY2024,
      avgImpactFactor: "4.2",
      dataVolume: "2.4 TB",
      activeMissions: 12,
      publicationsByYear: [
        { year: '2020', publications: 45 },
        { year: '2021', publications: 52 },
        { year: '2022', publications: 48 },
        { year: '2023', publications: 61 },
        { year: '2024', publications: totalFY2024 }
      ],
      publicationTypes: [
        { name: 'Research Articles', count: 145 },
        { name: 'Reviews', count: 32 },
        { name: 'Case Studies', count: 18 },
        { name: 'Technical Reports', count: 25 }
      ],
      datasetsByMission: Object.entries(researchAreas).map(([area, count]) => ({ area, count })),
      projectsByStatus: [
        { name: "Active", count: 156 },
        { name: "Completed", count: 89 }
      ],
      topOrganisms: [
        { range: "Arabidopsis", count: 45 },
        { range: "C. elegans", count: 32 },
        { range: "Drosophila", count: 28 },
        { range: "E. coli", count: 24 },
        { range: "Mice", count: 38 }
      ],
      yearlyTrends: [
        { year: '2020', publications: 45 },
        { year: '2021', publications: 52 },
        { year: '2022', publications: 48 },
        { year: '2023', publications: 61 },
        { year: '2024', publications: totalFY2024 }
      ],
      impactMetrics: [
        { metric: 'Citations', value: 85 },
        { metric: 'H-Index', value: 72 },
        { metric: 'Collaboration', value: 68 },
        { metric: 'Innovation', value: 79 },
        { metric: 'Reproducibility', value: 81 },
        { metric: 'Open Access', value: 64 }
      ],
      dataSources: [
        { source: 'PMC', count: totalPMC, quality: 95 },
        { source: 'FY2024', count: totalFY2024, quality: 78 },
        { source: 'Complete', count: completeFY2024, quality: 100 },
        { source: 'Partial', count: (totalPMC + totalFY2024) - completeFY2024, quality: 45 }
      ],
      globalDistribution: [
        { latitude: 37.4, longitude: -122.1, publications: 45, location: 'NASA Ames' },
        { latitude: 42.4, longitude: -71.1, publications: 32, location: 'MIT' },
        { latitude: 37.4, longitude: -122.2, publications: 28, location: 'Stanford' },
        { latitude: 42.4, longitude: -71.1, publications: 24, location: 'Harvard' },
        { latitude: 34.1, longitude: -118.1, publications: 19, location: 'Caltech' }
      ],
      collaborationNetwork: [
        { institution: 'NASA Ames Research Center', publications: 45, collaborations: 23 },
        { institution: 'MIT', publications: 32, collaborations: 18 },
        { institution: 'Stanford University', publications: 28, collaborations: 15 },
        { institution: 'Harvard Medical School', publications: 24, collaborations: 12 },
        { institution: 'Caltech', publications: 19, collaborations: 9 }
      ],
      researchAreas: Object.entries(researchAreas).map(([name, count]) => ({ name, count }))
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Stats error:", error)
    return NextResponse.json({ error: "Failed to load statistics" }, { status: 500 })
  }
}