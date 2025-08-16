import { Navigation } from "@/components/navigation"
import { ChatInterface } from "@/components/chat-interface"

export default function CoachPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="empress-text-gradient">AskEmpress</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Your menopause concierge for daily guidance, education, and support.
          </p>
        </div>

        <ChatInterface />
      </div>
    </div>
  )
}
