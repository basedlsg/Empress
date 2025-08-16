import { Navigation } from "@/components/navigation"
import { DoctorsDirectory } from "@/components/doctors-directory"

export default function DoctorsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Healthcare <span className="empress-text-gradient">Directory</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Find trusted healthcare providers who understand women's unique wellness needs.
          </p>
        </div>

        <DoctorsDirectory />
      </div>
    </div>
  )
}
