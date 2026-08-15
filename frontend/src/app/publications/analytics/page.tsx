"use client"

import Link from "next/link"
import { Database, BarChart3 } from "lucide-react"
import PublicationsDashboard from "@/components/publications-dashboard"
import DOIValidator from "@/components/doi-validator"

export default function PublicationsAnalyticsPage() {
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
              <p className="text-xs text-muted-foreground">Publications Analytics</p>
            </div>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/publications" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Publications
            </Link>
            <Link href="/publications/analytics" className="text-sm font-medium text-primary">
              Analytics
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <BarChart3 className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold">FY2024 Publications Analytics</h1>
        </div>

        <div className="space-y-8">
          <DOIValidator />
          <PublicationsDashboard />
        </div>
      </div>
    </div>
  )
}