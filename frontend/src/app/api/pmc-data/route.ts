import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const pmcPath = path.join(process.cwd(), '..', 'datasets', 'SB_publication_PMC.json')
    const pmcContent = fs.readFileSync(pmcPath, 'utf8')
    const pmcLines = pmcContent.trim().split('\n')
    const pmcData = pmcLines.map(line => JSON.parse(line))
    
    return NextResponse.json({ results: pmcData })
  } catch (error) {
    return NextResponse.json({ results: [] })
  }
}