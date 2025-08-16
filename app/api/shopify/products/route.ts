import { NextResponse } from "next/server"

interface ShopifyProduct {
  id: string
  handle: string
  title: string
  description: string
  priceRange: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
  }
  compareAtPriceRange?: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
  }
  images: {
    edges: Array<{
      node: {
        url: string
        altText: string
      }
    }>
  }
  productType: string
  availableForSale: boolean
  tags: string[]
}

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
  {
    id: "gid://shopify/Product/2",
    handle: "cooling-pillow-insert",
    title: "Cooling Pillow Insert",
    description:
      "Gel-infused memory foam pillow insert designed to regulate temperature and provide comfort during night sweats.",
    price: "$49.99",
    compareAtPrice: "$69.99",
    images: ["/cooling-pillow.png"],
    category: "Sleep",
    rating: 4.7,
    reviewCount: 189,
    inStock: true,
    featured: true,
    details: {
      size: 'Standard (20" x 26")',
      weight: "3.2 lbs",
      benefits: ["Temperature regulation", "Pressure point relief", "Hypoallergenic", "Machine washable cover"],
      usage: "Place inside existing pillowcase. Allow 24-48 hours for full expansion.",
      coa: "CertiPUR-US certified foam. Free from harmful chemicals and heavy metals.",
    },
  },
  {
    id: "gid://shopify/Product/3",
    handle: "hormone-balance-tea",
    title: "Hormone Balance Herbal Tea",
    description:
      "Organic herbal tea blend with raspberry leaf, nettle, and spearmint to support women's hormonal wellness.",
    price: "$22.99",
    images: ["/herbal-tea-box.png"],
    category: "Wellness Tea",
    rating: 4.6,
    reviewCount: 156,
    inStock: true,
    featured: false,
    details: {
      size: "20 tea bags",
      weight: "0.4 lbs",
      ingredients: ["Raspberry Leaf", "Nettle", "Spearmint", "Rose Hips"],
      benefits: ["Supports hormonal balance", "Rich in vitamins", "Caffeine-free", "Organic ingredients"],
      usage: "Steep 1 tea bag in hot water for 5-7 minutes. Enjoy 1-2 cups daily.",
      coa: "USDA Organic certified. Lab tested for pesticides and heavy metals.",
    },
  },
  {
    id: "gid://shopify/Product/4",
    handle: "mood-support-essential-oil",
    title: "Mood Support Essential Oil Blend",
    description:
      "Uplifting essential oil blend with bergamot, ylang-ylang, and clary sage to support emotional balance.",
    price: "$28.99",
    compareAtPrice: "$35.99",
    images: ["/placeholder-4ynm3.png"],
    category: "Aromatherapy",
    rating: 4.9,
    reviewCount: 203,
    inStock: true,
    featured: false,
    details: {
      size: "15ml bottle",
      weight: "0.2 lbs",
      ingredients: ["Bergamot", "Ylang-Ylang", "Clary Sage", "Sweet Orange"],
      benefits: ["Promotes emotional balance", "Uplifting aroma", "100% pure oils", "Therapeutic grade"],
      usage: "Add 3-5 drops to diffuser or dilute with carrier oil for topical use.",
      coa: "GC/MS tested for purity. No synthetic additives or fillers.",
    },
  },
  {
    id: "gid://shopify/Product/5",
    handle: "bone-health-calcium-magnesium",
    title: "Bone Health Calcium + Magnesium",
    description: "Comprehensive bone support formula with calcium, magnesium, vitamin D3, and K2 for menopausal women.",
    price: "$39.99",
    images: ["/calcium-supplement.png"],
    category: "Supplements",
    rating: 4.8,
    reviewCount: 312,
    inStock: true,
    featured: false,
    details: {
      size: "120 tablets",
      weight: "0.5 lbs",
      ingredients: ["Calcium Carbonate", "Magnesium Oxide", "Vitamin D3", "Vitamin K2"],
      benefits: ["Supports bone density", "Enhanced absorption", "Heart health support", "Easy to swallow"],
      usage: "Take 2 tablets daily with meals or as directed by healthcare provider.",
      coa: "Third-party tested for potency and purity. NSF certified facility.",
    },
  },
  {
    id: "gid://shopify/Product/6",
    handle: "menopause-care-kit",
    title: "Complete Menopause Care Kit",
    description:
      "Curated collection including supplement, cooling towel, herbal tea, and essential oil blend for comprehensive menopause support.",
    price: "$89.99",
    compareAtPrice: "$120.00",
    images: ["/placeholder-f07h4.png"],
    category: "Gift Sets",
    rating: 4.9,
    reviewCount: 78,
    inStock: false,
    featured: true,
    details: {
      size: 'Gift box 12" x 10" x 4"',
      weight: "2.8 lbs",
      benefits: [
        "Complete menopause support",
        "Premium quality products",
        "Beautiful gift packaging",
        "Comprehensive care approach",
      ],
      usage: "Follow individual product instructions. Perfect for daily menopause wellness routine.",
      coa: "All products individually tested and certified. Complete documentation included.",
    },
  },
]

export async function GET() {
  try {
    const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN
    const shopifyToken = process.env.SHOPIFY_STOREFRONT_API_TOKEN

    if (shopifyDomain && shopifyToken) {
      try {
        const shopifyResponse = await fetch(`https://${shopifyDomain}/api/2024-01/graphql.json`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": shopifyToken,
          },
          body: JSON.stringify({
            query: `
              query getProducts($first: Int!) {
                products(first: $first) {
                  edges {
                    node {
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
                      images(first: 5) {
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
                }
              }
            `,
            variables: {
              first: 20,
            },
          }),
        })

        if (shopifyResponse.ok) {
          const shopifyData = await shopifyResponse.json()

          if (shopifyData.data?.products?.edges) {
            const products = transformShopifyProducts(shopifyData.data.products.edges)

            return NextResponse.json({
              success: true,
              products: products,
              source: "shopify",
            })
          }
        }

        // If Shopify call fails, fall back to mock data
        console.log("Shopify API call failed, using mock data")
      } catch (shopifyError) {
        console.error("Shopify API error:", shopifyError)
      }
    }

    return NextResponse.json({
      success: true,
      products: mockProducts,
      source: "mock",
      message: shopifyDomain
        ? "Shopify configured but using mock data for demo"
        : "Configure SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_API_TOKEN for live data",
    })
  } catch (error) {
    console.error("Products API error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch products",
        products: mockProducts,
        source: "mock",
      },
      { status: 200 },
    )
  }
}

function transformShopifyProducts(shopifyProducts: Array<{ node: ShopifyProduct }>): typeof mockProducts {
  return shopifyProducts.map(({ node: product }) => ({
    id: product.id,
    handle: product.handle,
    title: product.title,
    description: product.description,
    price: `$${Number.parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}`,
    compareAtPrice: product.compareAtPriceRange
      ? `$${Number.parseFloat(product.compareAtPriceRange.minVariantPrice.amount).toFixed(2)}`
      : undefined,
    images: product.images.edges.map((edge) => edge.node.url),
    category: product.productType || "Wellness",
    rating: 4.5,
    reviewCount: 0,
    inStock: product.availableForSale,
    featured: product.tags.includes("featured"),
    details: {
      benefits: [],
      usage: "",
      coa: "Certificate of Analysis available upon request.",
    },
  }))
}
