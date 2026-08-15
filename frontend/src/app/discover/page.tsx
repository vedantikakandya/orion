"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Sparkles, Loader2, Database, TrendingUp, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function DiscoverPage() {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [researchArea, setResearchArea] = useState("")
  const [gapAnalysis, setGapAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAsk = async () => {
    if (!question.trim()) return

    setLoading(true)
    setAnswer("")
    setError(null)

    try {
      const response = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      })

      const data = await response.json()
      setAnswer(data.answer || "No answer received")
    } catch (error) {
      setAnswer("Failed to get answer. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleGapAnalysis = async () => {
    if (!researchArea.trim()) return

    setLoading(true)
    setGapAnalysis(null)
    setError(null)

    try {
      const response = await fetch("/api/ai/gap-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ researchArea }),
      })

      const data = await response.json()
      setGapAnalysis(data)
    } catch (error) {
      setGapAnalysis({ summary: "Failed to perform gap analysis. Please try again." })
    } finally {
      setLoading(false)
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
              <h1 className="text-xl font-semibold text-foreground">ORION</h1>
              <p className="text-xs text-muted-foreground">AI Discovery</p>
            </div>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/search" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Search
            </Link>
            <Link href="/discover" className="text-sm font-medium text-primary">
              Discover
            </Link>
            <Link href="/visualize" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Visualize
            </Link>
            <Link href="/community" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Community
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">AI-Powered Discovery</h2>
          <p className="text-muted-foreground">
            Use natural language to explore research, identify gaps, and get intelligent recommendations
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="size-4" />
            <AlertTitle>Database Setup Required</AlertTitle>
            <AlertDescription>
              {error}{" "}
              <Link href="/admin" className="underline font-medium">
                Go to Admin page
              </Link>{" "}
              to set up the database.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="ask" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ask">Ask Questions</TabsTrigger>
            <TabsTrigger value="gaps">Gap Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="ask" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-10 rounded-lg bg-chart-1/10 text-chart-1">
                    <Sparkles className="size-5" />
                  </div>
                  <div>
                    <CardTitle>Research Q&A</CardTitle>
                    <CardDescription>Ask questions about space biology research in natural language</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="question">Your Question</Label>
                  <Textarea
                    id="question"
                    placeholder="e.g., What are the effects of microgravity on plant growth?"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button onClick={handleAsk} disabled={loading || !question.trim()} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Thinking...
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4 mr-2" />
                      Get Answer
                    </>
                  )}
                </Button>

                {answer && (
                  <div className="p-4 rounded-lg bg-muted space-y-2">
                    <p className="text-sm font-semibold text-foreground">Answer:</p>
                    <p className="text-sm text-foreground whitespace-pre-wrap">{answer}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Example Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• What are the main challenges in growing food in space?</li>
                  <li>• How does radiation affect biological organisms in space?</li>
                  <li>• What experiments have been conducted on the ISS related to bone density?</li>
                  <li>• Which organisms have been studied most extensively in microgravity?</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gaps" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-10 rounded-lg bg-chart-2/10 text-chart-2">
                    <TrendingUp className="size-5" />
                  </div>
                  <div>
                    <CardTitle>Research Gap Analysis</CardTitle>
                    <CardDescription>Identify understudied areas and future research opportunities</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="area">Research Area</Label>
                  <Input
                    id="area"
                    placeholder="e.g., Plant Biology, Microbiology, Human Physiology"
                    value={researchArea}
                    onChange={(e) => setResearchArea(e.target.value)}
                  />
                </div>

                <Button onClick={handleGapAnalysis} disabled={loading || !researchArea.trim()} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="size-4 mr-2" />
                      Analyze Gaps
                    </>
                  )}
                </Button>

                {gapAnalysis && (
                  <div className="space-y-4">
                    {gapAnalysis.summary && (
                      <div className="p-4 rounded-lg bg-muted">
                        <p className="text-sm font-semibold text-foreground mb-2">Summary</p>
                        <p className="text-sm text-foreground">{gapAnalysis.summary}</p>
                      </div>
                    )}

                    {gapAnalysis.gaps && gapAnalysis.gaps.length > 0 && (
                      <div className="p-4 rounded-lg bg-destructive/10">
                        <p className="text-sm font-semibold text-foreground mb-2">Research Gaps</p>
                        <ul className="space-y-1">
                          {gapAnalysis.gaps.map((gap: string, i: number) => (
                            <li key={i} className="text-sm text-foreground">
                              • {gap}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {gapAnalysis.recommendations && gapAnalysis.recommendations.length > 0 && (
                      <div className="p-4 rounded-lg bg-chart-2/10">
                        <p className="text-sm font-semibold text-foreground mb-2">Recommendations</p>
                        <ul className="space-y-1">
                          {gapAnalysis.recommendations.map((rec: string, i: number) => (
                            <li key={i} className="text-sm text-foreground">
                              • {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
