'use client'

import FilterSidebar, { type FilterState } from '@/components/FilterSidebar'
import ProductCard from '@/components/ProductCard'
import {
  ALL_CATEGORIES_OPTION_ID,
  buildCategoryLookup,
  buildCategoryOptions,
  resolveCategoryPath,
  type CategorySelectOption,
} from '@/lib/categories'
import { trpc } from '@/lib/trpc/client'
import { ArrowLeft, ArrowRight, SlidersHorizontal, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from 'nuqs'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { Breadcrumb, Select, type SelectOption } from '@ecom/ui'
import { classMerge } from '@ecom/ui/lib/utils'

const DEFAULT_PRICE_RANGE: [number, number] = [0, 1000]
const DEFAULT_SORT_ID = 'Most Popular'
const SORT_OPTION_IDS = [
  'Most Popular',
  'Price Low-High',
  'Price High-Low',
  'Rating',
  'Newest',
] as const

const sortOptions: SelectOption[] = SORT_OPTION_IDS.map((id) => ({
  id,
  label: id,
}))

const isSortOptionId = (
  value: string,
): value is (typeof SORT_OPTION_IDS)[number] =>
  SORT_OPTION_IDS.includes(value as (typeof SORT_OPTION_IDS)[number])

const arraysAreEqual = (a: string[] = [], b: string[] = []) =>
  a.length === b.length && a.every((value, index) => value === b[index])

const createStringArrayParser = () => {
  const parser = parseAsArrayOf(parseAsString)
  parser.eq = arraysAreEqual
  return parser.withDefault([])
}

export default function ProductsPageBySlug() {
  const params = useParams()
  const t = useTranslations()
  const localeParam =
    typeof params?.locale === 'string' ? params.locale : undefined

  const [query, setQuery] = useQueryStates(
    {
      categoryId: parseAsString,
      priceMin: parseAsInteger.withDefault(DEFAULT_PRICE_RANGE[0]),
      priceMax: parseAsInteger.withDefault(DEFAULT_PRICE_RANGE[1]),
      colors: createStringArrayParser(),
      sizes: createStringArrayParser(),
      sort: parseAsStringLiteral(SORT_OPTION_IDS).withDefault(DEFAULT_SORT_ID),
      page: parseAsInteger.withDefault(1),
    },
    {
      history: 'replace',
      shallow: true,
      scroll: false,
    },
  )

  const updateQuery = useCallback(
    (values: Parameters<typeof setQuery>[0]) =>
      setQuery(values, { history: 'replace', shallow: true, scroll: false }),
    [setQuery],
  )

  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const priceRange = useMemo<[number, number]>(() => {
    const clamp = (value: number) =>
      Math.min(Math.max(value, DEFAULT_PRICE_RANGE[0]), DEFAULT_PRICE_RANGE[1])

    const minValue = clamp(query.priceMin)
    const maxCandidate = clamp(query.priceMax)
    const maxValue = Math.max(minValue, maxCandidate)

    return [minValue, maxValue]
  }, [query.priceMin, query.priceMax])

  const { data: categoryData, isLoading: isLoadingCategories } =
    trpc.categories.getCategories.useQuery({
      isActive: true,
    })

  const categories = useMemo(() => categoryData ?? [], [categoryData])

  const categoryLookup = useMemo(
    () => buildCategoryLookup(categories),
    [categories],
  )

  const rawCategoryId = query.categoryId ?? null
  const selectedCategory = rawCategoryId
    ? (categoryLookup.get(rawCategoryId)?.node ?? null)
    : null
  const categoryId = selectedCategory?.id ?? null

  useEffect(() => {
    if (rawCategoryId && !selectedCategory) {
      updateQuery({
        categoryId: null,
        page: null,
      })
    }
  }, [rawCategoryId, selectedCategory, updateQuery])

  const filtersFromQuery = useMemo<FilterState>(
    () => ({
      selectedCategories: categoryId ? [categoryId] : [],
      priceRange,
      selectedColors: query.colors,
      selectedSizes: query.sizes,
    }),
    [categoryId, priceRange, query.colors, query.sizes],
  )

  const breadcrumbPath = useMemo(
    () => resolveCategoryPath(categoryId, categoryLookup),
    [categoryId, categoryLookup],
  )

  const sortBy = query.sort

  const currentPage = query.page
  const itemsPerPage = 12

  const categoryOptions = useMemo(
    () => buildCategoryOptions(categories),
    [categories],
  )
  const navigationCategoryOptions = useMemo(() => {
    const allCategoriesOption: CategorySelectOption = {
      id: ALL_CATEGORIES_OPTION_ID,
      label: 'All categories',
      depth: 0,
    }

    return [allCategoriesOption, ...categoryOptions]
  }, [categoryOptions])

  const {
    data: productsResult,
    isLoading: productsLoading,
    isFetching: productsFetching,
  } = trpc.products.getAllProducts.useQuery({
    page: currentPage,
    pageSize: itemsPerPage,
    categoryId: categoryId ?? undefined,
    priceMin: priceRange[0],
    priceMax: priceRange[1],
    colors: query.colors.length > 0 ? query.colors : undefined,
    sizes: query.sizes.length > 0 ? query.sizes : undefined,
    sort: sortBy,
  })

  const products = productsResult?.data ?? []
  const pagination = productsResult?.pagination

  const totalProducts =
    pagination?.totalCount ?? (productsResult ? products.length : 0)
  const totalPages =
    pagination && pagination.totalPages > 0
      ? pagination.totalPages
      : Math.max(1, Math.ceil(Math.max(totalProducts, 1) / itemsPerPage))
  const safeCurrentPage = pagination
    ? pagination.pageIndex + 1
    : Math.max(1, Math.min(currentPage, totalPages))
  const startIndex =
    totalProducts === 0
      ? 0
      : pagination
        ? pagination.pageIndex * pagination.pageSize + 1
        : (safeCurrentPage - 1) * itemsPerPage + 1
  const endIndex =
    totalProducts === 0
      ? 0
      : Math.min(totalProducts, startIndex + products.length - 1)

  const isInitialLoading =
    (productsLoading && !productsResult) ||
    (isLoadingCategories && !categoryData)
  const isEmpty = !productsFetching && totalProducts === 0

  const handleFiltersChange = useCallback(
    (newFilters: FilterState) => {
      updateQuery({
        categoryId: newFilters.selectedCategories[0] ?? null,
        priceMin: Math.round(newFilters.priceRange[0]),
        priceMax: Math.round(newFilters.priceRange[1]),
        colors: newFilters.selectedColors,
        sizes: newFilters.selectedSizes,
        page: null,
      })
      setShowMobileFilters(false)
    },
    [updateQuery, setShowMobileFilters],
  )

  const handleCategorySelect = useCallback(
    (option: SelectOption) => {
      updateQuery({
        categoryId: option.id === ALL_CATEGORIES_OPTION_ID ? null : option.id,
        page: null,
      })
    },
    [updateQuery],
  )

  const handleSortSelect = useCallback(
    (option: SelectOption) => {
      const nextSort = isSortOptionId(option.id) ? option.id : DEFAULT_SORT_ID
      updateQuery({
        sort: nextSort === DEFAULT_SORT_ID ? null : nextSort,
        page: null,
      })
    },
    [updateQuery],
  )

  const goToPage = useCallback(
    (page: number) => {
      const nextPage = Math.max(1, Math.min(page, totalPages))
      updateQuery({
        page: nextPage === 1 ? null : nextPage,
      })
    },
    [totalPages, updateQuery],
  )

  // Build breadcrumb items from resolved category path
  const breadcrumbItems = useMemo(() => {
    const homePath = localeParam ? `/${localeParam}` : '/'
    const productsPath = localeParam ? `/${localeParam}/products` : '/products'

    const items = [
      { label: t('common.home'), path: homePath },
      { label: t('common.products'), path: productsPath },
    ]

    // Add each level of the category hierarchy
    breadcrumbPath.forEach((cat) => {
      const search = new URLSearchParams()
      search.set('categoryId', cat.id)
      items.push({
        label: cat.name,
        path: `${productsPath}?${search.toString()}`,
      })
    })

    return items
  }, [breadcrumbPath, localeParam, t])

  if (isInitialLoading) {
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
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Main content */}
      <main className="py-6">
        <div className="px-5 md:px-8 lg:px-10 xl:px-20">
          <div className="flex flex-col gap-5 lg:flex-row">
            {/* Filters sidebar - hidden on mobile */}
            <aside className="hidden flex-shrink-0 lg:block lg:w-[295px]">
              <div className="sticky top-4 space-y-6">
                <FilterSidebar
                  filters={filtersFromQuery}
                  categoryOptions={categoryOptions}
                  onFiltersChange={handleFiltersChange}
                />
              </div>
            </aside>

            {/* Products */}
            <div className="flex-1">
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold sm:text-[32px]">
                    {selectedCategory ? selectedCategory.name : 'All Products'}
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
                    Showing {startIndex === 0 ? 0 : startIndex}-{endIndex} of{' '}
                    {totalProducts} Products
                  </span>
                  <div className="w-48">
                    <Select
                      key={sortBy}
                      options={sortOptions}
                      default={sortBy}
                      onSelect={handleSortSelect}
                    />
                  </div>
                </div>
              </div>

              {/* Product grid */}
              <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {isEmpty ? (
                  <div className="col-span-full py-12 text-center">
                    <p className="text-lg text-gray-500">
                      No products found matching your filters.
                    </p>
                  </div>
                ) : (
                  products.map((product, index) => (
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
                      onClick={() => goToPage(safeCurrentPage - 1)}
                      disabled={safeCurrentPage === 1}
                      className={classMerge(
                        'flex items-center gap-2 rounded-lg border border-black/10 px-3.5 py-2 transition-colors',
                        safeCurrentPage === 1
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
                          } else if (safeCurrentPage <= 4) {
                            pageNum = i + 1
                          } else if (safeCurrentPage >= totalPages - 3) {
                            pageNum = totalPages - 6 + i
                          } else {
                            pageNum = safeCurrentPage - 3 + i
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => goToPage(pageNum)}
                              className={classMerge(
                                'flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors',
                                safeCurrentPage === pageNum
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
                      onClick={() => goToPage(safeCurrentPage + 1)}
                      disabled={safeCurrentPage === totalPages}
                      className={classMerge(
                        'flex items-center gap-2 rounded-lg border border-black/10 px-3.5 py-2 transition-colors',
                        safeCurrentPage === totalPages
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
              <div className="space-y-6 p-4">
                {/* Other Filters */}
                <FilterSidebar
                  filters={filtersFromQuery}
                  categoryOptions={categoryOptions}
                  onFiltersChange={handleFiltersChange}
                  className="w-full rounded-none border-none p-0"
                  showHeader={false}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
