import { NextResponse } from "next/server"
import fs from 'fs'
import path from 'path'

export async function POST(request: Request) {
  try {
    const { format, filters } = await request.json()
    
    const filePath = path.join(process.cwd(), 'Space_Biology_Publications_FY2024.json')
    const fileContent = fs.readFileSync(filePath, 'utf8')
    let publications = JSON.parse(fileContent)

    // Apply filters
    if (filters?.impactFilter && filters.impactFilter !== "all") {
      publications = publications.filter(pub => {
        const impact = parseFloat(pub.Journal_Impact_Factor)
        if (filters.impactFilter === "high") return impact >= 10
        if (filters.impactFilter === "medium") return impact >= 5 && impact < 10
        if (filters.impactFilter === "low") return impact < 5
        return true
      })
    }

    if (filters?.searchTerm) {
      publications = publications.filter(pub =>
        pub.Journal_Info.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        pub.DOI_Link.toLowerCase().includes(filters.searchTerm.toLowerCase())
      )
    }

    let exportData = ""
    let filename = ""
    let contentType = ""

    switch (format) {
      case "csv":
        exportData = generateCSV(publications)
        filename = "fy2024_publications.csv"
        contentType = "text/csv"
        break
      case "json":
        exportData = JSON.stringify(publications, null, 2)
        filename = "fy2024_publications.json"
        contentType = "application/json"
        break
      case "html":
        exportData = generateHTML(publications)
        filename = "fy2024_publications.html"
        contentType = "text/html"
        break
      default:
        return NextResponse.json({ error: "Invalid format" }, { status: 400 })
    }

    return new NextResponse(exportData, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    })

  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json({ error: "Failed to export data" }, { status: 500 })
  }
}

function generateCSV(publications: any[]) {
  const headers = ["Number", "Authors", "Title", "Journal_Info", "DOI_Link", "Journal_Impact_Factor"]
  const rows = publications.map(pub => [
    pub.Number,
    pub.Authors,
    pub.Title,
    pub.Journal_Info,
    pub.DOI_Link,
    pub.Journal_Impact_Factor
  ])
  
  return [headers, ...rows].map(row => 
    row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(",")
  ).join("\n")
}

function generateHTML(publications: any[]) {
  const validPubs = publications.filter(p => p.Journal_Info !== "Parsing Failed")
  
  return `
<!DOCTYPE html>
<html>
<head>
    <title>NASA Space Biology Publications FY2024</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #1e40af; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .publication { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px; }
        .impact-high { border-left: 4px solid #16a34a; }
        .impact-medium { border-left: 4px solid #2563eb; }
        .impact-low { border-left: 4px solid #dc2626; }
        .doi-link { color: #1e40af; text-decoration: none; }
        .stats { background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>NASA Space Biology Publications FY2024</h1>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
    </div>
    
    <div class="stats">
        <h3>Summary Statistics</h3>
        <p><strong>Total Publications:</strong> ${publications.length}</p>
        <p><strong>Parsed Entries:</strong> ${validPubs.length}</p>
        <p><strong>High Impact (≥10):</strong> ${publications.filter(p => parseFloat(p.Journal_Impact_Factor) >= 10).length}</p>
    </div>

    ${publications.map(pub => {
      const impact = parseFloat(pub.Journal_Impact_Factor)
      const impactClass = impact >= 10 ? 'impact-high' : impact >= 5 ? 'impact-medium' : 'impact-low'
      
      return `
        <div class="publication ${impactClass}">
            <h4>Publication #${pub.Number}</h4>
            ${pub.Journal_Info !== "Parsing Failed" ? 
              `<p><strong>Details:</strong> ${pub.Journal_Info}</p>` : 
              `<p><em>Publication details not available</em></p>`
            }
            <p><strong>Impact Factor:</strong> ${pub.Journal_Impact_Factor}</p>
            <p><strong>DOI:</strong> <a href="${pub.DOI_Link}" class="doi-link" target="_blank">${pub.DOI_Link}</a></p>
        </div>
      `
    }).join('')}
</body>
</html>`
}