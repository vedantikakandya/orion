import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Database, BookOpen, Sparkles, Network, TrendingUp } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-8 w-8 text-primary" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground">ORION</span>
                          <span className="text-sm text-muted-foreground">Organism Research & Insights On NASA</span>

            </div>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/search" className="text-sm font-medium text-muted-foreground">Search</Link>
            <Link href="/discover" className="text-sm font-medium text-muted-foreground">Discover</Link>
            <Link href="/visualize" className="text-sm font-medium text-muted-foreground">Visualize</Link>
            <Link href="/community" className="text-sm font-medium text-muted-foreground">Community</Link>
            <Link href="/investments" className="text-sm font-medium text-muted-foreground">Investments</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-balance text-foreground">
            Unified Access to NASA Space Biology Research
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Search, analyze, and visualize data from publications, datasets, library resources, and active research
            projects—all in one intelligent platform.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link href="/search">
              <Button size="lg" className="gap-2">
                <Search className="size-5" />
                Start Searching
              </Button>
            </Link>
            <Link href="/discover">
              <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                <Sparkles className="size-5" />
                AI Discovery
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-10 rounded-lg bg-chart-1/10 text-chart-1">
                  <Search className="size-5" />
                </div>
                <CardTitle>Unified Search</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Search across 4 NASA data sources simultaneously with advanced filtering by mission, organism, research
                area, and more.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-10 rounded-lg bg-chart-2/10 text-chart-2">
                  <Sparkles className="size-5" />
                </div>
                <CardTitle>AI-Powered Discovery</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Semantic search with natural language queries, automated gap analysis, and intelligent research
                recommendations powered by Gemini AI.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-10 rounded-lg bg-chart-3/10 text-chart-3">
                  <Network className="size-5" />
                </div>
                <CardTitle>Knowledge Graph</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Visualize connections between publications, datasets, projects, and researchers to discover hidden
                relationships.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-10 rounded-lg bg-chart-4/10 text-chart-4">
                  <TrendingUp className="size-5" />
                </div>
                <CardTitle>Timeline Analysis</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track research evolution over time, identify emerging trends, and explore historical developments in
                space biology.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-10 rounded-lg bg-chart-5/10 text-chart-5">
                  <Database className="size-5" />
                </div>
                <CardTitle>Deep Linking</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Direct access to original sources with full traceability. Every result links back to authoritative NASA
                repositories.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary">
                  <BookOpen className="size-5" />
                </div>
                <CardTitle>Citation Tools</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Export citations in multiple formats (BibTeX, RIS, APA) and submit new research to expand the knowledge
                base.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Data Sources */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8 text-foreground">Integrated Data Sources</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">NASA Publications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Peer-reviewed research papers, conference proceedings, and technical reports from NASA's space biology
                  research programs.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">OSDR Datasets</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Open Science Data Repository containing experimental data, omics datasets, and raw research data from
                  space biology studies.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">NSLSL Library</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  NASA Space Life Sciences Library with books, theses, historical documents, and specialized reference
                  materials.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Task Book Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Active and completed research projects with funding information, principal investigators, and project
                  outcomes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>Space Knowledge Engine • Created by ByteCoders • Powered by NASA Data</p>
        </div>
      </footer>
    </div>
  )
}