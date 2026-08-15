import { sql } from "@/lib/db"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, FileText, Calendar, Users, Tag, Rocket, Dna } from "lucide-react"
import Link from "next/link"

export default async function PublicationPage({ params }: { params: { id: string } }) {
  const publications = await sql`
    SELECT * FROM publications WHERE id = ${params.id}
  `

  if (publications.length === 0) {
    notFound()
  }

  const pub = publications[0]

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
              <Badge variant="outline">Publication</Badge>
              {pub.doi && (
                <Badge variant="secondary" className="gap-1">
                  <FileText className="size-3" />
                  DOI: {pub.doi}
                </Badge>
              )}
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">{pub.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {pub.publication_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="size-4" />
                  {new Date(pub.publication_date).toLocaleDateString()}
                </div>
              )}
              {pub.journal && (
                <div className="flex items-center gap-2">
                  <FileText className="size-4" />
                  {pub.journal}
                </div>
              )}
              {pub.citation_count > 0 && (
                <div className="flex items-center gap-2">
                  <Tag className="size-4" />
                  {pub.citation_count} citations
                </div>
              )}
            </div>
          </div>

          {pub.authors && pub.authors.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="size-5" />
                  <CardTitle className="text-lg">Authors</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {pub.authors.map((author: string, i: number) => (
                    <Badge key={i} variant="secondary">
                      {author}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {pub.abstract && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Abstract</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{pub.abstract}</p>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {pub.missions && pub.missions.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Rocket className="size-5" />
                    <CardTitle className="text-lg">Missions</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {pub.missions.map((mission: string, i: number) => (
                      <Badge key={i} variant="outline">
                        {mission}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {pub.organisms && pub.organisms.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Dna className="size-5" />
                    <CardTitle className="text-lg">Organisms</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {pub.organisms.map((organism: string, i: number) => (
                      <Badge key={i} variant="outline">
                        {organism}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {pub.keywords && pub.keywords.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Tag className="size-5" />
                    <CardTitle className="text-lg">Keywords</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {pub.keywords.map((keyword: string, i: number) => (
                      <Badge key={i} variant="secondary">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {pub.research_areas && pub.research_areas.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Research Areas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {pub.research_areas.map((area: string, i: number) => (
                      <Badge key={i} variant="secondary">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Access & Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pub.pdf_url && (
                <Button asChild variant="outline" className="w-full justify-start gap-2 bg-transparent">
                  <a href={pub.pdf_url} target="_blank" rel="noopener noreferrer">
                    <FileText className="size-4" />
                    View PDF
                    <ExternalLink className="size-3 ml-auto" />
                  </a>
                </Button>
              )}
              {pub.external_url && (
                <Button asChild variant="outline" className="w-full justify-start gap-2 bg-transparent">
                  <a href={pub.external_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="size-4" />
                    View on NASA Website
                    <ExternalLink className="size-3 ml-auto" />
                  </a>
                </Button>
              )}
              {pub.doi && (
                <Button asChild variant="outline" className="w-full justify-start gap-2 bg-transparent">
                  <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="size-4" />
                    View DOI Record
                    <ExternalLink className="size-3 ml-auto" />
                  </a>
                </Button>
              )}
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
                <span className="font-medium text-foreground">NASA Publications Database</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Record ID:</span>
                <span className="font-mono text-foreground">{pub.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated:</span>
                <span className="text-foreground">{new Date(pub.updated_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Added to SBKE:</span>
                <span className="text-foreground">{new Date(pub.created_at).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
