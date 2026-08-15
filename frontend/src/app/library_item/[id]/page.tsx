import { sql } from "@/lib/db"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, BookOpen, Calendar, Users, Tag } from "lucide-react"
import Link from "next/link"

export default async function LibraryItemPage({ params }: { params: { id: string } }) {
  const items = await sql`
    SELECT * FROM library_items WHERE id = ${params.id}
  `

  if (items.length === 0) {
    notFound()
  }

  const item = items[0]

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
              <Badge variant="outline">Library Item</Badge>
              <Badge variant="secondary">{item.item_type}</Badge>
              {item.nslsl_id && (
                <Badge variant="secondary" className="gap-1">
                  <BookOpen className="size-3" />
                  NSLSL: {item.nslsl_id}
                </Badge>
              )}
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">{item.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {item.publication_year && (
                <div className="flex items-center gap-2">
                  <Calendar className="size-4" />
                  {item.publication_year}
                </div>
              )}
              {item.publisher && <span>{item.publisher}</span>}
              {item.page_count && <span>{item.page_count} pages</span>}
            </div>
          </div>

          {item.authors && item.authors.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="size-5" />
                  <CardTitle className="text-lg">Authors</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {item.authors.map((author: string, i: number) => (
                    <Badge key={i} variant="secondary">
                      {author}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {item.abstract && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Abstract</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{item.abstract}</p>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {item.subjects && item.subjects.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Tag className="size-5" />
                    <CardTitle className="text-lg">Subjects</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {item.subjects.map((subject: string, i: number) => (
                      <Badge key={i} variant="outline">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {item.keywords && item.keywords.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Keywords</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {item.keywords.map((keyword: string, i: number) => (
                      <Badge key={i} variant="secondary">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Publication Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {item.isbn && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ISBN:</span>
                    <span className="font-mono text-foreground">{item.isbn}</span>
                  </div>
                )}
                {item.issn && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ISSN:</span>
                    <span className="font-mono text-foreground">{item.issn}</span>
                  </div>
                )}
                {item.language && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Language:</span>
                    <span className="text-foreground">{item.language}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {item.availability_status && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Availability</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" className="text-base">
                    {item.availability_status}
                  </Badge>
                </CardContent>
              </Card>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Access Document</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {item.document_url && (
                <Button asChild variant="default" className="w-full justify-start gap-2">
                  <a href={item.document_url} target="_blank" rel="noopener noreferrer">
                    <BookOpen className="size-4" />
                    View Document
                    <ExternalLink className="size-3 ml-auto" />
                  </a>
                </Button>
              )}
              <Button asChild variant="outline" className="w-full justify-start gap-2 bg-transparent">
                <a
                  href={`https://lsda.jsc.nasa.gov/Library/${item.nslsl_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="size-4" />
                  View on NSLSL
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
                <span className="font-medium text-foreground">NASA Space Life Sciences Library (NSLSL)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">NSLSL ID:</span>
                <span className="font-mono text-foreground">{item.nslsl_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Record ID:</span>
                <span className="font-mono text-foreground">{item.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated:</span>
                <span className="text-foreground">{new Date(item.updated_at).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
