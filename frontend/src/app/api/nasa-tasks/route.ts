import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { keyword } = await request.json()
    
    const mockTasks = [
      {
        id: "11985",
        title: "Space Biology Research - Microgravity Effects on Plant Growth",
        pi: "Dr. Sarah Johnson",
        organization: "NASA Ames Research Center",
        status: "Active",
        funding: "$2,500,000",
        investmentPotential: "High",
        description: "Investigating how microgravity affects plant cellular processes and growth patterns for future Mars missions.",
        link: "https://taskbook.nasaprs.com/tbp/index.cfm"
      },
      {
        id: "12001",
        title: "Radiation Effects on Human Cardiovascular System",
        pi: "Dr. Michael Chen",
        organization: "Johnson Space Center",
        status: "Active",
        funding: "$1,800,000",
        investmentPotential: "High",
        description: "Studying long-term radiation exposure effects on astronaut cardiovascular health.",
        link: "https://taskbook.nasaprs.com/tbp/index.cfm"
      },
      {
        id: "11967",
        title: "Biofilm Formation in Microgravity Environments",
        pi: "Dr. Lisa Rodriguez",
        organization: "JPL",
        status: "Planning",
        funding: "$3,200,000",
        investmentPotential: "Medium",
        description: "Understanding bacterial biofilm behavior in space environments for spacecraft safety.",
        link: "https://taskbook.nasaprs.com/tbp/index.cfm"
      },
      {
        id: "12045",
        title: "Bone Density Loss Prevention in Long-Duration Spaceflight",
        pi: "Dr. Robert Kim",
        organization: "NASA Ames Research Center",
        status: "Active",
        funding: "$2,100,000",
        investmentPotential: "High",
        description: "Developing countermeasures for bone density loss during extended space missions.",
        link: "https://taskbook.nasaprs.com/tbp/index.cfm"
      },
      {
        id: "11923",
        title: "Cellular Response to Space Radiation",
        pi: "Dr. Amanda Foster",
        organization: "Glenn Research Center",
        status: "Completed",
        funding: "$1,500,000",
        investmentPotential: "Medium",
        description: "Analyzing cellular DNA repair mechanisms under space radiation conditions.",
        link: "https://taskbook.nasaprs.com/tbp/index.cfm"
      }
    ]

    let filteredTasks = mockTasks
    if (keyword && keyword.trim()) {
      const searchTerm = keyword.toLowerCase()
      filteredTasks = mockTasks.filter(task => 
        task.title.toLowerCase().includes(searchTerm) ||
        task.description.toLowerCase().includes(searchTerm) ||
        task.pi.toLowerCase().includes(searchTerm)
      )
    }

    return NextResponse.json({ 
      success: true, 
      tasks: filteredTasks,
      totalTasks: filteredTasks.length
    })
  } catch (error) {
    console.error("NASA Tasks API error:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to fetch NASA tasks" 
    }, { status: 500 })
  }
}