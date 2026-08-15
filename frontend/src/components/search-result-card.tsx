import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { BookOpen, Database, FileText, Folder } from "lucide-react"
import Link from "next/link"
import type { SearchResult } from "@/lib/types"

interface SearchResultCardProps {
  result: SearchResult
  selected?: boolean
  onSelect?: (selected: boolean) => void
}

export function SearchResultCard({ result, selected, onSelect }: SearchResultCardProps) {
  const icon = {
    publication: <FileText className="size-5" />,
    dataset: <Database className="size-5" />,
    library_item: <BookOpen className="size-5" />,
    project: <Folder className="size-5" />,
  }[result.type]

  const typeLabel = {
    publication: "Publication",
    dataset: "Dataset",
    library_item: "Library Item",
    project: "Project",
  }[result.type]

  const href = (result as any).link || `/${result.type}/${result.id}`
  const isExternal = (result as any).link?.startsWith('http')

  const handleCheckboxChange = (checked: boolean) => {
    onSelect?.(checked)
  }

  return (
    <Card className="hover:border-primary transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            {onSelect && <Checkbox checked={selected} onCheckedChange={handleCheckboxChange} className="mt-1" />}
            <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary shrink-0">
              {icon}
            </div>
            {isExternal ? (
              <a href={href} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-0">
                <CardTitle className="text-lg line-clamp-2 text-balance hover:text-primary transition-colors">
                  {result.title}
                </CardTitle>
              </a>
            ) : (
              <Link href={href} className="flex-1 min-w-0">
                <CardTitle className="text-lg line-clamp-2 text-balance hover:text-primary transition-colors">
                  {result.title}
                </CardTitle>
              </Link>
            )}
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {typeLabel}
              </Badge>
              {result.relevance_score && (
                <span className="text-xs text-muted-foreground">
                  {Math.round(result.relevance_score * 100)}% match
                </span>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isExternal ? (
          <a href={href} target="_blank" rel="noopener noreferrer">
            <CardDescription className="line-clamp-3 text-pretty hover:text-foreground transition-colors">
              {result.description}
            </CardDescription>
          </a>
        ) : (
          <Link href={href}>
            <CardDescription className="line-clamp-3 text-pretty hover:text-foreground transition-colors">
              {result.description}
            </CardDescription>
          </Link>
        )}
      </CardContent>
    </Card>
  )
}