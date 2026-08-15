import { sql } from "@/lib/db"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Database, Calendar, HardDrive, FileText, Rocket, Dna } from "lucide-react"
import Link from "next/link"

export default async function DatasetPage({ params }: { params: { id: string } }) {
  const datasets = await sql`
    SELECT * FROM datasets WHERE id = ${params.id}
  `

  if (datasets.length === 0) {
    notFound()
  }

  const dataset = datasets[0]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link href="/search" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to Search
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline">Dataset</Badge>
              <Badge variant="secondary" className="gap-1">
                <Database className="size-3" />
                OSDR: {dataset.osdr_id}
              </Badge>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">{dataset.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {dataset.release_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="size-4" />
                  Released: {new Date(dataset.release_date).toLocaleDateString()}
                </div>
              )}
              {dataset.data_size_gb && (
                <div className="flex items-center gap-2">
                  <HardDrive className="size-4" />
                  {dataset.data_size_gb} GB
                </div>
              )}
              {dataset.file_count && (
                <div className="flex items-center gap-2">
                  <FileText className="size-4" />
                  {dataset.file_count} files
                </div>
              )}
            </div>
          </div>

          {dataset.description && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{dataset.description}</p>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {dataset.study_type && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Study Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" className="text-base">
                    {dataset.study_type}
                  </Badge>
                </CardContent>
              </Card>
            )}

            {dataset.principal_investigator && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Principal Investigator</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground">{dataset.principal_investigator}</p>
                  {dataset.institution && <p className="text-sm text-muted-foreground mt-1">{dataset.institution}</p>}
                </CardContent>
              </Card>
            )}

            {dataset.missions && dataset.missions.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Rocket className="size-5" />
                    <CardTitle className="text-lg">Missions</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {dataset.missions.map((mission: string, i: number) => (
                      <Badge key={i} variant="outline">
                        {mission}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {dataset.organisms && dataset.organisms.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Dna className="size-5" />
                    <CardTitle className="text-lg">Organisms</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {dataset.organisms.map((organism: string, i: number) => (
                      <Badge key={i} variant="outline">
                        {organism}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {dataset.assay_types && dataset.assay_types.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Assay Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {dataset.assay_types.map((assay: string, i: number) => (
                      <Badge key={i} variant="secondary">
                        {assay}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {dataset.data_types && dataset.data_types.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Data Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {dataset.data_types.map((type: string, i: number) => (
                      <Badge key={i} variant="secondary">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Access Dataset</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {dataset.download_url && (
                <Button asChild variant="default" className="w-full justify-start gap-2">
                  <a href={dataset.download_url} target="_blank" rel="noopener noreferrer">
                    <Database className="size-4" />
                    Download Dataset
                    <ExternalLink className="size-3 ml-auto" />
                  </a>
                </Button>
              )}
              {dataset.metadata_url && (
                <Button asChild variant="outline" className="w-full justify-start gap-2 bg-transparent">
                  <a href={dataset.metadata_url} target="_blank" rel="noopener noreferrer">
                    <FileText className="size-4" />
                    View Metadata
                    <ExternalLink className="size-3 ml-auto" />
                  </a>
                </Button>
              )}
              <Button asChild variant="outline" className="w-full justify-start gap-2 bg-transparent">
                <a
                  href={`https://osdr.nasa.gov/bio/repo/data/studies/${dataset.osdr_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="size-4" />
                  View on OSDR
                  <ExternalLink className="size-3 ml-auto" />
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">Traceability</CardTitle>
              <CardDescription>Source information and data provenance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Source:</span>
                <span className="font-medium text-foreground">NASA OSDR (Open Science Data Repository)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">OSDR ID:</span>
                <span className="font-mono text-foreground">{dataset.osdr_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Record ID:</span>
                <span className="font-mono text-foreground">{dataset.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated:</span>
                <span className="text-foreground">{new Date(dataset.updated_at).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
