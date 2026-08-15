import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const fy2024Path = path.join(process.cwd(), '..', 'datasets', 'Space_Biology_Publications_FY2024.json')
    const fy2024Content = fs.readFileSync(fy2024Path, 'utf8')
    const fy2024Data = JSON.parse(fy2024Content)
    
    return NextResponse.json({ results: fy2024Data })
  } catch (error) {
    return NextResponse.json({ results: [] })
  }
}