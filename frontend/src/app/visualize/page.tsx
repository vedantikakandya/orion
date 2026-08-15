"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Database, Network, TrendingUp, BarChart3 } from "lucide-react"
import Link from "next/link"
import { KnowledgeGraphViz } from "@/components/knowledge-graph-viz"
import { TimelineView } from "@/components/timeline-view"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, ScatterChart, Scatter, ComposedChart, Tooltip } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"

export default function VisualizePage() {
  const [stats, setStats] = useState<any>(null)
  const [pmcData, setPmcData] = useState<any[]>([])
  const [fy2024Data, setFy2024Data] = useState<any[]>([])

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const statsRes = await fetch('/api/visualizations/stats')
      if (!statsRes.ok) throw new Error('Stats API failed')
      const statsData = await statsRes.json()
      setStats(statsData)
      
      try {
        const pmcRes = await fetch('/api/pmc-data')
        if (pmcRes.ok) {
          const pmcData = await pmcRes.json()
          setPmcData(pmcData.results || [])
        }
      } catch (e) { console.log('PMC data unavailable') }
      
      try {
        const fy2024Res = await fetch('/api/fy2024-data')
        if (fy2024Res.ok) {
          const fy2024Data = await fy2024Res.json()
          setFy2024Data(fy2024Data.results || [])
        }
      } catch (e) { console.log('FY2024 data unavailable') }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
  }

  const COLORS = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57", "#ff9ff3", "#54a0ff", "#5f27cd", "#00d2d3", "#ff9f43", "#10ac84", "#ee5a24"]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-lg bg-primary text-primary-foreground">
              <Database className="size-6" />
            </div>
            <div>
              <span className="text-xl font-bold text-foreground">ORION</span>
              <p className="text-xs text-muted-foreground">Organism Research & Insights On NASA</p>
            </div>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/search" className="text-sm font-medium text-muted-foreground">Search</Link>
            <Link href="/discover" className="text-sm font-medium text-muted-foreground">Discover</Link>
            <Link href="/visualize" className="text-sm font-medium text-muted-foreground">Visualize</Link>
            <Link href="/community" className="text-sm font-medium text-muted-foreground">Community</Link>
            <Link href="/investments" className="text-sm font-medium text-muted-foreground">Investments</Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Interactive Visualizations</h2>
          <p className="text-muted-foreground">Explore research data through interactive charts and graphs</p>
        </div>

        <Tabs defaultValue="stats" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="mission">Mission Analysis</TabsTrigger>
            <TabsTrigger value="graph">Knowledge Graph</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-6">
            {stats ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                  <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-100">Total Publications</p>
                          <p className="text-3xl font-bold">{stats.totalPublications}</p>
                          <p className="text-xs text-blue-200 mt-1">PMC + FY2024</p>
                        </div>
                        <Database className="h-10 w-10 text-blue-200" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-100">PMC Database</p>
                          <p className="text-3xl font-bold">{pmcData.length}</p>
                          <p className="text-xs text-green-200 mt-1">Research Papers</p>
                        </div>
                        <Network className="h-10 w-10 text-green-200" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-purple-100">FY2024 Biology</p>
                          <p className="text-3xl font-bold">{fy2024Data.length}</p>
                          <p className="text-xs text-purple-200 mt-1">NASA Publications</p>
                        </div>
                        <BarChart3 className="h-10 w-10 text-purple-200" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-xl">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-orange-100">Complete Details</p>
                          <p className="text-3xl font-bold">{stats.completePublications}</p>
                          <p className="text-xs text-orange-200 mt-1">Full Metadata</p>
                        </div>
                        <TrendingUp className="h-10 w-10 text-orange-200" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white border-0 shadow-xl">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-pink-100">Avg Impact</p>
                          <p className="text-3xl font-bold">4.2</p>
                          <p className="text-xs text-pink-200 mt-1">Factor Score</p>
                        </div>
                        <div className="h-10 w-10 bg-pink-400 rounded-full flex items-center justify-center text-pink-800 font-bold">★</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center size-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                            <TrendingUp className="size-5" />
                          </div>
                          <div>
                            <CardTitle className="text-purple-800">Publications by Year</CardTitle>
                            <CardDescription className="text-purple-600">Growth trend over time (2018-2024)</CardDescription>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-purple-800">{stats.publicationsByYear?.reduce((sum, item) => sum + (item.publications || item.count || 0), 0)}</p>
                          <p className="text-sm text-purple-600">Total Publications</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={{
                          publications: {
                            label: "Publications",
                            color: "#8b5cf6",
                          },
                        }}
                        className="h-80"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={stats.publicationsByYear}>
                            <defs>
                              <linearGradient id="publicationGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                            <XAxis dataKey="year" stroke="#6366f1" />
                            <YAxis stroke="#6366f1" />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: 'white' }} />
                            <Area type="monotone" dataKey="publications" stroke="#8b5cf6" strokeWidth={3} fill="url(#publicationGradient)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                      <div className="mt-4 grid grid-cols-3 gap-4">
                        <div className="bg-purple-100 p-3 rounded-lg text-center">
                          <p className="text-2xl font-bold text-purple-800">{stats.publicationsByYear?.slice(-1)[0]?.publications || stats.publicationsByYear?.slice(-1)[0]?.count || 0}</p>
                          <p className="text-sm text-purple-600">2024 Publications</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-lg text-center">
                          <p className="text-2xl font-bold text-green-800">+15%</p>
                          <p className="text-sm text-green-600">YoY Growth</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg text-center">
                          <p className="text-2xl font-bold text-blue-800">{Math.round((stats.publicationsByYear?.reduce((sum, item) => sum + (item.publications || item.count || 0), 0) || 0) / (stats.publicationsByYear?.length || 1))}</p>
                          <p className="text-sm text-blue-600">Avg per Year</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-xl border-0 bg-gradient-to-br from-slate-50 to-slate-100">
                    <CardHeader className="bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-t-lg">
                      <CardTitle className="flex items-center gap-2">
                        <div className="h-5 w-5 bg-white rounded-full flex items-center justify-center">
                          <div className="h-2 w-2 bg-rose-600 rounded-full"></div>
                        </div>
                        Publication Impact vs Citations Analysis
                      </CardTitle>
                      <CardDescription className="text-pink-100 mt-2">
                        Bubble size = Research Area Relevance • Color = Publication Year
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="mb-4 flex flex-wrap gap-2">
                        <Badge className="bg-blue-500 text-white">🔵 2020-2021</Badge>
                        <Badge className="bg-green-500 text-white">🟢 2022</Badge>
                        <Badge className="bg-yellow-500 text-white">🟡 2023</Badge>
                        <Badge className="bg-red-500 text-white">🔴 2024</Badge>
                      </div>
                      <ResponsiveContainer width="100%" height={400}>
                        <ScatterChart 
                          data={[
                            { impact: 2.1, citations: 45, size: 120, year: 2021, area: "Microgravity Effects", journal: "Space Medicine" },
                            { impact: 3.5, citations: 78, size: 180, year: 2022, area: "Plant Biology", journal: "Astrobiology" },
                            { impact: 1.8, citations: 23, size: 90, year: 2020, area: "Radiation Studies", journal: "Space Research" },
                            { impact: 4.2, citations: 156, size: 240, year: 2023, area: "Human Health", journal: "Nature Space" },
                            { impact: 2.9, citations: 67, size: 150, year: 2022, area: "Bone Research", journal: "Bone & Space" },
                            { impact: 5.1, citations: 203, size: 300, year: 2024, area: "Cell Biology", journal: "Cell in Space" }
                          ]}
                          margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#fce7f3" />
                          <XAxis 
                            dataKey="impact" 
                            type="number" 
                            domain={[0, 6]} 
                            name="Impact Factor" 
                            tick={{ fontSize: 12, fill: '#e11d48' }}
                            label={{ value: 'Impact Factor', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fill: '#e11d48', fontWeight: 'bold' } }}
                          />
                          <YAxis 
                            dataKey="citations" 
                            type="number" 
                            name="Citations" 
                            tick={{ fontSize: 12, fill: '#e11d48' }}
                            label={{ value: 'Citations', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#e11d48', fontWeight: 'bold' } }}
                          />
                          <Tooltip 
                            content={({ active, payload }) => {
                              if (active && payload && payload[0]) {
                                const data = payload[0].payload;
                                return (
                                  <div className="bg-slate-800 text-white p-3 rounded-lg shadow-lg border border-slate-600">
                                    <p className="font-semibold text-yellow-300">{data.area}</p>
                                    <p className="text-sm text-slate-300">{data.journal} ({data.year})</p>
                                    <div className="mt-2 space-y-1 text-sm">
                                      <p>📊 Impact Factor: <span className="font-semibold text-blue-300">{data.impact}</span></p>
                                      <p>📈 Citations: <span className="font-semibold text-green-300">{data.citations}</span></p>
                                      <p>🎯 Relevance Score: <span className="font-semibold text-purple-300">{Math.round(data.size/10)}/30</span></p>
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Scatter 
                            name="Publications" 
                            dataKey="size" 
                            fill="#e11d48"
                            fillOpacity={0.7}
                            stroke="#fff"
                            strokeWidth={2}
                          />
                        </ScatterChart>
                      </ResponsiveContainer>
                      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="font-semibold text-blue-800">📊 Insights</p>
                          <p className="text-blue-700">Higher impact journals show stronger citation correlation</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="font-semibold text-green-800">🎯 Trend</p>
                          <p className="text-green-700">2024 publications gaining rapid citation momentum</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center size-10 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                          <Network className="size-5" />
                        </div>
                        <div>
                          <CardTitle className="text-indigo-800">Research by Mission Type</CardTitle>
                          <CardDescription className="text-indigo-600">Stacked column visualization</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={{
                          count: {
                            label: "Datasets",
                            color: "#6366f1",
                          },
                        }}
                        className="h-64"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={stats.datasetsByMission}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#c7d2fe" />
                            <XAxis dataKey="area" stroke="#4f46e5" angle={-45} textAnchor="end" height={80} />
                            <YAxis stroke="#4f46e5" />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: 'white' }} />
                            <Bar dataKey="count" radius={[8, 8, 0, 0]} fill="#6366f1" />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center size-10 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                          <BarChart3 className="size-5" />
                        </div>
                        <div>
                          <CardTitle className="text-emerald-800">Research Areas</CardTitle>
                          <CardDescription className="text-emerald-600">Project distribution</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={{
                          count: {
                            label: "Projects",
                            color: "#10b981",
                          },
                        }}
                        className="h-64"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={stats.projectsByStatus}
                              dataKey="count"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={90}
                              innerRadius={30}
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              labelLine={false}
                            >
                              <Cell fill="#10b981" />
                              <Cell fill="#f59e0b" />
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: 'white' }} />
                          </PieChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center size-10 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white">
                          <Database className="size-5" />
                        </div>
                        <div>
                          <CardTitle className="text-orange-800">Top Organisms Studied</CardTitle>
                          <CardDescription className="text-orange-600">Organism ranking</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={{
                          count: {
                            label: "Studies",
                            color: "#f97316",
                          },
                        }}
                        className="h-64"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={stats.topOrganisms} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" />
                            <XAxis type="number" stroke="#ea580c" />
                            <YAxis dataKey="range" type="category" width={60} stroke="#ea580c" />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: 'white' }} />
                            <Bar dataKey="count" radius={[0, 8, 8, 0]} fill="#f97316" />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  <Card className="shadow-xl border-0 bg-gradient-to-br from-slate-50 to-slate-100">
                    <CardHeader className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-t-lg">
                      <CardTitle className="flex items-center gap-2">
                        <div className="h-5 w-5 bg-white rounded-full flex items-center justify-center">
                          <div className="h-2 w-2 bg-cyan-600 rounded-full"></div>
                        </div>
                        Impact Factor Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'High Impact (>5)', value: 25, fill: '#10b981' },
                              { name: 'Medium Impact (2-5)', value: 45, fill: '#f59e0b' },
                              { name: 'Low Impact (<2)', value: 30, fill: '#ef4444' },
                              { name: 'No Data', value: 15, fill: '#6b7280' }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={120}
                            paddingAngle={2}
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            labelLine={false}
                            stroke="#fff"
                            strokeWidth={3}
                          />
                          <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: 'white' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="shadow-xl border-0 bg-gradient-to-br from-slate-50 to-slate-100">
                    <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-t-lg">
                      <CardTitle className="flex items-center gap-2">
                        <div className="h-5 w-5 bg-white rounded-full flex items-center justify-center">
                          <div className="h-2 w-2 bg-emerald-600 rounded-full"></div>
                        </div>
                        Research Collaboration
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {[
                          { institution: 'NASA Ames', publications: 45, color: '#10b981' },
                          { institution: 'MIT', publications: 32, color: '#3b82f6' },
                          { institution: 'Stanford', publications: 28, color: '#8b5cf6' },
                          { institution: 'Harvard', publications: 24, color: '#f59e0b' },
                          { institution: 'Caltech', publications: 19, color: '#ef4444' }
                        ].map((collab, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border">
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: collab.color }}></div>
                              <span className="font-medium text-slate-700">{collab.institution}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">{collab.publications} pubs</Badge>
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div className="h-2 rounded-full" style={{ backgroundColor: collab.color, width: `${(collab.publications / 45) * 100}%` }}></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-xl border-0 bg-gradient-to-br from-slate-50 to-slate-100">
                    <CardHeader className="bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-t-lg">
                      <CardTitle className="flex items-center gap-2">
                        <div className="h-5 w-5 bg-white rounded-full flex items-center justify-center">
                          <div className="h-2 w-2 bg-violet-600 rounded-full"></div>
                        </div>
                        Data Quality Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <ResponsiveContainer width="100%" height={300}>
                        <ComposedChart data={[
                          { source: 'PMC', count: pmcData.length, quality: 95 },
                          { source: 'FY2024', count: fy2024Data.length, quality: 78 },
                          { source: 'Complete', count: stats.completePublications, quality: 100 },
                          { source: 'Partial', count: stats.totalPublications - stats.completePublications, quality: 45 }
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                          <XAxis dataKey="source" tick={{ fontSize: 12, fill: '#7c3aed' }} />
                          <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#7c3aed' }} />
                          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#f59e0b' }} />
                          <Bar yAxisId="left" dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                          <Line yAxisId="right" type="monotone" dataKey="quality" stroke="#f59e0b" strokeWidth={3} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="shadow-xl border-0 bg-gradient-to-br from-slate-50 to-slate-100">
                    <CardHeader className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-t-lg">
                      <CardTitle className="flex items-center gap-2">
                        <div className="h-5 w-5 bg-white rounded-full flex items-center justify-center">
                          <div className="h-2 w-2 bg-teal-600 rounded-full"></div>
                        </div>
                        Research Topic Hierarchy
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={[
                          { name: 'Space Biology', count: 450 },
                          { name: 'Human Health', count: 380 },
                          { name: 'Microgravity', count: 320 },
                          { name: 'Radiation', count: 280 },
                          { name: 'Plant Growth', count: 240 },
                          { name: 'Life Support', count: 200 },
                          { name: 'Astrobiology', count: 160 },
                          { name: 'Biomarkers', count: 140 }
                        ]} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis type="number" tick={{ fontSize: 12, fill: '#0f766e' }} />
                          <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12, fill: '#0f766e' }} />
                          <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: 'white' }} />
                          <Bar dataKey="count" radius={[0, 8, 8, 0]} fill="#0d9488" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                  <div className="grid grid-cols-5 gap-4 mt-8">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-24 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="graph">
            <KnowledgeGraphViz filters={{}} />
          </TabsContent>

          <TabsContent value="timeline">
            <TimelineView />
          </TabsContent>

          <TabsContent value="mission">
            <Card>
              <CardHeader>
                <CardTitle>Mission Timeline & Future Analysis</CardTitle>
                <CardDescription>Space biology research roadmap and technology predictions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-blue-800">Current (2024-2026)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="font-semibold mb-2">Priority: Crew Health Countermeasures</p>
                      <p className="text-sm mb-2"><strong>Missions:</strong> ISS Research, Artemis Prep</p>
                      <p className="text-sm"><strong>Focus:</strong> Skeletal, Immune, Vascular, Microbiome</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50">
                    <CardHeader>
                      <CardTitle className="text-green-800">Near Future (2027-2030)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="font-semibold mb-2">Priority: Life Support Systems</p>
                      <p className="text-sm mb-2"><strong>Missions:</strong> Lunar Gateway, Mars Transit</p>
                      <p className="text-sm"><strong>Focus:</strong> Arabidopsis, Tissue, Regeneration, ISRU</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-purple-50">
                    <CardHeader>
                      <CardTitle className="text-purple-800">Long Term (2031-2040)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="font-semibold mb-2">Priority: Self-Sustaining Colonies</p>
                      <p className="text-sm mb-2"><strong>Missions:</strong> Mars Surface, Deep Space</p>
                      <p className="text-sm"><strong>Focus:</strong> Synthetic Biology, Closed-Loop, Terraforming</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}