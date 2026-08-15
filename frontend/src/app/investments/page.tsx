"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Database, TrendingUp, DollarSign, Plus, BarChart3 } from "lucide-react"

interface Investment {
  id: string
  name: string
  type: string
  amount: number
  currentValue: number
  roi: number
  status: string
  date: string
}

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState<Investment[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    amount: "",
  })
  const [nasaTasks, setNasaTasks] = useState<any[]>([])
  const [nasaSearchTerm, setNasaSearchTerm] = useState("")
  const [nasaLoading, setNasaLoading] = useState(false)

  useEffect(() => {
    fetchInvestments()
    searchNasaTasks() // Load initial NASA tasks
  }, [])

  const fetchInvestments = async () => {
    try {
      const response = await fetch('/api/investments')
      const data = await response.json()
      setInvestments(data.investments || [])
    } catch (error) {
      console.error('Error fetching investments:', error)
    }
  }

  const searchNasaTasks = async () => {
    setNasaLoading(true)
    try {
      const response = await fetch('/api/nasa-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: nasaSearchTerm })
      })
      const data = await response.json()
      if (data.success) {
        setNasaTasks(data.tasks)
      }
    } catch (error) {
      console.error('Error searching NASA tasks:', error)
    } finally {
      setNasaLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/investments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      
      if (response.ok) {
        fetchInvestments()
        setShowForm(false)
        setFormData({ name: "", type: "", amount: "" })
      }
    } catch (error) {
      console.error('Error adding investment:', error)
    }
  }

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0)
  const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0)
  const totalROI = totalInvested > 0 ? ((totalValue - totalInvested) / totalInvested) * 100 : 0

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
              <p className="text-xs text-muted-foreground">Investment Management</p>
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
            <Link href="/investments" className="text-sm font-medium text-primary">
              Investments
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Investment Portfolio</h1>
          </div>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Investment
          </Button>
        </div>

        {/* Portfolio Summary */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">${totalInvested.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Current Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${totalValue.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total ROI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalROI.toFixed(1)}%
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">NASA Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">5</div>
            </CardContent>
          </Card>
        </div>

        {/* NASA Task Book Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>NASA Task Book - Investment Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Search NASA tasks (e.g., radiation, plant, biology)"
                  value={nasaSearchTerm}
                  onChange={(e) => setNasaSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={searchNasaTasks} disabled={nasaLoading}>
                  {nasaLoading ? 'Searching...' : 'Search'}
                </Button>
              </div>
              
              {nasaTasks.length > 0 && (
                <div className="space-y-3">
                  {nasaTasks.map((task) => (
                    <div key={task.id} className="bg-white p-4 rounded border hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-blue-900 mb-1">{task.title}</h4>
                          <p className="text-sm text-gray-600">PI: {task.pi}, {task.organization}</p>
                          <p className="text-sm text-gray-500 mb-2">{task.description}</p>
                          <div className="flex gap-2 items-center">
                            <Badge className={task.status === 'Active' ? 'bg-green-100 text-green-800' : task.status === 'Planning' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}>
                              {task.status}
                            </Badge>
                            <Badge className={task.investmentPotential === 'High' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>
                              {task.investmentPotential} Potential
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded font-medium">{task.funding}</span>
                          <div className="mt-2">
                            <a href="https://taskbook.nasaprs.com/tbp/index.cfm" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                              NASA Task Book →
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {nasaTasks.length === 0 && !nasaLoading && (
                <div className="text-center py-8 text-gray-500">
                  <p>Search for NASA research tasks to identify investment opportunities</p>
                  <p className="text-sm mt-1">Data sourced from taskbook.nasaprs.com</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Add Investment Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New Investment</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="name">Investment Name</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="SpaceX Stock"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stocks">Stocks</SelectItem>
                        <SelectItem value="bonds">Bonds</SelectItem>
                        <SelectItem value="crypto">Cryptocurrency</SelectItem>
                        <SelectItem value="real-estate">Real Estate</SelectItem>
                        <SelectItem value="nasa-research">NASA Research</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="amount">Amount ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      required
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="10000"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Add Investment</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Investments List */}
        <div className="space-y-4">
          {investments.filter(inv => inv.name !== "Space Technology ETF").map((investment) => (
            <Card key={investment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{investment.name}</h3>
                      <Badge variant="outline">{investment.type}</Badge>
                      <Badge 
                        className={investment.roi >= 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                      >
                        {investment.roi >= 0 ? '+' : ''}{investment.roi.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="grid md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Invested:</span> ${investment.amount.toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Current:</span> ${investment.currentValue.toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Status:</span> {investment.status}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> {investment.date}
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {investments.length === 0 && !showForm && (
          <Card className="text-center py-12">
            <CardContent>
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No investments yet</h3>
              <p className="text-muted-foreground mb-4">
                Start building your portfolio by adding your first investment
              </p>
              <Button onClick={() => setShowForm(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Investment
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}