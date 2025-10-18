'use client'

import FeaturedProducts from '@/components/Home/FeaturedProducts'
import ProductCardSkeleton from '@/components/ProductCard/ProductCardSkeleton'
import { trpc } from '@/lib/trpc/client'

import type { ProductResponse } from '@ecom/common'
import { useWindowSize } from '@ecom/ui/hooks'

// Placeholder images to use since API doesn't provide images yet
const placeholderImages = [
  'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center',
]

const TopSelling = () => {
  const { data: apiProducts, isLoading } = trpc.products.topSelling.useQuery()

  const { width } = useWindowSize()
  const isMobile = width < 640
  const isTablet = width >= 640 && width < 1024
  const isDesktop = width >= 1024

  // Determine how many skeleton cards to show based on screen size
  const skeletonCount = isMobile ? 2 : isTablet ? 3 : 4

  // Transform API response to match component expectations
  const products =
    apiProducts?.map((product: ProductResponse, index: number) => ({
      id: index + 1, // Use index-based ID since component expects number but API returns string UUID
      name: product.name,
      rating: product.rating || 0, // Default to 0 if rating is null
      price: product.price, // API now returns price in cents
      imageUrl: placeholderImages[index % placeholderImages.length]!, // Use placeholder images
    })) || []

  if (isLoading) {
    return (
      <div className="section_container xs:space-y-14 space-y-10">
        <h1 className="section_title">Top Selling</h1>
        <div className="xs:space-y-10 space-y-6">
          {!isDesktop ? (
            <div className="xs:w-[calc(100vw-40px)] mx-auto w-[calc(100vw-32px)] overflow-hidden md:w-auto">
              <div className="xs:w-[90vw] mx-auto flex w-[120vw] items-center justify-center space-y-5 md:w-[calc(100vw-80px)]">
                <div className="w-[90%]">
                  <div className="flex justify-center">
                    {Array.from({ length: skeletonCount }).map((_, index) => {
                      return (
                        <div
                          key={index}
                          className="flex flex-1 justify-center"
                          style={{
                            marginRight:
                              index === skeletonCount - 1 ? '0px' : '30px',
                          }}>
                          <ProductCardSkeleton className="w-full max-w-none" />
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mx-auto grid w-full grid-cols-2 gap-x-5 gap-y-7 lg:grid-cols-4">
              {Array.from({ length: skeletonCount }).map((_, index) => (
                <ProductCardSkeleton key={index} className="w-auto" />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <FeaturedProducts
      title="Top Selling"
      products={products}
      viewAllPath="/products/top-selling"
    />
  )
}

export default TopSelling
