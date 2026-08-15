import { NextResponse } from "next/server"

// Mock investment data
let investments = [
  {
    id: "1",
    name: "SpaceX Stock",
    type: "stocks",
    amount: 50000,
    currentValue: 65000,
    roi: 30.0,
    status: "Active",
    date: "2024-01-15"
  },
  {
    id: "2", 
    name: "NASA Research Bonds",
    type: "bonds",
    amount: 25000,
    currentValue: 26500,
    roi: 6.0,
    status: "Active",
    date: "2024-02-01"
  },
  {
    id: "3",
    name: "Space Technology ETF",
    type: "stocks", 
    amount: 30000,
    currentValue: 28500,
    roi: -5.0,
    status: "Active",
    date: "2024-03-10"
  }
]

export async function GET() {
  try {
    return NextResponse.json({ investments })
  } catch (error) {
    console.error("Investments fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch investments" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, type, amount } = await request.json()
    
    const newInvestment = {
      id: Date.now().toString(),
      name,
      type,
      amount: parseFloat(amount),
      currentValue: parseFloat(amount) * (1 + (Math.random() * 0.2 - 0.1)), // Random ±10%
      roi: (Math.random() * 20 - 10), // Random -10% to +10%
      status: "Active",
      date: new Date().toISOString().split('T')[0]
    }
    
    investments.push(newInvestment)
    
    return NextResponse.json({ success: true, investment: newInvestment })
  } catch (error) {
    console.error("Investment creation error:", error)
    return NextResponse.json({ error: "Failed to create investment" }, { status: 500 })
  }
}