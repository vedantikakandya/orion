"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Filter, X } from "lucide-react"

interface SearchFiltersProps {
  filters: {
    contentTypes: string[]
    missions: string[]
    organisms: string[]
    researchAreas: string[]
    publicationType: string
  }
  availableFilters: {
    missions: string[]
    organisms: string[]
    researchAreas: string[]
  }
  onFilterChange: (filters: any) => void
}

export function SearchFilters({ filters, availableFilters, onFilterChange }: SearchFiltersProps) {
  const toggleContentType = (type: string) => {
    const newTypes = filters.contentTypes.includes(type)
      ? filters.contentTypes.filter((t) => t !== type)
      : [...filters.contentTypes, type]
    onFilterChange({ ...filters, contentTypes: newTypes })
  }

  const toggleArrayFilter = (category: "missions" | "organisms" | "researchAreas", value: string) => {
    const current = filters[category]
    const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    onFilterChange({ ...filters, [category]: updated })
  }

  const clearFilters = () => {
    onFilterChange({
      contentTypes: ["publication", "dataset", "library_item", "project"],
      missions: [],
      organisms: [],
      researchAreas: [],
      publicationType: "all",
    })
  }

  const setPublicationType = (type: string) => {
    onFilterChange({ ...filters, publicationType: type })
  }

  const activeFilterCount =
    (filters.contentTypes.length < 4 ? 1 : 0) +
    filters.missions.length +
    filters.organisms.length +
    filters.researchAreas.length +
    (filters.publicationType !== "all" ? 1 : 0)

  const hasMissions = availableFilters?.missions && availableFilters.missions.length > 0
  const hasOrganisms = availableFilters?.organisms && availableFilters.organisms.length > 0
  const hasResearchAreas = availableFilters?.researchAreas && availableFilters.researchAreas.length > 0

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Filter className="size-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm text-foreground">Filters</h4>
              {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-auto p-1 text-xs">
                  Clear all
                </Button>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <Label className="text-xs font-semibold text-foreground">Publication Source</Label>
                <div className="mt-2 space-y-2">
                  {[
                    { value: "all", label: "All Publications" },
                    { value: "fy2024", label: "Biology Publications (54)" },
                    { value: "pmc", label: "PMC Database" },
                  ].map((type) => (
                    <div key={type.value} className="flex items-center gap-2">
                      <Checkbox
                        id={`pub-${type.value}`}
                        checked={filters.publicationType === type.value}
                        onCheckedChange={() => setPublicationType(type.value)}
                      />
                      <Label htmlFor={`pub-${type.value}`} className="text-sm font-normal cursor-pointer text-foreground">
                        {type.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-foreground">Content Type</Label>
                <div className="mt-2 space-y-2">
                  {[
                    { value: "publication", label: "Publications" },
                    { value: "dataset", label: "Datasets" },
                    { value: "library_item", label: "Library Items" },
                    { value: "project", label: "Projects" },
                  ].map((type) => (
                    <div key={type.value} className="flex items-center gap-2">
                      <Checkbox
                        id={type.value}
                        checked={filters.contentTypes.includes(type.value)}
                        onCheckedChange={() => toggleContentType(type.value)}
                      />
                      <Label htmlFor={type.value} className="text-sm font-normal cursor-pointer text-foreground">
                        {type.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {hasMissions && (
                <div>
                  <Label className="text-xs font-semibold text-foreground">Missions</Label>
                  <ScrollArea className="h-32 mt-2">
                    <div className="space-y-2">
                      {availableFilters.missions.slice(0, 20).map((mission) => (
                        <div key={mission} className="flex items-center gap-2">
                          <Checkbox
                            id={`mission-${mission}`}
                            checked={filters.missions.includes(mission)}
                            onCheckedChange={() => toggleArrayFilter("missions", mission)}
                          />
                          <Label
                            htmlFor={`mission-${mission}`}
                            className="text-sm font-normal cursor-pointer text-foreground"
                          >
                            {mission}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {hasOrganisms && (
                <div>
                  <Label className="text-xs font-semibold text-foreground">Organisms</Label>
                  <ScrollArea className="h-32 mt-2">
                    <div className="space-y-2">
                      {availableFilters.organisms.slice(0, 20).map((organism) => (
                        <div key={organism} className="flex items-center gap-2">
                          <Checkbox
                            id={`organism-${organism}`}
                            checked={filters.organisms.includes(organism)}
                            onCheckedChange={() => toggleArrayFilter("organisms", organism)}
                          />
                          <Label
                            htmlFor={`organism-${organism}`}
                            className="text-sm font-normal cursor-pointer text-foreground"
                          >
                            {organism}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {hasResearchAreas && (
                <div>
                  <Label className="text-xs font-semibold text-foreground">Research Areas</Label>
                  <ScrollArea className="h-32 mt-2">
                    <div className="space-y-2">
                      {availableFilters.researchAreas.slice(0, 20).map((area) => (
                        <div key={area} className="flex items-center gap-2">
                          <Checkbox
                            id={`area-${area}`}
                            checked={filters.researchAreas.includes(area)}
                            onCheckedChange={() => toggleArrayFilter("researchAreas", area)}
                          />
                          <Label
                            htmlFor={`area-${area}`}
                            className="text-sm font-normal cursor-pointer text-foreground"
                          >
                            {area}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {filters.missions.map((mission) => (
        <Badge key={mission} variant="secondary" className="gap-1">
          {mission}
          <button onClick={() => toggleArrayFilter("missions", mission)} className="ml-1">
            <X className="size-3" />
          </button>
        </Badge>
      ))}

      {filters.organisms.map((organism) => (
        <Badge key={organism} variant="secondary" className="gap-1">
          {organism}
          <button onClick={() => toggleArrayFilter("organisms", organism)} className="ml-1">
            <X className="size-3" />
          </button>
        </Badge>
      ))}

      {filters.researchAreas.map((area) => (
        <Badge key={area} variant="secondary" className="gap-1">
          {area}
          <button onClick={() => toggleArrayFilter("researchAreas", area)} className="ml-1">
            <X className="size-3" />
          </button>
        </Badge>
      ))}

      {filters.publicationType !== "all" && (
        <Badge variant="secondary" className="gap-1">
          {filters.publicationType === "fy2024" ? "FY2024 Complete" : "PMC Database"}
          <button onClick={() => setPublicationType("all")} className="ml-1">
            <X className="size-3" />
          </button>
        </Badge>
      )}
    </div>
  )
}
