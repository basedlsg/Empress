import { Navigation } from "@/components/navigation"
import { PodCalendar } from "@/components/pod-calendar"

export default function PodCalendarPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Pod <span className="empress-text-gradient">Calendar</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            View upcoming pod meetings, expert AMAs, and menopause support events. Never miss a session that matters to
            your wellness journey.
          </p>
        </div>

        <PodCalendar />
      </div>
    </div>
  )
}
