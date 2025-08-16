import { Navigation } from "@/components/navigation"
import { CheckinsInterface } from "@/components/checkins-interface"

export default function CheckinsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Weekly <span className="empress-text-gradient">Check-ins</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Track your wellness journey with guided questions and visualize your progress over time.
          </p>
        </div>

        <CheckinsInterface />
      </div>
    </div>
  )
}
