"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ShoppingCart, Heart, Star, Truck, Shield, RotateCcw, FileText } from "lucide-react"

interface Product {
  id: string
  handle?: string
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
  details: {
    ingredients?: string[]
    benefits?: string[]
    usage?: string
    size?: string
    weight?: string
    coa?: string
  }
}

interface ProductDetailProps {
  handle: string
}

export function ProductDetail({ handle }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { toast } = useToast()

  useEffect(() => {
    fetchProduct()
  }, [handle])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/shopify/products/${handle}`)
      const data = await response.json()

      if (response.ok) {
        setProduct(data.product)
      } else {
        throw new Error(data.error || "Product not found")
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to load product",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToCart = () => {
    // TODO: Implement actual cart functionality with Shopify Cart API
    // TODO: Add cart state management and persistence
    toast({
      title: "Added to Cart!",
      description: `${quantity} x ${product?.title} added to your cart.`,
    })
  }

  const handleSubscribe = () => {
    // TODO: Implement subscription functionality with Shopify Subscriptions API
    // TODO: Add subscription management and billing
    toast({
      title: "Subscription Started!",
      description: `You'll receive ${product?.title} monthly. Manage your subscription in your account.`,
    })
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Skeleton className="h-96 w-full rounded-lg" />
            <div className="flex space-x-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-20 rounded" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/shop">Back to Shop</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/shop" className="flex items-center space-x-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Shop</span>
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-lg">
            <Image
              src={product.images[selectedImage] || "/placeholder.svg?height=500&width=500&query=wellness product"}
              alt={product.title}
              width={500}
              height={500}
              className="w-full h-96 object-cover"
            />
            {product.featured && (
              <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">Featured</Badge>
            )}
          </div>

          {/* Image Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden ${
                    selectedImage === index ? "border-primary" : "border-border"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg?height=80&width=80&query=wellness product"}
                    alt={`${product.title} ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline">{product.category}</Badge>
              <div className="flex items-center space-x-1">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
              </div>
            </div>

            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

            <div className="flex items-center space-x-4 mb-4">
              <span className="text-3xl font-bold">{product.price}</span>
              {product.compareAtPrice && (
                <span className="text-xl text-muted-foreground line-through">{product.compareAtPrice}</span>
              )}
              {product.compareAtPrice && (
                <Badge variant="destructive">
                  Save{" "}
                  {Math.round(
                    ((Number.parseFloat(product.compareAtPrice.replace("$", "")) -
                      Number.parseFloat(product.price.replace("$", ""))) /
                      Number.parseFloat(product.compareAtPrice.replace("$", ""))) *
                      100,
                  )}
                  %
                </Badge>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label htmlFor="quantity" className="font-medium">
                Quantity:
              </label>
              <div className="flex items-center border rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 hover:bg-accent"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-1 border-x">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-1 hover:bg-accent">
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleAddToCart} disabled={!product.inStock} className="flex-1" size="lg">
                <ShoppingCart className="h-4 w-4 mr-2" />
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
              <Button
                onClick={handleSubscribe}
                variant="outline"
                disabled={!product.inStock}
                className="flex-1 bg-transparent"
                size="lg"
              >
                Subscribe & Save 15%
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Product Features */}
          <div className="grid grid-cols-3 gap-4 py-6 border-y">
            <div className="text-center">
              <Truck className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">Free Shipping</p>
              <p className="text-xs text-muted-foreground">On orders over $50</p>
            </div>
            <div className="text-center">
              <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">Quality Guarantee</p>
              <p className="text-xs text-muted-foreground">100% satisfaction</p>
            </div>
            <div className="text-center">
              <RotateCcw className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">Easy Returns</p>
              <p className="text-xs text-muted-foreground">30-day policy</p>
            </div>
          </div>

          {/* Product Details */}
          {product.details && (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Product Details</h3>
                  <div className="space-y-4">
                    {product.details.size && (
                      <div>
                        <span className="font-medium">Size: </span>
                        <span className="text-muted-foreground">{product.details.size}</span>
                      </div>
                    )}
                    {product.details.weight && (
                      <div>
                        <span className="font-medium">Weight: </span>
                        <span className="text-muted-foreground">{product.details.weight}</span>
                      </div>
                    )}
                    {product.details.ingredients && (
                      <div>
                        <span className="font-medium">Key Ingredients: </span>
                        <span className="text-muted-foreground">{product.details.ingredients.join(", ")}</span>
                      </div>
                    )}
                    {product.details.benefits && (
                      <div>
                        <span className="font-medium">Benefits: </span>
                        <ul className="list-disc list-inside text-muted-foreground mt-1">
                          {product.details.benefits.map((benefit, index) => (
                            <li key={index}>{benefit}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {product.details.usage && (
                      <div>
                        <span className="font-medium">Usage: </span>
                        <span className="text-muted-foreground">{product.details.usage}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Certificate of Analysis (COA) */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-primary" />
                        Certificate of Analysis (COA)
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {product.details.coa || "Third-party lab tested for purity, potency, and safety."}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      {/* TODO: Link to actual COA document when available */}
                      View COA
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
