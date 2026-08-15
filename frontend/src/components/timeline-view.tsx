"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Search, Calendar, TrendingUp, Rocket, Play, Pause } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, AreaChart, Area } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function TimelineView() {
  const [searchTopic, setSearchTopic] = useState("")
  const [timelineData, setTimelineData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [animatedData, setAnimatedData] = useState<any[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentYear, setCurrentYear] = useState(2018)

  const analyzeTimeline = async () => {
    if (!searchTopic.trim()) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/timeline/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: searchTopic })
      })
      const data = await response.json()
      setTimelineData(data)
      setAnimatedData([])
      setCurrentYear(2018)
      setIsPlaying(false)
    } catch (error) {
      console.error('Timeline analysis failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    analyzeTimeline()
  }

  const toggleAnimation = () => {
    setIsPlaying(!isPlaying)
  }

  useEffect(() => {
    if (!isPlaying || !timelineData) return

    const interval = setInterval(() => {
      setCurrentYear(prev => {
        const nextYear = prev + 1
        if (nextYear > 2024) {
          setIsPlaying(false)
          return 2024
        }
        
        // Add data point for current year
        const yearData = timelineData.timeline.find((item: any) => parseInt(item.year) === nextYear)
        if (yearData) {
          setAnimatedData(prevData => {
            const newData = [...prevData, yearData]
            return newData
          })
        }
        
        return nextYear
      })
    }, 800) // 800ms per year

    return () => clearInterval(interval)
  }, [isPlaying, timelineData])

  useEffect(() => {
    if (timelineData && !isPlaying) {
      // Show all data when not playing
      setAnimatedData(timelineData.timeline)
    }
  }, [timelineData, isPlaying])

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Calendar className="size-5" />
            AI-Powered Timeline Analysis
          </CardTitle>
          <CardDescription className="text-blue-600">
            Explore topic evolution in NASA space biology research over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <Input
              placeholder="Enter research topic (e.g., microgravity, muscle atrophy, bone density)"
              value={searchTopic}
              onChange={(e) => setSearchTopic(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading || !searchTopic.trim()}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
            </Button>
          </form>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="size-8 animate-spin text-blue-500" />
              <span className="ml-2 text-blue-700">Analyzing topic evolution...</span>
            </div>
          )}

          {timelineData && (
            <div className="space-y-6">
              {/* Timeline Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="size-5 text-green-600" />
                    Publication Timeline: {searchTopic}
                  </CardTitle>
                  <CardDescription>
                    {timelineData.totalCount} publications found • Research evolution over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-center gap-4">
                    <Button 
                      onClick={toggleAnimation} 
                      variant={isPlaying ? "destructive" : "default"}
                      className="gap-2"
                    >
                      {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
                      {isPlaying ? 'Pause Evolution' : 'Play Evolution'}
                    </Button>
                    <div className="text-sm text-muted-foreground">
                      Current Year: <span className="font-bold text-blue-600">{currentYear}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Publications: <span className="font-bold text-green-600">
                        {animatedData.reduce((sum, item) => sum + (item.count || 0), 0)}
                      </span>
                    </div>
                  </div>
                  <ChartContainer
                    config={{
                      count: {
                        label: "Publications",
                        color: "#3b82f6",
                      },
                    }}
                    className="h-80"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={timelineData.timeline}>
                        <defs>
                          <linearGradient id="evolutionGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis 
                          dataKey="year" 
                          stroke="#64748b" 
                          type="category"
                        />
                        <YAxis stroke="#64748b" />
                        <ChartTooltip 
                          content={({ active, payload, label }) => {
                            if (active && payload && payload[0]) {
                              return (
                                <div className="bg-white p-3 border rounded shadow-lg">
                                  <p className="font-semibold">Year {label}</p>
                                  <p className="text-blue-600">Publications: {payload[0].value}</p>
                                  <p className="text-sm text-muted-foreground">Topic: {searchTopic}</p>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="count" 
                          stroke="#3b82f6" 
                          strokeWidth={3}
                          fill="url(#evolutionGradient)"
                          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                          activeDot={{ r: 8, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }}
                        />
                        {/* Current year indicator */}
                        {isPlaying && (
                          <ReferenceLine 
                            x={currentYear} 
                            stroke="#ef4444" 
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            label={{ value: `${currentYear}`, position: 'top' }}
                          />
                        )}
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Evolution Insights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-blue-800">
                      {timelineData.timeline?.reduce((sum: number, item: any) => sum + (item.count || 0), 0) || 0}
                    </div>
                    <div className="text-sm text-blue-600">Total Publications</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-green-100">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-800">
                      {Math.max(...(timelineData.timeline?.map((item: any) => item.count) || [0]))}
                    </div>
                    <div className="text-sm text-green-600">Peak Year Publications</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-purple-800">
                      {timelineData.timeline?.length || 0}
                    </div>
                    <div className="text-sm text-purple-600">Years of Research</div>
                  </CardContent>
                </Card>
              </div>

              {/* AI Summary */}
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-800">
                    <Rocket className="size-5" />
                    AI Research Evolution Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-purple-700 leading-relaxed">{timelineData.summary}</p>
                </CardContent>
              </Card>

              {/* NASA Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Rocket className="size-5 text-orange-600" />
                    NASA Milestones & Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {timelineData.events?.map((event: any, i: number) => (
                      <div key={i} className={`p-3 rounded border-l-4 ${
                        event.type === 'mission' ? 'border-red-400 bg-red-50' : 'border-yellow-400 bg-yellow-50'
                      }`}>
                        <div className="font-medium text-sm">{event.year} - {event.event}</div>
                        <div className="text-xs text-muted-foreground capitalize">{event.type}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Related Publications */}
              <Card>
                <CardHeader>
                  <CardTitle>Related Publications</CardTitle>
                  <CardDescription>Recent publications matching your search topic</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {timelineData.publications?.map((pub: any, i: number) => (
                      <div key={i} className="p-3 border rounded hover:bg-muted/50 transition-colors">
                        <div className="font-medium text-sm mb-1">{pub.Title}</div>
                        <div className="text-xs text-muted-foreground">
                          NASA Space Biology Research • 
                          <a href={pub.Link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                            View Publication
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {!timelineData && !loading && (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="size-12 mx-auto mb-4 opacity-50" />
              <p>Search for a research topic to view its timeline evolution</p>
              <p className="text-sm mt-2">Try: "microgravity", "bone density", "muscle atrophy", "radiation"</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}