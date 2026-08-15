"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Search, Database } from "lucide-react"

interface KnowledgeGraphVizProps {
  filters: any
}

export function KnowledgeGraphViz({ filters }: KnowledgeGraphVizProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedPublication, setSelectedPublication] = useState<any>(null)
  const [knowledgeGraph, setKnowledgeGraph] = useState<any>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    if (knowledgeGraph && canvasRef.current) {
      drawGraph()
    }
  }, [knowledgeGraph])

  const drawGraph = () => {
    const canvas = canvasRef.current
    if (!canvas || !knowledgeGraph) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.fillStyle = '#f8fafc'
    ctx.fillRect(0, 0, width, height)

    const { entities, relationships } = knowledgeGraph
    if (!entities || entities.length === 0) return

    // Position entities in a circle with better spacing
    const centerX = width / 2
    const centerY = height / 2 - 40
    const radius = Math.min(width - 200, height - 200) / 2
    
    const entityPositions = new Map()
    entities.forEach((entity: any, i: number) => {
      const angle = (i / entities.length) * 2 * Math.PI
      entityPositions.set(entity.id, {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        entity
      })
    })

    // Draw relationships first (behind nodes)
    if (relationships) {
      relationships.forEach((rel: any) => {
        const source = entityPositions.get(rel.source)
        const target = entityPositions.get(rel.target)
        if (source && target) {
          const color = rel.type === 'causes' ? '#ef4444' : 
                       rel.type === 'affects' ? '#3b82f6' : 
                       rel.type === 'regulates' ? '#8b5cf6' : '#6b7280'
          
          // Draw line
          ctx.strokeStyle = color
          ctx.lineWidth = Math.max(1, rel.strength * 4)
          ctx.globalAlpha = 0.7
          ctx.beginPath()
          ctx.moveTo(source.x, source.y)
          ctx.lineTo(target.x, target.y)
          ctx.stroke()
          ctx.globalAlpha = 1
          
          // Draw relationship label with background
          const midX = (source.x + target.x) / 2
          const midY = (source.y + target.y) / 2
          const text = rel.type.toUpperCase()
          
          ctx.font = '9px Arial'
          ctx.textAlign = 'center'
          const textWidth = ctx.measureText(text).width
          
          // Background rectangle
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
          ctx.fillRect(midX - textWidth/2 - 2, midY - 8, textWidth + 4, 12)
          
          // Text
          ctx.fillStyle = color
          ctx.fillText(text, midX, midY)
        }
      })
    }

    // Draw entities
    entities.forEach((entity: any) => {
      const pos = entityPositions.get(entity.id)
      if (!pos) return
      
      const color = entity.importance === 'high' ? '#10b981' : 
                   entity.importance === 'medium' ? '#f59e0b' : '#3b82f6'
      const size = entity.importance === 'high' ? 25 : 
                  entity.importance === 'medium' ? 20 : 15
      
      // Draw node circle
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, size, 0, 2 * Math.PI)
      ctx.fill()
      
      // Draw white border
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.stroke()
      
      // Draw entity name with background
      ctx.font = 'bold 11px Arial'
      ctx.textAlign = 'center'
      const name = entity.name.length > 15 ? entity.name.substring(0, 12) + '...' : entity.name
      const textWidth = ctx.measureText(name).width
      
      // Background rectangle for text
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
      ctx.fillRect(pos.x - textWidth/2 - 3, pos.y + size + 5, textWidth + 6, 16)
      
      // Entity name
      ctx.fillStyle = '#1f2937'
      ctx.fillText(name, pos.x, pos.y + size + 16)
    })

    // Draw legend with background
    const legendY = height - 60
    
    // Legend background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
    ctx.fillRect(10, legendY - 15, width - 20, 50)
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1
    ctx.strokeRect(10, legendY - 15, width - 20, 50)
    
    ctx.fillStyle = '#1f2937'
    ctx.font = '11px Arial'
    ctx.textAlign = 'left'
    
    // Importance legend
    ctx.fillText('Importance:', 20, legendY)
    const importanceItems = [
      { color: '#10b981', label: 'High', x: 20 },
      { color: '#f59e0b', label: 'Medium', x: 80 },
      { color: '#3b82f6', label: 'Low', x: 150 }
    ]
    
    importanceItems.forEach(item => {
      ctx.fillStyle = item.color
      ctx.beginPath()
      ctx.arc(item.x + 10, legendY + 15, 6, 0, 2 * Math.PI)
      ctx.fill()
      ctx.fillStyle = '#1f2937'
      ctx.fillText(item.label, item.x + 20, legendY + 19)
    })

    // Relationship legend
    ctx.fillText('Relationships:', 250, legendY)
    const relTypes = [
      { type: 'causes', color: '#ef4444', x: 250 },
      { type: 'affects', color: '#3b82f6', x: 320 },
      { type: 'regulates', color: '#8b5cf6', x: 390 }
    ]
    
    relTypes.forEach(rel => {
      ctx.strokeStyle = rel.color
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(rel.x + 10, legendY + 15)
      ctx.lineTo(rel.x + 25, legendY + 15)
      ctx.stroke()
      ctx.fillStyle = '#1f2937'
      ctx.fillText(rel.type, rel.x + 30, legendY + 19)
    })
  }

  const searchPublications = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }
    
    setSearching(true)
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      })
      const data = await response.json()
      setSearchResults(data.results?.slice(0, 8) || [])
    } catch (error) {
      console.error('Failed to search publications:', error)
      setSearchResults([])
    } finally {
      setSearching(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchPublications(searchQuery)
  }

  const analyzePublication = async (publication: any) => {
    setSelectedPublication(publication)
    setAnalyzing(true)
    setKnowledgeGraph(null)
    
    try {
      const response = await fetch('/api/knowledge-graph/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: publication.title })
      })
      const data = await response.json()
      setKnowledgeGraph(data.knowledgeGraph)
    } catch (error) {
      console.error('Failed to analyze publication:', error)
    } finally {
      setAnalyzing(false)
    }
  }





  const drawNode = (ctx: CanvasRenderingContext2D, x: number, y: number, label: string, color: string, size: number) => {
    // Node circle
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x, y, size, 0, 2 * Math.PI)
    ctx.fill()
    
    // Node border
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 2
    ctx.stroke()
    
    // Label
    ctx.fillStyle = "#ffffff"
    ctx.font = "12px Arial"
    ctx.textAlign = "center"
    ctx.fillText(label, x, y + size + 20)
    ctx.textAlign = "left"
  }

  const drawRelationship = (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, label: string, color: string) => {
    // Arrow line
    ctx.strokeStyle = color
    ctx.lineWidth = 3
    drawArrow(ctx, x1 + 25, y1, x2 - 25, y2, color)
    
    // Relationship label
    const midX = (x1 + x2) / 2
    const midY = (y1 + y2) / 2 - 10
    ctx.fillStyle = color
    ctx.font = "bold 14px Arial"
    ctx.textAlign = "center"
    ctx.fillText(label, midX, midY)
    ctx.textAlign = "left"
  }

  const drawConnection = (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string) => {
    ctx.strokeStyle = color
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
    ctx.setLineDash([])
  }

  const drawArrow = (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string) => {
    const angle = Math.atan2(y2 - y1, x2 - x1)
    
    // Line
    ctx.strokeStyle = color
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
    
    // Arrowhead
    const headLength = 15
    ctx.beginPath()
    ctx.moveTo(x2, y2)
    ctx.lineTo(x2 - headLength * Math.cos(angle - Math.PI / 6), y2 - headLength * Math.sin(angle - Math.PI / 6))
    ctx.moveTo(x2, y2)
    ctx.lineTo(x2 - headLength * Math.cos(angle + Math.PI / 6), y2 - headLength * Math.sin(angle + Math.PI / 6))
    ctx.stroke()
  }



  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="size-5" />
          Knowledge Graph Analysis
        </CardTitle>
        <CardDescription>
          Search and analyze NASA space biology research to generate knowledge graphs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            placeholder="Search NASA space biology research..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={searching || !searchQuery.trim()}>
            {searching ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
          </Button>
        </form>

        {/* Search Results */}
        {searchResults.length > 0 && !selectedPublication && (
          <div className="space-y-2">
            <h3 className="font-medium">Search Results:</h3>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {searchResults.map((pub, i) => (
                <button
                  key={i}
                  onClick={() => analyzePublication(pub)}
                  className="w-full text-left p-3 border rounded hover:bg-muted transition-colors"
                >
                  <div className="font-medium text-sm">{pub.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{pub.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Analysis Loading */}
        {analyzing && (
          <div className="flex items-center justify-center py-8 border rounded">
            <Loader2 className="size-6 animate-spin mr-2" />
            <span>Analyzing research with AI...</span>
          </div>
        )}

        {/* Knowledge Graph Results */}
        {knowledgeGraph && selectedPublication && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Analysis Results</h3>
              <Button 
                onClick={() => { setSelectedPublication(null); setKnowledgeGraph(null) }}
                variant="outline" 
                size="sm"
              >
                New Search
              </Button>
            </div>
            
            <div className="p-4 border rounded bg-muted/50">
              <h4 className="font-medium mb-2">Research: {selectedPublication.title.substring(0, 100)}...</h4>
            </div>

            {/* Visual Graph */}
            <div className="border rounded p-4">
              <h4 className="font-medium mb-4">Knowledge Graph Visualization</h4>
              <canvas 
                ref={canvasRef} 
                width={800} 
                height={500} 
                className="w-full border rounded bg-slate-50" 
              />
            </div>

            {/* Entities */}
            <div>
              <h4 className="font-medium mb-2">Key Entities</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {knowledgeGraph.entities?.map((entity: any, i: number) => (
                  <div key={i} className={`p-2 rounded text-sm ${
                    entity.importance === 'high' ? 'bg-green-100 border-green-300' :
                    entity.importance === 'medium' ? 'bg-yellow-100 border-yellow-300' :
                    'bg-blue-100 border-blue-300'
                  } border`}>
                    <div className="font-medium">{entity.name}</div>
                    <div className="text-xs text-muted-foreground">{entity.type}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Relationships */}
            <div>
              <h4 className="font-medium mb-2">Relationships</h4>
              <div className="space-y-2">
                {knowledgeGraph.relationships?.map((rel: any, i: number) => {
                  const sourceEntity = knowledgeGraph.entities?.find((e: any) => e.id === rel.source)
                  const targetEntity = knowledgeGraph.entities?.find((e: any) => e.id === rel.target)
                  return (
                    <div key={i} className="p-3 border rounded bg-muted/30">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">{sourceEntity?.name}</span>
                        <span className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs">
                          {rel.type.toUpperCase()}
                        </span>
                        <span className="font-medium">{targetEntity?.name}</span>
                        <span className="text-muted-foreground">({Math.round(rel.strength * 100)}%)</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Predictions */}
            {knowledgeGraph.predictions?.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">AI Predictions</h4>
                <div className="space-y-2">
                  {knowledgeGraph.predictions.map((pred: any, i: number) => (
                    <div key={i} className="p-3 border rounded bg-yellow-50">
                      <div className="font-medium text-sm">{pred.entity1} ↔ {pred.entity2}</div>
                      <div className="text-sm mt-1">{pred.prediction}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Confidence: {Math.round(pred.confidence * 100)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!selectedPublication && searchResults.length === 0 && !searching && (
          <div className="text-center py-8 text-muted-foreground">
            <Database className="size-12 mx-auto mb-4 opacity-50" />
            <p>Search for NASA space biology research to generate knowledge graphs</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
