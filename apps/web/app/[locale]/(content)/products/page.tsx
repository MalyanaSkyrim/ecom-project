'use client'

import FilterSidebar, { type FilterState } from '@/components/FilterSidebar'
import ProductCard from '@/components/ProductCard'
import { trpc } from '@/lib/trpc/client'
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  SlidersHorizontal,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { classMerge } from '@ecom/ui/lib/utils'

export default function ProductsPage() {
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    selectedCategories: [],
    priceRange: [0, 1000],
    selectedColors: [],
    selectedSizes: [],
    selectedDressStyles: [],
  })
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [sortBy, setSortBy] = useState('Most Popular')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Fetch all products
  const { data: allProducts, isLoading } =
    trpc.products.getAllProducts.useQuery()

  // Apply filters and sorting
  useEffect(() => {
    if (!allProducts) return

    let filtered = [...allProducts]

    // Apply category filter
    if (filters.selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        filters.selectedCategories.some((category) =>
          product.name.toLowerCase().includes(category.toLowerCase()),
        ),
      )
    }

    // Apply price filter
    filtered = filtered.filter(
      (product) =>
        product.price >= filters.priceRange[0] * 100 && // Convert to cents
        product.price <= filters.priceRange[1] * 100,
    )

    // Apply color filter (for now, just check if product name contains color)
    if (filters.selectedColors.length > 0) {
      filtered = filtered.filter((product) =>
        filters.selectedColors.some((color) =>
          product.name.toLowerCase().includes(color.toLowerCase()),
        ),
      )
    }

    // Apply size filter (for now, just check if product name contains size)
    if (filters.selectedSizes.length > 0) {
      filtered = filtered.filter((product) =>
        filters.selectedSizes.some((size) =>
          product.name.toLowerCase().includes(size.toLowerCase()),
        ),
      )
    }

    // Apply dress style filter
    if (filters.selectedDressStyles.length > 0) {
      filtered = filtered.filter((product) =>
        filters.selectedDressStyles.some((style) =>
          product.name.toLowerCase().includes(style.toLowerCase()),
        ),
      )
    }

    // Apply sorting
    switch (sortBy) {
      case 'Price Low-High':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'Price High-Low':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'Rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'Newest':
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        break
      default: // Most Popular
        filtered.sort((a, b) => (b.totalSales || 0) - (a.totalSales || 0))
    }

    setFilteredProducts(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [allProducts, filters, sortBy])

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    setShowMobileFilters(false) // Close mobile filter modal
  }

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  const sortOptions = [
    'Most Popular',
    'Price Low-High',
    'Price High-Low',
    'Rating',
    'Newest',
  ]

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-32 w-32 animate-spin rounded-full border-b-2 border-black"></div>
          <p className="mt-4 text-lg">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-black/10">
        <div className="px-5 py-6 md:px-8 lg:px-10 xl:px-20">
          <div className="flex items-center gap-3 text-sm text-black/60 sm:text-base">
            <Link href="/" className="transition-colors hover:text-black">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-black">Products</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="py-6">
        <div className="px-5 md:px-8 lg:px-10 xl:px-20">
          <div className="flex flex-col gap-5 lg:flex-row">
            {/* Filters sidebar - hidden on mobile */}
            <aside className="hidden flex-shrink-0 lg:block">
              <FilterSidebar onFiltersChange={handleFiltersChange} />
            </aside>

            {/* Products */}
            <div className="flex-1">
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold sm:text-[32px]">
                    Products
                  </h1>
                  {/* Mobile filter button */}
                  <button
                    onClick={() => setShowMobileFilters(true)}
                    className="rounded-lg border border-black/10 p-2 transition-colors hover:bg-black/5 lg:hidden">
                    <SlidersHorizontal className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="hidden text-sm text-black/60 sm:block">
                    Showing {startIndex + 1}-
                    {Math.min(endIndex, filteredProducts.length)} of{' '}
                    {filteredProducts.length} Products
                  </span>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none rounded-lg border border-black/10 bg-transparent py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-black/10">
                      {sortOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              {/* Product grid */}
              <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {currentProducts.length === 0 ? (
                  <div className="col-span-full py-12 text-center">
                    <p className="text-lg text-gray-500">
                      No products found matching your filters.
                    </p>
                  </div>
                ) : (
                  currentProducts.map((product, index) => (
                    <ProductCard
                      key={product.id || index}
                      name={product.name}
                      rating={product.rating || 0}
                      price={product.price}
                      imageUrl={
                        '/img/placeholder-product.jpg' // Using placeholder since imageUrl is not in the API response
                      }
                      className="w-full"
                    />
                  ))
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="border-t border-black/10 pt-6">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                      className={classMerge(
                        'flex items-center gap-2 rounded-lg border border-black/10 px-3.5 py-2 transition-colors',
                        currentPage === 1
                          ? 'cursor-not-allowed opacity-50'
                          : 'hover:bg-black/5',
                      )}>
                      <ArrowLeft className="h-5 w-5" />
                      <span className="text-sm font-medium">Previous</span>
                    </button>

                    <div className="flex items-center gap-0.5">
                      {Array.from(
                        { length: Math.min(7, totalPages) },
                        (_, i) => {
                          let pageNum
                          if (totalPages <= 7) {
                            pageNum = i + 1
                          } else if (currentPage <= 4) {
                            pageNum = i + 1
                          } else if (currentPage >= totalPages - 3) {
                            pageNum = totalPages - 6 + i
                          } else {
                            pageNum = currentPage - 3 + i
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={classMerge(
                                'flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors',
                                currentPage === pageNum
                                  ? 'bg-black/6 text-black'
                                  : 'text-black/50 hover:bg-black/5',
                              )}>
                              {pageNum}
                            </button>
                          )
                        },
                      )}
                    </div>

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages}
                      className={classMerge(
                        'flex items-center gap-2 rounded-lg border border-black/10 px-3.5 py-2 transition-colors',
                        currentPage === totalPages
                          ? 'cursor-not-allowed opacity-50'
                          : 'hover:bg-black/5',
                      )}>
                      <span className="text-sm font-medium">Next</span>
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 bg-black/50 lg:hidden">
          <div className="absolute right-0 top-0 h-full w-full max-w-[320px] transform bg-white shadow-xl transition-transform duration-300 ease-in-out">
            <div className="flex items-center justify-between border-b border-black/10 p-4">
              <h2 className="text-lg font-bold">Filters</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="rounded-lg p-2 transition-colors hover:bg-black/5">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="h-full overflow-y-auto">
              <FilterSidebar
                onFiltersChange={handleFiltersChange}
                className="w-full rounded-none border-none p-4"
                showHeader={false}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
