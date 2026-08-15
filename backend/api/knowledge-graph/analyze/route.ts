const NextResponse = {
  json(body: unknown, init?: ResponseInit) {
    return Response.json(body, init)
  }
} as const
export async function POST(request: Request) {
  try {
    const { title } = await request.json()

    if (!title) {
      return NextResponse.json({ error: "No title provided" }, { status: 400 })
    }

    // Generate knowledge graph using AI
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat',
        messages: [{
          role: 'user',
          content: `Analyze this NASA space biology research title and extract a knowledge graph: "${title}"

Return a JSON object with this exact structure:
{
  "entities": [
    {"id": "1", "name": "Entity Name", "type": "organism|condition|process|outcome", "importance": "high|medium|low"}
  ],
  "relationships": [
    {"source": "1", "target": "2", "type": "causes|affects|regulates|inhibits|enhances", "strength": 0.8}
  ],
  "predictions": [
    {"entity1": "Entity A", "entity2": "Entity B", "prediction": "Brief prediction", "confidence": 0.7}
  ]
}

Focus on space biology concepts like microgravity, radiation, organisms, cellular processes, and physiological changes.`
        }],
        max_tokens: 1000,
        temperature: 0.3
      })
    })

    if (response.ok) {
      const data = await response.json()
      const content = data.choices[0]?.message?.content
      
      try {
        // Try to parse JSON from AI response
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const knowledgeGraph = JSON.parse(jsonMatch[0])
          return NextResponse.json({ knowledgeGraph })
        }
      } catch (parseError) {
        console.error('JSON parse error:', parseError)
      }
    }

    // Fallback knowledge graph
    const fallbackGraph = generateFallbackGraph(title)
    return NextResponse.json({ knowledgeGraph: fallbackGraph })

  } catch (error) {
    console.error("Knowledge graph analysis error:", error)
    
    // Return fallback on error
    const fallbackGraph = generateFallbackGraph("Space Biology Research")
    return NextResponse.json({ knowledgeGraph: fallbackGraph })
  }
}

function generateFallbackGraph(title: string) {
  const entities = [
    { id: "1", name: "Microgravity", type: "condition", importance: "high" },
    { id: "2", name: "Cellular Function", type: "process", importance: "high" },
    { id: "3", name: "Gene Expression", type: "process", importance: "medium" },
    { id: "4", name: "Muscle Atrophy", type: "outcome", importance: "high" },
    { id: "5", name: "Bone Density", type: "outcome", importance: "medium" }
  ]

  const relationships = [
    { source: "1", target: "2", type: "affects", strength: 0.9 },
    { source: "1", target: "4", type: "causes", strength: 0.8 },
    { source: "2", target: "3", type: "regulates", strength: 0.7 },
    { source: "3", target: "4", type: "influences", strength: 0.6 },
    { source: "1", target: "5", type: "reduces", strength: 0.7 }
  ]

  const predictions = [
    { entity1: "Microgravity", entity2: "Immune System", prediction: "May compromise immune response", confidence: 0.8 },
    { entity1: "Gene Expression", entity2: "Adaptation", prediction: "Could lead to cellular adaptation mechanisms", confidence: 0.7 }
  ]

  return { entities, relationships, predictions }
}