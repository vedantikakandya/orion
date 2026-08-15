"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Copy, Check, X } from "lucide-react"

interface CitationExportProps {
  selectedIds: string[]
  onClose?: () => void
}

export function CitationExport({ selectedIds, onClose }: CitationExportProps) {
  const [format, setFormat] = useState<string>("structured")
  const [reportType, setReportType] = useState<string>("citation")
  const [citations, setCitations] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const generateCitations = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/citations/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds, format, reportType }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.citations && data.citations.length > 0) {
          setCitations(data.citations)
        } else {
          throw new Error('No citations generated')
        }
      } else {
        throw new Error(`API error: ${response.status}`)
      }
    } catch (error) {
      console.error("Failed to generate citations:", error)
      setCitations([`Error generating ${reportType === 'detailed' ? 'reports' : 'citations'}. Please try again.`])
    } finally {
      setLoading(false)
    }
  }

  const copyCitations = () => {
    navigator.clipboard.writeText(citations.join("\n\n"))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadCitations = () => {
    const blob = new Blob([citations.join("\n\n")], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = reportType === "detailed" ? `research-reports.txt` : `citations-${format}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Export Citations</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-sm transition-colors"
            aria-label="Close citation export"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="reportType">Export Type</Label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger id="reportType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="citation">Standard Citation</SelectItem>
              <SelectItem value="detailed">Detailed Research Report</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {reportType === "citation" && (
          <div>
            <Label htmlFor="format">Citation Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger id="format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="structured">Structured Format (Easy to Read)</SelectItem>
                <SelectItem value="apa">APA 7th Edition</SelectItem>
                <SelectItem value="mla">MLA 9th Edition</SelectItem>
                <SelectItem value="chicago">Chicago 17th Edition</SelectItem>
                <SelectItem value="bibtex">BibTeX</SelectItem>
                <SelectItem value="ris">RIS</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <Button onClick={generateCitations} disabled={selectedIds.length === 0 || loading} className="w-full">
          {loading ? (reportType === "detailed" ? "Generating Reports..." : "Generating Citations...") : reportType === "detailed" ? `Generate Reports (${selectedIds.length} items)` : `Generate Citations (${selectedIds.length} items)`}
        </Button>

        {citations.length > 0 && (
          <>
            <div>
              <Label>{reportType === "detailed" ? "Generated Reports" : "Generated Citations"}</Label>
              <Textarea value={citations.join("\n\n")} readOnly className={`${reportType === "detailed" ? "min-h-[400px]" : "min-h-[200px]"} font-mono text-sm mt-2`} />
            </div>

            <div className="flex gap-2">
              <Button onClick={copyCitations} variant="outline" className="flex-1 bg-transparent">
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
              <Button onClick={downloadCitations} variant="outline" className="flex-1 bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  )
}
