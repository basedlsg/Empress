import { Navigation } from "@/components/navigation"
import { AccountDashboard } from "@/components/account-dashboard"

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Your <span className="empress-text-gradient">Account</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Track your wellness journey with streaks, badges, and community achievements.
          </p>
        </div>

        <AccountDashboard />
      </div>
    </div>
  )
}
