import { sql } from "@/lib/db"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Folder, Calendar, Users, DollarSign, Rocket, Dna } from "lucide-react"
import Link from "next/link"

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const projects = await sql`
    SELECT * FROM projects WHERE id = ${params.id}
  `

  if (projects.length === 0) {
    notFound()
  }

  const project = projects[0]

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
              <Badge variant="outline">Project</Badge>
              {project.status && <Badge variant="secondary">{project.status}</Badge>}
              {project.task_book_id && (
                <Badge variant="secondary" className="gap-1">
                  <Folder className="size-3" />
                  {project.task_book_id}
                </Badge>
              )}
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">{project.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {project.start_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="size-4" />
                  {new Date(project.start_date).toLocaleDateString()}
                  {project.end_date && ` - ${new Date(project.end_date).toLocaleDateString()}`}
                </div>
              )}
              {project.funding_amount && (
                <div className="flex items-center gap-2">
                  <DollarSign className="size-4" />${project.funding_amount.toLocaleString()}
                </div>
              )}
            </div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="size-5" />
                <CardTitle className="text-lg">Research Team</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {project.principal_investigator && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Principal Investigator</p>
                  <p className="font-medium text-foreground">{project.principal_investigator}</p>
                  {project.institution && <p className="text-sm text-muted-foreground">{project.institution}</p>}
                </div>
              )}
              {project.co_investigators && project.co_investigators.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Co-Investigators</p>
                  <div className="flex flex-wrap gap-2">
                    {project.co_investigators.map((investigator: string, i: number) => (
                      <Badge key={i} variant="secondary">
                        {investigator}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {project.description && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{project.description}</p>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {project.research_areas && project.research_areas.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Research Areas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.research_areas.map((area: string, i: number) => (
                      <Badge key={i} variant="outline">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {project.disciplines && project.disciplines.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Disciplines</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.disciplines.map((discipline: string, i: number) => (
                      <Badge key={i} variant="secondary">
                        {discipline}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {project.missions && project.missions.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Rocket className="size-5" />
                    <CardTitle className="text-lg">Missions</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.missions.map((mission: string, i: number) => (
                      <Badge key={i} variant="outline">
                        {mission}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {project.organisms && project.organisms.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Dna className="size-5" />
                    <CardTitle className="text-lg">Organisms</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.organisms.map((organism: string, i: number) => (
                      <Badge key={i} variant="outline">
                        {organism}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {project.project_url && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Links</CardTitle>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full justify-start gap-2 bg-transparent">
                  <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="size-4" />
                    View on NASA Task Book
                    <ExternalLink className="size-3 ml-auto" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">Traceability</CardTitle>
              <CardDescription>Source information and data provenance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Source:</span>
                <span className="font-medium text-foreground">NASA Task Book</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Task Book ID:</span>
                <span className="font-mono text-foreground">{project.task_book_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Record ID:</span>
                <span className="font-mono text-foreground">{project.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated:</span>
                <span className="text-foreground">{new Date(project.updated_at).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
