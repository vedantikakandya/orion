import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const pmcPath = path.join(process.cwd(), '..', 'datasets', 'SB_publication_PMC.json')
    const fy2024Path = path.join(process.cwd(), '..', 'datasets', 'Space_Biology_Publications_FY2024.json')
    
    const pmcExists = fs.existsSync(pmcPath)
    const fy2024Exists = fs.existsSync(fy2024Path)
    
    let pmcCount = 0
    let fy2024Count = 0
    
    if (pmcExists) {
      const pmcContent = fs.readFileSync(pmcPath, 'utf8')
      pmcCount = pmcContent.trim().split('\n').length
    }
    
    if (fy2024Exists) {
      const fy2024Content = fs.readFileSync(fy2024Path, 'utf8')
      fy2024Count = JSON.parse(fy2024Content).length
    }
    
    return NextResponse.json({
      status: 'success',
      files: {
        pmc: { exists: pmcExists, count: pmcCount },
        fy2024: { exists: fy2024Exists, count: fy2024Count }
      }
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error.message
    })
  }
}