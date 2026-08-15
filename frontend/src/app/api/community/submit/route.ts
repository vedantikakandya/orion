import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const formData = await request.json()

    // Validate required fields
    if (!formData.submitter_name || !formData.submitter_email || !formData.submission_type || !formData.title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Log submission (in production, save to database)
    console.log("Community submission received:", {
      name: formData.submitter_name,
      email: formData.submitter_email,
      type: formData.submission_type,
      title: formData.title,
      description: formData.description,
      url: formData.url,
      timestamp: new Date().toISOString()
    })

    // Send Discord notification (optional)
    await sendDiscordNotification(formData)

    return NextResponse.json({ 
      success: true, 
      message: "Submission received successfully" 
    })

  } catch (error) {
    console.error("Community submission error:", error)
    return NextResponse.json({ error: "Failed to process submission" }, { status: 500 })
  }
}

async function sendDiscordNotification(formData: any) {
  // Discord webhook URL (replace with actual webhook if available)
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL
  
  if (!webhookUrl) {
    console.log("Discord webhook not configured")
    return
  }

  try {
    const embed = {
      title: "🚀 New Community Submission",
      color: 0x3b82f6,
      fields: [
        { name: "Submitter", value: formData.submitter_name, inline: true },
        { name: "Type", value: formData.submission_type, inline: true },
        { name: "Title", value: formData.title, inline: false },
        { name: "Description", value: formData.description || "No description provided", inline: false },
        { name: "URL", value: formData.url || "No URL provided", inline: false }
      ],
      timestamp: new Date().toISOString(),
      footer: { text: "ORION Community Platform" }
    }

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] })
    })
  } catch (error) {
    console.error("Failed to send Discord notification:", error)
  }
}