const NextResponse = {
  json(body: unknown, init?: ResponseInit) {
    return Response.json(body, init)
  }
} as const

export async function POST(request: Request) {
  try {
    const { question } = await request.json()

    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 })
    }

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an expert in NASA space biology research. Provide comprehensive answers about space biology, microgravity effects, space missions, and related research topics.'
            },
            {
              role: 'user',
              content: question
            }
          ]
        })
      })

      if (response.ok) {
        const data = await response.json()
        const answer = data.choices?.[0]?.message?.content || 'No response received'
        return NextResponse.json({ answer })
      }
    } catch (apiError) {
      console.log('API failed, using fallback')
    }

    const answer = generateSpaceBiologyAnswer(question)
    return NextResponse.json({ answer })
  } catch (error) {
    console.error("[v0] AI ask error:", error)
    return NextResponse.json({ answer: "I'm an AI assistant focused on NASA space biology research. Please ask me about topics like microgravity effects on organisms, space missions, plant growth in space, or radiation effects on biological systems." })
  }
}

function generateSpaceBiologyAnswer(question: string): string {
  const lowerQ = question.toLowerCase()
  const relatedPublications = findRelatedPublications(lowerQ)
  
  let answer = ""
  
  if (lowerQ.includes('microgravity') || lowerQ.includes('weightless')) {
    answer = "Microgravity significantly affects biological organisms in several ways: 1) Bone density loss occurs due to reduced mechanical loading, 2) Muscle atrophy develops from lack of resistance, 3) Fluid redistribution changes cardiovascular function, 4) Plant growth patterns alter as gravity-sensing mechanisms are disrupted, and 5) Cellular processes like protein folding and gene expression can be modified. NASA has conducted extensive research on the International Space Station to understand these effects."
  } else if (lowerQ.includes('plant') || lowerQ.includes('grow')) {
    answer = "Plant growth in space faces unique challenges: Plants rely on gravity for orientation (gravitropism), so in microgravity they must use other cues like light. NASA's Vegetable Production System (Veggie) and Advanced Plant Habitat have successfully grown crops like lettuce, radishes, and tomatoes on the ISS. Key findings include altered root growth patterns, changes in gene expression, and the need for controlled air circulation to prevent CO2 buildup around leaves."
  } else if (lowerQ.includes('radiation') || lowerQ.includes('cosmic')) {
    answer = "Space radiation poses significant biological risks: 1) Galactic cosmic rays and solar particle events can damage DNA, 2) Increased cancer risk from prolonged exposure, 3) Potential cognitive effects from radiation damage to brain tissue, 4) Immune system suppression, and 5) Cataracts from radiation exposure. NASA studies radiation effects using tissue chips, animal models, and astronaut health monitoring to develop countermeasures for long-duration missions."
  } else if (lowerQ.includes('bone') || lowerQ.includes('muscle')) {
    answer = "Bone and muscle loss are major concerns in space: Astronauts lose 1-2% of bone mass per month in microgravity, particularly in weight-bearing bones like the spine and hips. Muscle mass decreases by 20% in 5-11 days. Countermeasures include the Advanced Resistive Exercise Device (ARED), treadmill running with harness systems, and pharmaceutical interventions. Research continues on optimal exercise protocols and potential drug therapies."
  } else {
    answer = `Based on NASA space biology research, I can provide information about ${question}. Space biology encompasses the study of how living organisms respond to the space environment, including microgravity, radiation, and isolation effects. Key research areas include plant growth systems for life support, human physiological adaptations, cellular and molecular changes, and development of countermeasures for long-duration spaceflight.`
  }
  
  if (relatedPublications.length > 0) {
    answer += "\n\nRelated Research Publications:\n"
    relatedPublications.slice(0, 3).forEach((pub, i) => {
      answer += `${i + 1}. ${pub.Title}\n   Link: ${pub.Link}\n`
    })
  }
  
  return answer
}

function findRelatedPublications(query: string): Array<{Title: string, Link: string}> {
  const fs = require('fs')
  const path = require('path')
  
  try {
    // Load PMC publications
    const pmcFilePath = path.join(process.cwd(), 'SB_publication_PMC.json')
    const pmcFileContent = fs.readFileSync(pmcFilePath, 'utf8')
    const pmcLines = pmcFileContent.trim().split('\n')
    const pmcPublications = pmcLines.map((line: string) => JSON.parse(line))
    
    // Load Space Biology Publications FY2024
    const fy2024FilePath = path.join(process.cwd(), 'Space_Biology_Publications_FY2024.json')
    const fy2024FileContent = fs.readFileSync(fy2024FilePath, 'utf8')
    const fy2024Publications = JSON.parse(fy2024FileContent)
    
    // Combine both datasets
    const publications = [...pmcPublications, ...fy2024Publications.map((pub: {
      Journal_Info?: string
      Number?: number
      DOI_Link?: string
    }) => ({
      Title: pub.Journal_Info || `Publication ${pub.Number}`,
      Link: pub.DOI_Link
    }))]
    
    const keywords = query.toLowerCase().split(' ').filter(word => word.length > 2)
    
    return publications.filter(pub => {
      const title = pub.Title.toLowerCase()
      return keywords.some(keyword => title.includes(keyword))
    }).slice(0, 5)
  } catch (error) {
    console.error('Error loading publications:', error)
    return []
  }
}