"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Send, CheckCircle, Database, MessageCircle } from "lucide-react"
import Link from "next/link"

export default function CommunityPage() {
  const [formData, setFormData] = useState({
    submitter_name: "",
    submitter_email: "",
    submission_type: "",
    title: "",
    description: "",
    url: "",
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/community/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitted(true)
        setFormData({
          submitter_name: "",
          submitter_email: "",
          submission_type: "",
          title: "",
          description: "",
          url: "",
        })
      }
    } catch (error) {
      console.error("Submission failed:", error)
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
              <p className="text-xs text-muted-foreground">Community</p>
            </div>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/search" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Search
            </Link>
            <Link href="/discover" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Discover
            </Link>
            <Link href="/visualize" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Visualize
            </Link>
            <Link href="/investments" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Investments
            </Link>
            <Link href="/community" className="text-sm font-medium text-primary">
              Community
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <Users className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold">Community Contributions</h1>
        </div>

        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">About Community Submissions</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Help expand the Space Knowledge Engine by submitting relevant research, datasets, or resources. All
            submissions are being added to the database.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We welcome publications, datasets, educational materials, and other resources related to space
            research. Your contributions help make this platform more comprehensive and valuable for the research
            community.
          </p>
          <p className="text-muted-foreground leading-relaxed font-semibold">
            Do join our Discord server to connect to your fellow researchers and discuss your submissions!
          </p>
        </Card>

        {submitted ? (
          <Card className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Submission Received!</h3>
            <p className="text-muted-foreground mb-6">
              Thank you for your contribution. Our team will add it to the database.
            </p>
            <Button onClick={() => setSubmitted(false)}>Submit Another</Button>
          </Card>
        ) : (
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-6">Submit a Resource</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Your Name *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.submitter_name}
                    onChange={(e) => setFormData({ ...formData, submitter_name: e.target.value })}
                    placeholder="Dr. Jane Smith"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Your Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.submitter_email}
                    onChange={(e) => setFormData({ ...formData, submitter_email: e.target.value })}
                    placeholder="jane.smith@example.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="type">Submission Type *</Label>
                <Select
                  value={formData.submission_type}
                  onValueChange={(value) => setFormData({ ...formData, submission_type: value })}
                  required
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="publication">Publication</SelectItem>
                    <SelectItem value="dataset">Dataset</SelectItem>
                    <SelectItem value="library_item">Educational Resource</SelectItem>
                    <SelectItem value="project">Research Project</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter the title of the resource"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide a brief description of the resource"
                  className="min-h-[120px]"
                />
              </div>

              <div>
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://example.com/resource"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full" size="lg">
                {loading ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Resource
                  </>
                )}
              </Button>
            </form>
          </Card>
        )}

        {/* Discord Invite Card */}
        <Card className="p-8 mt-8 bg-blue-600 text-white">
          <div className="flex items-center gap-3 mb-4">
            <MessageCircle className="w-8 h-8 text-white" />
            <h2 className="text-2xl font-semibold">Connect on Discord</h2>
          </div>
          <p className="leading-relaxed mb-6">
            Connect, chat, and collaborate with us on Discord. Join our community of researchers to share ideas,
            discuss your submissions, and network with like-minded people.
          </p>
          <a href="https://discord.gg/6hrRfzbQwM" target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              className="w-full bg-white text-blue-600 hover:bg-gray-100 font-bold"
            >
              Join Now
            </Button>
          </a>
        </Card>
      </div>
    </div>
  )
}