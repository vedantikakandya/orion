"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, ExternalLink, Search } from "lucide-react"

interface ValidationResult {
  number: string
  doi: string
  valid: boolean
  alternativeSearch: string
  hasJournalInfo: boolean
}

interface ValidationData {
  totalChecked: number
  validCount: number
  invalidCount: number
  invalidDOIs: ValidationResult[]
  validationRate: string
}

export default function DOIValidator() {
  const [validation, setValidation] = useState<ValidationData | null>(null)
  const [loading, setLoading] = useState(false)

  const runValidation = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/publications/validate')
      const data = await response.json()
      setValidation(data)
    } catch (error) {
      console.error('Validation failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            DOI Link Validation
          </CardTitle>
          <Button onClick={runValidation} disabled={loading} size="sm">
            {loading ? "Validating..." : "Check DOIs"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {validation ? (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{validation.validCount}</div>
                <p className="text-sm text-muted-foreground">Valid DOIs</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{validation.invalidCount}</div>
                <p className="text-sm text-muted-foreground">Invalid DOIs</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{validation.validationRate}%</div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </div>
            </div>

            {validation.invalidDOIs.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  Invalid DOI Links (Sample)
                </h4>
                <div className="space-y-2">
                  {validation.invalidDOIs.map((invalid) => (
                    <div key={invalid.number} className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                      <div>
                        <Badge variant="outline">#{invalid.number}</Badge>
                        <p className="text-sm text-muted-foreground mt-1">{invalid.doi}</p>
                      </div>
                      <div className="flex gap-2">
                        {invalid.alternativeSearch && (
                          <a
                            href={invalid.alternativeSearch}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                          >
                            <Search className="w-3 h-3" />
                            Scholar
                          </a>
                        )}
                        <a
                          href={invalid.doi}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Try DOI
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4">
            Click "Check DOIs" to validate publication links
          </p>
        )}
      </CardContent>
    </Card>
  )
}