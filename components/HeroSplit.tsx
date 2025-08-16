import { Button } from "@/components/ui/Button"
import Link from "next/link"

export default function HeroSplit() {
  return (
    <section className="mx-auto max-w-7xl grid md:grid-cols-2 gap-8 py-12 md:py-20 px-4">
      <div className="rounded-xl overflow-hidden shadow-soft">
        <img
          src="/elegant-woman-menopause-wellness.png"
          alt="Menopause wellness"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex items-center">
        <div className="max-w-xl">
          <p className="uppercase tracking-wideish text-xs text-empress-ink/60 mb-3">Menopause Wellness Edit</p>
          <h1 className="font-serif text-4xl md:text-5xl leading-tight mb-5">Navigate Menopause with Confidence</h1>
          <p className="text-[15px] leading-7 text-empress-ink/80 mb-7">
            Designed to support your journey through menopause with AI-powered guidance, community support, and curated
            products. From hot flash relief to mood balance, we're here for every step of your transformation.
          </p>
          <Link href="/shop">
            <Button variant="outline" size="lg">
              Shop Essentials
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
