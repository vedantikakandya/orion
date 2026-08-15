import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { researchArea } = await request.json()

    if (!researchArea) {
      return NextResponse.json({ error: "Research area is required" }, { status: 400 })
    }

    const analysis = generateGapAnalysis(researchArea)
    return NextResponse.json(analysis)
  } catch (error) {
    console.error("[v0] Gap analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze gaps" }, { status: 500 })
  }
}

function generateGapAnalysis(researchArea: string): any {
  const lowerArea = researchArea.toLowerCase()
  
  if (lowerArea.includes('plant') || lowerArea.includes('botany')) {
    return {
      summary: "Plant biology in space has made significant progress with successful crop growth on the ISS, but several gaps remain in our understanding of long-term cultivation and nutritional optimization.",
      gaps: [
        "Limited understanding of multi-generational plant reproduction in microgravity",
        "Insufficient data on soil-less growing systems for Mars missions",
        "Lack of research on plant-microbe interactions in space environments",
        "Limited studies on plant stress responses to combined space stressors"
      ],
      recommendations: [
        "Conduct multi-generation plant breeding experiments on the ISS",
        "Develop closed-loop bioregenerative life support systems",
        "Study beneficial microorganisms for plant health in space",
        "Research genetic modifications for enhanced space adaptation"
      ]
    }
  }
  
  if (lowerArea.includes('human') || lowerArea.includes('physiology')) {
    return {
      summary: "Human physiological adaptation to space is well-documented for short missions, but long-duration effects and countermeasures need further development for Mars exploration.",
      gaps: [
        "Limited data on psychological effects of long-duration isolation",
        "Insufficient understanding of immune system changes over time",
        "Lack of effective countermeasures for radiation exposure",
        "Unknown effects of partial gravity environments like Mars"
      ],
      recommendations: [
        "Conduct longer-duration analog studies on Earth",
        "Develop advanced radiation shielding technologies",
        "Study immune system function in extended spaceflight",
        "Research artificial gravity systems for long missions"
      ]
    }
  }
  
  return {
    summary: `Research in ${researchArea} for space biology applications shows promise but requires focused investigation to address critical knowledge gaps for future exploration missions.`,
    gaps: [
      "Limited long-duration studies in space environment",
      "Insufficient understanding of combined stressor effects",
      "Lack of standardized protocols for space research"
    ],
    recommendations: [
      "Increase experiment duration and sample sizes",
      "Develop integrated research approaches",
      "Establish standardized methodologies for space biology research"
    ]
  }
}