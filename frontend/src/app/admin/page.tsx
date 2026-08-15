"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Database, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
  const [source, setSource] = useState("all")
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<any>(null)

  const handleIngest = async () => {
    setLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source, url: url || undefined }),
      })

      const data = await response.json()

      if (data.success) {
        setMessage(data.message)
        fetchStatus()
      } else {
        setMessage(`Error: ${data.error}`)
      }
    } catch (error) {
      setMessage("Failed to ingest data")
    } finally {
      setLoading(false)
    }
  }

  const fetchStatus = async () => {
    try {
      const response = await fetch("/api/ingest/status")
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      console.error("[v0] Failed to fetch status:", error)
    }
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
              <h1 className="text-xl font-semibold text-foreground">SBKE Admin</h1>
              <p className="text-xs text-muted-foreground">Data Ingestion</p>
            </div>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Ingestion</CardTitle>
              <CardDescription>Import data from NASA sources into the knowledge engine</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="source">Data Source</Label>
                <Select value={source} onValueChange={setSource}>
                  <SelectTrigger id="source">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="publications">Publications (CSV)</SelectItem>
                    <SelectItem value="datasets">OSDR Datasets</SelectItem>
                    <SelectItem value="library">NSLSL Library</SelectItem>
                    <SelectItem value="projects">Task Book Projects</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">Custom URL (Optional)</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com/data.csv"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>

              <Button onClick={handleIngest} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <RefreshCw className="size-4 mr-2 animate-spin" />
                    Ingesting...
                  </>
                ) : (
                  "Start Ingestion"
                )}
              </Button>

              {message && <div className="p-3 rounded-lg bg-muted text-sm text-foreground">{message}</div>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Database Status</CardTitle>
                <Button variant="outline" size="sm" onClick={fetchStatus}>
                  <RefreshCw className="size-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {status ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Publications</p>
                    <p className="text-2xl font-bold text-foreground">{status.publications.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Datasets</p>
                    <p className="text-2xl font-bold text-foreground">{status.datasets.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Library Items</p>
                    <p className="text-2xl font-bold text-foreground">{status.library_items.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Projects</p>
                    <p className="text-2xl font-bold text-foreground">{status.projects.toLocaleString()}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Click refresh to load status</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
