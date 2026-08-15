"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Loader2, Database } from "lucide-react"
import Link from "next/link"
import { SearchFilters } from "@/components/search-filters"
import { SearchResultCard } from "@/components/search-result-card"
import { CitationExport } from "@/components/citation-export"
import { Badge } from "@/components/ui/badge"
import type { SearchResult } from "@/lib/types"

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [filters, setFilters] = useState({
    contentTypes: ["publication", "dataset", "library_item", "project"],
    missions: [],
    organisms: [],
    researchAreas: [],
    publicationType: "all",
  })
  const [availableFilters, setAvailableFilters] = useState({
    missions: [],
    organisms: [],
    researchAreas: [],
  })

  useEffect(() => {
    fetchFilterOptions()
  }, [])

  useEffect(() => {
    if (searched && query.trim()) {
      handleSearch()
    }
  }, [filters])

  const fetchFilterOptions = async () => {
    setAvailableFilters({
      missions: ["ISS", "Mars", "Moon", "Shuttle", "Apollo"],
      organisms: ["Arabidopsis", "E. coli", "Yeast", "Mouse", "Rat", "Drosophila", "C. elegans"],
      researchAreas: ["Plant Biology", "Microbiology", "Bone Research", "Radiation Effects", "Microgravity", "Cell Biology", "Genetics"]
    })
  }

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault()

    if (!query.trim()) return

    setLoading(true)
    setSearched(true)
    setSelectedIds([])

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, filters }),
      })

      const data = await response.json()
      setResults(data.results || [])
    } catch (error) {
      console.error("Search failed:", error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSelectResult = (resultId: string, selected: boolean) => {
    if (selected) {
      setSelectedIds([...selectedIds, resultId])
    } else {
      setSelectedIds(selectedIds.filter((id) => id !== resultId))
    }
  }

  const handleSelectAll = () => {
    if (selectedIds.length === results.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(
        results.map((r) => {
          const prefix = r.type === "fy2024_publication" ? "fy2024" : r.type === "publication" ? "pub" : r.type === "dataset" ? "ds" : r.type === "library_item" ? "lib" : "proj"
          return `${prefix}_${r.id}`
        })
      )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
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

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="space-y-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Search publications, datasets, library items, and projects..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={loading || !query.trim()}>
                {loading ? <Loader2 className="size-5 animate-spin" /> : <Search className="size-5" />}
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2 flex-wrap">
                <Button 
                  variant={filters.publicationType === "fy2024" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setFilters({...filters, publicationType: "fy2024"})}
                >
                  Biology Publications ({filters.publicationType === "fy2024" ? results.length : "5"})
                </Button>
                <Button 
                  variant={filters.publicationType === "pmc" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setFilters({...filters, publicationType: "pmc"})}
                >
                  PMC Database
                </Button>
                <Button 
                  variant={filters.publicationType === "all" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setFilters({...filters, publicationType: "all"})}
                >
                  All Publications
                </Button>
              </div>
              <SearchFilters filters={filters} availableFilters={availableFilters} onFilterChange={setFilters} />
            </div>
          </form>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {!loading && searched && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-muted-foreground">
                    {results.length} {results.length === 1 ? "result" : "results"} found
                  </p>
                  {filters.publicationType === "fy2024" && (
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                      FY2024 Complete Details Only
                    </Badge>
                  )}
                  {filters.publicationType === "pmc" && (
                    <Badge variant="secondary" className="bg-green-50 text-green-700">
                      PMC Database Only
                    </Badge>
                  )}
                </div>
                {results.length > 0 && (
                  <Button variant="outline" size="sm" onClick={handleSelectAll}>
                    {selectedIds.length === results.length ? "Deselect All" : "Select All"}
                  </Button>
                )}
              </div>

              {results.length > 0 ? (
                <div className="space-y-4">
                  {results.map((result) => {
                    const resultId = `${result.type === "fy2024_publication" ? "fy2024" : result.type === "publication" ? "pub" : result.type === "dataset" ? "ds" : result.type === "library_item" ? "lib" : "proj"}_${result.id}`
                    return (
                      <SearchResultCard
                        key={resultId}
                        result={result}
                        selected={selectedIds.includes(resultId)}
                        onSelect={(selected) => handleSelectResult(resultId, selected)}
                      />
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No results found. Try adjusting your search or filters.</p>
                </div>
              )}

              {selectedIds.length > 0 && (
                <div className="sticky bottom-4">
                  <CitationExport selectedIds={selectedIds} onClose={() => setSelectedIds([])} />
                </div>
              )}
            </div>
          )}

          {!searched && (
            <div className="text-center py-12">
              <Search className="size-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Enter a search query to find NASA space biology research</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}