import { Navigation } from "@/components/navigation"
import { ProductDetail } from "@/components/product-detail"

interface ProductPageProps {
  params: {
    handle: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <ProductDetail handle={params.handle} />
    </div>
  )
}
