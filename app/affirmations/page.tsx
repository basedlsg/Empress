import { Navigation } from "@/components/navigation"
import { AffirmationsScheduler } from "@/components/affirmations-scheduler"

export default function AffirmationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Daily <span className="empress-text-gradient">Affirmations</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Start and end your day with empowering messages that nurture your growth and well-being.
          </p>
        </div>

        <AffirmationsScheduler />
      </div>
    </div>
  )
}
