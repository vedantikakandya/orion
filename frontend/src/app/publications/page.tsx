"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Database, Search, TrendingUp, ExternalLink, Filter, Download } from "lucide-react"

interface Publication {
  Number: string
  Authors: string
  Title: string
  Journal_Info: string
  DOI_Link: string
  Journal_Impact_Factor: string
}

interface Stats {
  total: number
  highImpact: number
  avgImpact: number
  topJournals: Array<{journal: string, count: number}>
}

export default function PublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([])
  const [filteredPubs, setFilteredPubs] = useState<Publication[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [impactFilter, setImpactFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPublications()
  }, [])

  useEffect(() => {
    filterPublications()
  }, [searchTerm, impactFilter, publications])

  const fetchPublications = async () => {
    try {
      const response = await fetch('/api/publications/fy2024')
      const data = await response.json()
      setPublications(data.publications)
      setStats(data.stats)
    } catch (error) {
      console.error('Error fetching publications:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterPublications = () => {
    let filtered = publications.filter(pub => {
      const matchesSearch = pub.Journal_Info.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pub.DOI_Link.toLowerCase().includes(searchTerm.toLowerCase())
      
      let matchesImpact = true
      if (impactFilter !== "all") {
        const impact = parseFloat(pub.Journal_Impact_Factor)
        if (impactFilter === "high" && impact < 10) matchesImpact = false
        if (impactFilter === "medium" && (impact < 5 || impact >= 10)) matchesImpact = false
        if (impactFilter === "low" && impact >= 5) matchesImpact = false
      }
      
      return matchesSearch && matchesImpact
    })
    setFilteredPubs(filtered)
  }

  const getImpactBadge = (impact: string) => {
    const num = parseFloat(impact)
    if (isNaN(num)) return <Badge variant="secondary">N/A</Badge>
    if (num >= 10) return <Badge className="bg-green-600">High ({impact})</Badge>
    if (num >= 5) return <Badge className="bg-blue-600">Medium ({impact})</Badge>
    return <Badge variant="outline">Low ({impact})</Badge>
  }

  const exportData = async (format: string) => {
    try {
      const response = await fetch('/api/publications/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format, filters: { searchTerm, impactFilter } })
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `fy2024_publications.${format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Database className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p>Loading FY2024 Publications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-lg bg-primary text-primary-foreground">
              <Database className="size-6" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">ORION</h1>
              <p className="text-xs text-muted-foreground">FY2024 Publications</p>
            </div>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/search" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Search
            </Link>
            <Link href="/discover" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Discover
            </Link>
            <Link href="/visualize" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Visualize
            </Link>
            <Link href="/publications" className="text-sm font-medium text-primary">
              Publications
            </Link>
            <Link href="/publications/analytics" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Analytics
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold">NASA Space Biology Publications FY2024</h1>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Publications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">High Impact (≥10)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.highImpact}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Impact Factor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.avgImpact.toFixed(1)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Parsed Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {publications.filter(p => p.Journal_Info !== "Parsing Failed").length}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Search & Filter Publications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by journal info or DOI..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={impactFilter} onValueChange={setImpactFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Impact Factor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Impact Factors</SelectItem>
                  <SelectItem value="high">High (≥10)</SelectItem>
                  <SelectItem value="medium">Medium (5-10)</SelectItem>
                  <SelectItem value="low">Low (&lt;5)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-muted-foreground">
                Showing {filteredPubs.length} of {publications.length} publications
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => exportData('csv')}>
                  <Download className="w-4 h-4 mr-1" />
                  CSV
                </Button>
                <Button size="sm" variant="outline" onClick={() => exportData('json')}>
                  <Download className="w-4 h-4 mr-1" />
                  JSON
                </Button>
                <Button size="sm" variant="outline" onClick={() => exportData('html')}>
                  <Download className="w-4 h-4 mr-1" />
                  HTML
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Publications List */}
        <div className="space-y-4">
          {filteredPubs.map((pub) => (
            <Card key={pub.Number} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline">#{pub.Number}</Badge>
                      {getImpactBadge(pub.Journal_Impact_Factor)}
                    </div>
                    
                    {pub.Journal_Info !== "Parsing Failed" ? (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {pub.Journal_Info}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        Publication details not available - DOI link only
                      </p>
                    )}
                  </div>
                  
                  <div className="ml-4 space-y-2">
                    <a
                      href={pub.DOI_Link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View DOI
                    </a>
                    {pub.Journal_Info !== "Parsing Failed" && (
                      <div>
                        <a
                          href={`https://scholar.google.com/scholar?q=${encodeURIComponent(pub.Journal_Info.split('.')[0] || '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                        >
                          <Search className="w-4 h-4" />
                          Search Scholar
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPubs.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No publications found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or filters
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}