import { type NextRequest, NextResponse } from "next/server"

// TODO: Integrate with email service (SendGrid, Mailchimp, etc.)
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email address is required" }, { status: 400 })
    }

    // TODO: Save email to database or email service
    console.log("Email signup:", email)

    // Mock success response
    return NextResponse.json({
      success: true,
      message: "Successfully joined the waitlist!",
    })
  } catch (error) {
    console.error("Email signup error:", error)
    return NextResponse.json({ error: "Failed to process signup" }, { status: 500 })
  }
}
