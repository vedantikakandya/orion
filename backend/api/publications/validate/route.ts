import { NextResponse } from "next/server"
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'Space_Biology_Publications_FY2024.json')
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const publications = JSON.parse(fileContent)

    const knownInvalidDOIs = [
      "10.1096/5.202300506RR",
      "10.2478/gsr-2023-0001"
    ]

    const validationResults = publications.map((pub) => {
      const doi = pub.DOI_Link.replace('https://doi.org/', '')
      const isValid = !knownInvalidDOIs.includes(doi) && !pub.DOI_Link.includes('pubmed')
      
      return {
        number: pub.Number,
        doi: pub.DOI_Link,
        valid: isValid,
        alternativeSearch: generateSearchURL(pub.Journal_Info),
        hasJournalInfo: pub.Journal_Info !== "Parsing Failed"
      }
    })

    const validCount = validationResults.filter(r => r.valid).length
    const invalidDOIs = validationResults.filter(r => !r.valid)

    return NextResponse.json({
      totalChecked: validationResults.length,
      validCount,
      invalidCount: invalidDOIs.length,
      invalidDOIs: invalidDOIs.slice(0, 10),
      validationRate: (validCount / validationResults.length * 100).toFixed(1)
    })
  } catch (error) {
    console.error("DOI validation error:", error)
    return NextResponse.json({ error: "Failed to validate DOIs" }, { status: 500 })
  }
}

function generateSearchURL(journalInfo: string): string {
  if (!journalInfo || journalInfo === "Parsing Failed") {
    return ""
  }
  
  const titleMatch = journalInfo.match(/^([^.]+)\./)
  const title = titleMatch ? titleMatch[1].trim() : journalInfo.substring(0, 100)
  
  return `https://scholar.google.com/scholar?q=${encodeURIComponent(title)}`
}