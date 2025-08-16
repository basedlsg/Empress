import { Navigation } from "@/components/navigation"
import { ProductsGrid } from "@/components/products-grid"

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Wellness <span className="empress-text-gradient">Shop</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover curated products and resources to support your wellness journey. From self-care essentials to
            personal growth tools.
          </p>
        </div>

        <ProductsGrid />
      </div>
    </div>
  )
}
