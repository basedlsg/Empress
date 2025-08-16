import { Navigation } from "@/components/navigation"
import { PodsInterface } from "@/components/pods-interface"

export default function PodsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Community <span className="empress-text-gradient">Pods</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with like-minded women in small, supportive micro-communities. Share experiences, find
            accountability, and grow together.
          </p>
        </div>

        <PodsInterface />
      </div>
    </div>
  )
}
