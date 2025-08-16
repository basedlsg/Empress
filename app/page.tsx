import Header from "@/components/Header"
import HeroSplit from "@/components/HeroSplit"
import { EmailSignupForm } from "@/components/email-signup-form"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AskEmpress - Daily Guidance for Menopause | AI-Powered Wellness Support",
  description:
    "Get AI answers, weekly check-ins, small peer groups, and products that help you navigate menopause with confidence. Join thousands of women on their wellness journey.",
  keywords: "menopause, wellness, AI coach, women's health, perimenopause, support groups, affirmations",
  openGraph: {
    title: "AskEmpress - Daily Guidance for Menopause",
    description: "AI answers, weekly check-ins, small peer groups, and products that help.",
    type: "website",
    url: "https://askempress.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "AskEmpress - Daily Guidance for Menopause",
    description: "AI answers, weekly check-ins, small peer groups, and products that help.",
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Header />
      <main>
        <HeroSplit />

        {/* AskEmpress section */}
        <section className="mx-auto max-w-6xl px-4 py-16 text-center">
          <p className="uppercase tracking-wideish text-xs text-empress-ink/60">Empress Sense</p>
          <h2 className="font-serif text-4xl md:text-5xl mt-2 text-[var(--ink)]">
            AskEmpress: daily guidance for menopause
          </h2>
          <p className="max-w-2xl mx-auto mt-4 text-[15px] leading-7 text-empress-ink/80">
            AI answers grounded in expert content, weekly check-ins, micro-pods, and products that help.
          </p>
          <div className="mt-7 flex items-center justify-center gap-3">
            <Link href="/coach">
              <Button size="lg">Try AskEmpress</Button>
            </Link>
            <Link href="/shop">
              <Button variant="outline" size="lg">
                Shop Essentials
              </Button>
            </Link>
          </div>
        </section>

        {/* Email Capture Section */}
        <section className="bg-[var(--bg-alt)] py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="font-serif text-3xl font-bold tracking-tight text-[var(--ink)]">
                Join the Empress Community
              </h2>
              <p className="mt-4 text-[15px] leading-7 text-empress-ink/80">
                Get early access and receive weekly wellness insights tailored for your journey.
              </p>
              <div className="mt-8">
                <EmailSignupForm />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="uppercase tracking-wideish text-xs text-empress-ink/60 mb-3">How It Works</p>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-[var(--ink)]">
                Three Steps to Transformation
              </h2>
              <p className="mt-4 text-[15px] leading-7 text-empress-ink/80">
                Simple steps to navigate your menopause journey with confidence
              </p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-3">
              <ProcessCard
                step="1"
                title="AskEmpress"
                description="Get instant, personalized answers to your menopause questions from our AI coach trained on women's health expertise."
                icon="💬"
              />
              <ProcessCard
                step="2"
                title="Check-ins"
                description="Track your symptoms, mood, and progress with weekly wellness assessments and beautiful trend visualizations."
                icon="📊"
              />
              <ProcessCard
                step="3"
                title="Micro-pods"
                description="Connect with small groups of women going through similar experiences for support and shared wisdom."
                icon="👥"
              />
            </div>
          </div>
        </section>

        {/* What's Included Section */}
        <section className="py-20 bg-[var(--bg-alt)]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="uppercase tracking-wideish text-xs text-empress-ink/60 mb-3">What's Included</p>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-[var(--ink)]">Everything You Need</h2>
              <p className="mt-4 text-[15px] leading-7 text-empress-ink/80">Complete wellness transformation tools</p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                title="Daily Affirmations"
                description="Personalized morning and evening affirmations delivered at your perfect times to boost confidence and positivity."
                href="/affirmations"
              />
              <FeatureCard
                title="Curated Shop"
                description="Carefully selected products from trusted brands, integrated seamlessly with Shopify for easy ordering."
                href="/shop"
              />
              <FeatureCard
                title="Achievement System"
                description="Earn badges, maintain streaks, and celebrate milestones with our gamified wellness tracking system."
                href="/account"
              />
            </div>
          </div>
        </section>

        {/* Roadmap Section */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="uppercase tracking-wideish text-xs text-empress-ink/60 mb-3">Roadmap</p>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-[var(--ink)]">Coming Soon</h2>
              <p className="mt-4 text-[15px] leading-7 text-empress-ink/80">Exciting features on our roadmap</p>
            </div>

            <div className="mt-16 flex justify-center">
              <RoadmapCard
                title="Doctors Directory"
                description="Find menopause-specialized healthcare providers in your area, with reviews and availability from women who understand your journey."
                href="/doctors"
                status="In Development"
              />
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="bg-[var(--primary)] py-20">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="font-serif text-4xl font-bold tracking-tight text-white">Ready to Embrace This Chapter?</h2>
            <p className="mt-6 text-[15px] leading-7 text-white/90">
              Join thousands of women who've transformed their menopause experience with AskEmpress.
            </p>
            <div className="mt-10">
              <Button
                variant="outline"
                size="lg"
                className="bg-white text-[var(--primary)] hover:bg-[var(--bg-alt)] border-white px-10 py-4 text-lg font-semibold"
              >
                <Link href="/coach">Start Your Journey Today</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t bg-[var(--bg-alt)]">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="sm:col-span-2">
                <div className="flex items-center space-x-3">
                  <div className="font-serif text-2xl font-bold text-[var(--primary)]">Empress</div>
                </div>
                <p className="mt-4 text-empress-ink/80 max-w-md text-[15px] leading-7">
                  Empowering women through menopause with AI guidance, community support, and curated wellness
                  resources.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[var(--ink)] mb-4">Features</h3>
                <ul className="space-y-2 text-empress-ink/80">
                  <li>
                    <Link href="/pods" className="hover:text-[var(--primary)] transition-colors">
                      Community Pods
                    </Link>
                  </li>
                  <li>
                    <Link href="/affirmations" className="hover:text-[var(--primary)] transition-colors">
                      Affirmations
                    </Link>
                  </li>
                  <li>
                    <Link href="/checkins" className="hover:text-[var(--primary)] transition-colors">
                      Check-ins
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-[var(--ink)] mb-4">Resources</h3>
                <ul className="space-y-2 text-empress-ink/80">
                  <li>
                    <Link href="/doctors" className="hover:text-[var(--primary)] transition-colors">
                      Find Doctors
                    </Link>
                  </li>
                  <li>
                    <Link href="/account" className="hover:text-[var(--primary)] transition-colors">
                      Your Account
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop" className="hover:text-[var(--primary)] transition-colors">
                      Wellness Shop
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-200 text-center">
              <p className="text-empress-ink/60">© 2024 AskEmpress. Empowering women through every transition.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

interface ProcessCardProps {
  step: string
  title: string
  description: string
  icon: string
}

function ProcessCard({ step, title, description, icon }: ProcessCardProps) {
  return (
    <div className="relative text-center empress-card p-8">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary)] text-2xl text-white font-bold">
        {step}
      </div>
      <h3 className="font-serif text-xl font-semibold text-[var(--ink)] mb-3">{title}</h3>
      <p className="text-empress-ink/80 leading-relaxed text-[15px]">{description}</p>
    </div>
  )
}

