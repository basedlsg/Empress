import { NextResponse } from "next/server"

interface RouteParams {
  params: {
    handle: string
  }
}

// Mock products (same as in main route)
const mockProducts = [
  {
    id: "gid://shopify/Product/1",
    handle: "menopause-support-supplement",
    title: "Menopause Support Supplement",
    description:
      "Natural herbal blend with black cohosh, red clover, and evening primrose oil to support hormonal balance during menopause.",
    price: "$34.99",
    compareAtPrice: "$44.99",
    images: ["/placeholder-n74zy.png"],
    category: "Supplements",
    rating: 4.8,
    reviewCount: 247,
    inStock: true,
    featured: true,
    details: {
      size: "60 capsules",
      weight: "0.3 lbs",
      ingredients: ["Black Cohosh", "Red Clover", "Evening Primrose Oil", "Dong Quai"],
      benefits: ["Supports hormonal balance", "May reduce hot flashes", "Promotes better sleep", "Natural ingredients"],
      usage: "Take 2 capsules daily with meals or as directed by healthcare provider.",
      coa: "Certificate of Analysis available upon request. Third-party tested for purity and potency.",
    },
  },
  // ... other mock products would be here
]

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { handle } = params

    // Check if Shopify environment variables are configured
    const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN
    const shopifyToken = process.env.SHOPIFY_STOREFRONT_API_TOKEN

    if (shopifyDomain && shopifyToken) {
      try {
        // TODO: Implement actual Shopify Storefront API call for single product
        const shopifyResponse = await fetch(`https://${shopifyDomain}/api/2024-01/graphql.json`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": shopifyToken,
          },
          body: JSON.stringify({
            query: `
              query getProduct($handle: String!) {
                product(handle: $handle) {
                  id
                  handle
                  title
                  description
                  priceRange {
                    minVariantPrice {
                      amount
                      currencyCode
                    }
                  }
                  compareAtPriceRange {
                    minVariantPrice {
                      amount
                      currencyCode
                    }
                  }
                  images(first: 10) {
                    edges {
                      node {
                        url
                        altText
                      }
                    }
                  }
                  productType
                  availableForSale
                  tags
                }
              }
            `,
            variables: {
              handle: handle,
            },
          }),
        })

        if (shopifyResponse.ok) {
          const shopifyData = await shopifyResponse.json()

          if (shopifyData.data?.product) {
            // Transform single Shopify product
            const product = transformShopifyProduct(shopifyData.data.product)

            return NextResponse.json({
              success: true,
              product: product,
              source: "shopify",
            })
          }
        }
      } catch (shopifyError) {
        console.error("Shopify API error:", shopifyError)
      }
    }

    // Fallback to mock data
    const product = mockProducts.find((p) => p.handle === handle)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      product: product,
      source: "mock",
    })
  } catch (error) {
    console.error("Product API error:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

function transformShopifyProduct(shopifyProduct: any) {
  return {
    id: shopifyProduct.id,
    handle: shopifyProduct.handle,
    title: shopifyProduct.title,
    description: shopifyProduct.description,
    price: `$${Number.parseFloat(shopifyProduct.priceRange.minVariantPrice.amount).toFixed(2)}`,
    compareAtPrice: shopifyProduct.compareAtPriceRange
      ? `$${Number.parseFloat(shopifyProduct.compareAtPriceRange.minVariantPrice.amount).toFixed(2)}`
      : undefined,
    images: shopifyProduct.images.edges.map((edge: any) => edge.node.url),
    category: shopifyProduct.productType || "Wellness",
    rating: 4.5,
    reviewCount: 0,
    inStock: shopifyProduct.availableForSale,
    featured: shopifyProduct.tags.includes("featured"),
    details: {
      benefits: [],
      usage: "",
      coa: "Certificate of Analysis available upon request.",
    },
  }
}
