"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import Image from "next/image"
import { Star, Heart } from "lucide-react"

interface Product {
  id: string
  title: string
  description: string
  price: string
  compareAtPrice?: string
  images: string[]
  category: string
  rating: number
  reviewCount: number
  inStock: boolean
  featured: boolean
  handle?: string
}

export function ProductsGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dataSource, setDataSource] = useState<"shopify" | "mock">("mock")

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/shopify/products")
      const data = await response.json()

      if (response.ok) {
        setProducts(data.products)
        setDataSource(data.source)
      } else {
        throw new Error(data.error || "Failed to fetch products")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-0">
              <Skeleton className="h-64 w-full rounded-t-lg" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={fetchProducts} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  const featuredProducts = products.filter((p) => p.featured)
  const regularProducts = products.filter((p) => !p.featured)

  return (
    <div className="space-y-12">
      {dataSource === "mock" && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
          <p className="text-sm text-amber-800">
            <strong>Demo Mode:</strong> Showing sample products. Configure Shopify integration in environment variables
            for live data.
          </p>
        </div>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} featured />
            ))}
          </div>
        </section>
      )}

      {/* All Products */}
      <section>
        <h2 className="text-2xl font-bold mb-6">All Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {regularProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}

interface ProductCardProps {
  product: Product
  featured?: boolean
}

function ProductCard({ product, featured = false }: ProductCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)

  return (
    <Card
      className={`group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 ${featured ? "lg:col-span-1" : ""}`}
    >
      <Link href={`/shop/${product.handle || product.id}`}>
        <CardContent className="p-0">
          {/* Product Image */}
          <div className="relative overflow-hidden rounded-t-lg">
            <Image
              src={product.images[0] || "/placeholder.svg?height=300&width=300&query=wellness product"}
              alt={product.title}
              width={300}
              height={300}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {featured && <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">Featured</Badge>}
            {!product.inStock && (
              <Badge variant="secondary" className="absolute top-2 right-2">
                Out of Stock
              </Badge>
            )}
            <button
              onClick={(e) => {
                e.preventDefault()
                setIsFavorited(!isFavorited)
              }}
              className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
            >
              <Heart className={`h-4 w-4 ${isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
            </button>
          </div>

          {/* Product Info */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className="text-xs">
                {product.category}
              </Badge>
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-muted-foreground">
                  {product.rating} ({product.reviewCount})
                </span>
              </div>
            </div>

            <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {product.title}
            </h3>

            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{product.description}</p>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg">{product.price}</span>
                {product.compareAtPrice && (
                  <span className="text-sm text-muted-foreground line-through">{product.compareAtPrice}</span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" disabled={!product.inStock} className="flex-1">
                {product.inStock ? "Add" : "Sold Out"}
              </Button>
              <Button size="sm" variant="outline" disabled={!product.inStock} className="flex-1 bg-transparent">
                Subscribe
              </Button>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