interface FeatureCardProps {
  title: string
  description: string
  href: string
}

function FeatureCard({ title, description, href }: FeatureCardProps) {
  return (
    <Card className="group cursor-pointer transition-all hover:shadow-xl hover:-translate-y-2 border-0 shadow-soft empress-card-hover">
      <Link href={href}>
        <CardContent className="p-8">
          <div className="mb-4 h-12 w-12 rounded-lg bg-[var(--primary)] flex items-center justify-center">
            <div className="h-6 w-6 bg-white rounded opacity-80" />
          </div>
          <h3 className="font-serif text-xl font-semibold text-[var(--ink)] mb-3 group-hover:text-[var(--primary)] transition-colors">
            {title}
          </h3>
          <p className="text-empress-ink/80 leading-relaxed text-[15px]">{description}</p>
        </CardContent>
      </Link>
    </Card>
  )
}

interface RoadmapCardProps {
  title: string
  description: string
  href: string
  status: string
}

function RoadmapCard({ title, description, href, status }: RoadmapCardProps) {
  return (
    <Card className="max-w-md border-2 border-slate-200 shadow-soft empress-card">
      <CardContent className="p-8 text-center">
        <div className="mb-4 inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
          {status}
        </div>
        <h3 className="font-serif text-xl font-semibold text-[var(--ink)] mb-3">{title}</h3>
        <p className="text-empress-ink/80 leading-relaxed mb-6 text-[15px]">{description}</p>
        <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50 bg-transparent">
          <Link href={href}>Learn More</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
