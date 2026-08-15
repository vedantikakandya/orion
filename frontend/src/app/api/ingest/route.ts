import { NextResponse } from "next/server"
import { fetchPublicationsFromCSV, ingestPublications } from "@/lib/ingestion/publications"
import { fetchDatasetsFromOSDR, ingestDatasets } from "@/lib/ingestion/datasets"
import { fetchLibraryItemsFromNSLSL, ingestLibraryItems } from "@/lib/ingestion/library-items"
import { fetchProjectsFromTaskBook, ingestProjects } from "@/lib/ingestion/projects"

export async function POST(request: Request) {
  try {
    const { source, url } = await request.json()

    let count = 0
    let message = ""

    switch (source) {
      case "publications": {
        const data = await fetchPublicationsFromCSV(url)
        count = await ingestPublications(data)
        message = `Ingested ${count} publications`
        break
      }
      case "datasets": {
        const data = await fetchDatasetsFromOSDR(url)
        count = await ingestDatasets(data)
        message = `Ingested ${count} datasets`
        break
      }
      case "library": {
        const data = await fetchLibraryItemsFromNSLSL(url)
        count = await ingestLibraryItems(data)
        message = `Ingested ${count} library items`
        break
      }
      case "projects": {
        const data = await fetchProjectsFromTaskBook(url)
        count = await ingestProjects(data)
        message = `Ingested ${count} projects`
        break
      }
      case "all": {
        // Ingest from all sources
        const [pubs, datasets, library, projects] = await Promise.all([
          fetchPublicationsFromCSV(url || ""),
          fetchDatasetsFromOSDR(),
          fetchLibraryItemsFromNSLSL(),
          fetchProjectsFromTaskBook(),
        ])

        const counts = await Promise.all([
          ingestPublications(pubs),
          ingestDatasets(datasets),
          ingestLibraryItems(library),
          ingestProjects(projects),
        ])

        count = counts.reduce((a, b) => a + b, 0)
        message = `Ingested ${counts[0]} publications, ${counts[1]} datasets, ${counts[2]} library items, ${counts[3]} projects`
        break
      }
      default:
        return NextResponse.json({ error: "Invalid source" }, { status: 400 })
    }

    return NextResponse.json({ success: true, count, message })
  } catch (error) {
    console.error("[v0] Ingestion error:", error)
    return NextResponse.json({ error: "Ingestion failed" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Data ingestion API",
    endpoints: {
      POST: "Ingest data from NASA sources",
      body: {
        source: "publications | datasets | library | projects | all",
        url: "Optional: Custom API URL or CSV URL",
      },
    },
  })
}
