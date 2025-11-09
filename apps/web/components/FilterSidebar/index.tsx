'use client'

import {
  ALL_CATEGORIES_OPTION_ID,
  type CategorySelectOption,
} from '@/lib/categories'
import { useEffect, useMemo, useState } from 'react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Select,
  Slider,
} from '@ecom/ui'
import { classMerge } from '@ecom/ui/lib/utils'

import ColorSwatchFilter from '../ColorSwatchFilter'
import SizeFilter from '../SizeFilter'

const colors = [
  { name: 'Green', hex: '#00C12B' },
  { name: 'Red', hex: '#F50606' },
  { name: 'Yellow', hex: '#F5DD06' },
  { name: 'Orange', hex: '#F57906' },
  { name: 'Cyan', hex: '#06CAF5' },
  { name: 'Blue', hex: '#063AF5' },
  { name: 'Purple', hex: '#7D06F5' },
  { name: 'Pink', hex: '#F506A4' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#000000' },
]
const sizes = [
  'XX-Small',
  'X-Small',
  'Small',
  'Medium',
  'Large',
  'X-Large',
  'XX-Large',
  '3X-Large',
  '4X-Large',
]

const arraysAreEqual = (a: string[], b: string[]) =>
  a.length === b.length && a.every((value, index) => value === b[index])

export interface FilterState {
  selectedCategories: string[]
  priceRange: [number, number]
  selectedColors: string[]
  selectedSizes: string[]
}

interface FilterSidebarProps {
  filters: FilterState
  categoryOptions: CategorySelectOption[]
  onFiltersChange: (filters: FilterState) => void
  className?: string
  showHeader?: boolean
}

export default function FilterSidebar({
  filters,
  categoryOptions,
  onFiltersChange,
  className,
}: FilterSidebarProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | undefined
  >(filters.selectedCategories[0])
  const [priceRange, setPriceRange] = useState<[number, number]>(
    filters.priceRange,
  )
  const [selectedColors, setSelectedColors] = useState<string[]>(
    filters.selectedColors,
  )
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    filters.selectedSizes,
  )

  useEffect(() => {
    const incomingCategoryId = filters.selectedCategories[0]
    setSelectedCategoryId((prev) =>
      prev === incomingCategoryId ? prev : incomingCategoryId,
    )
    const [incomingMin, incomingMax] = filters.priceRange
    setPriceRange((prev) =>
      prev[0] === incomingMin && prev[1] === incomingMax
        ? prev
        : [incomingMin, incomingMax],
    )
    setSelectedColors((prev) =>
      arraysAreEqual(prev, filters.selectedColors)
        ? prev
        : filters.selectedColors,
    )
    setSelectedSizes((prev) =>
      arraysAreEqual(prev, filters.selectedSizes)
        ? prev
        : filters.selectedSizes,
    )
  }, [filters])

  const selectOptions = useMemo(() => {
    const allCategoriesOption: CategorySelectOption = {
      id: ALL_CATEGORIES_OPTION_ID,
      label: 'All categories',
      depth: 0,
    }

    return [allCategoriesOption, ...categoryOptions]
  }, [categoryOptions])

  const handleApplyFilters = () => {
    const filters: FilterState = {
      selectedCategories: selectedCategoryId ? [selectedCategoryId] : [],
      priceRange,
      selectedColors,
      selectedSizes,
    }
    onFiltersChange(filters)
  }

  return (
    <div
      className={classMerge(
        'sticky top-4 flex h-fit w-[295px] flex-col rounded-[20px] border border-black/10 p-5 lg:p-6',
        className,
      )}>
      <div className="mb-4">
        <label className="mb-2 block text-lg font-bold">Categories</label>
        <Select
          key={`${selectedCategoryId ?? ALL_CATEGORIES_OPTION_ID}-${
            categoryOptions.length
          }`}
          options={selectOptions}
          default={selectedCategoryId ?? ALL_CATEGORIES_OPTION_ID}
          onSelect={(option) => {
            if (option.id === ALL_CATEGORIES_OPTION_ID) {
              setSelectedCategoryId(undefined)
              return
            }

            setSelectedCategoryId(option.id)
          }}
          triggerClassName="border-black/10 w-full justify-between rounded-lg border bg-transparent px-3 py-2 text-sm"
          contentClassName="w-[var(--radix-select-trigger-width)]"
          renderOption={(option) => {
            const depth =
              'depth' in option ? (option as CategorySelectOption).depth : 0

            return (
              <span
                className={classMerge(
                  'flex items-center text-sm',
                  depth > 0 && 'text-black/80',
                )}
                style={{ marginLeft: depth * 12 }}>
                {option.label}
              </span>
            )
          }}
        />
      </div>

      <div className="h-px w-full bg-black/10" />

      <Accordion
        type="multiple"
        defaultValue={['price', 'colors', 'size', 'style']}
        className="space-y-0">
        {/* Price */}
        <AccordionItem value="price" className="border-b-0">
          <AccordionTrigger className="text-lg font-bold hover:no-underline">
            Price
          </AccordionTrigger>
          <AccordionContent>
            <Slider
              variant="range"
              value={priceRange}
              onValueChange={setPriceRange}
              min={0}
              max={1000}
              step={10}
              formatLabel={(val) => `$${val}`}
            />
          </AccordionContent>
        </AccordionItem>

        <div className="h-px w-full bg-black/10" />

        {/* Colors */}
        <AccordionItem value="colors" className="border-b-0">
          <AccordionTrigger className="text-lg font-bold hover:no-underline">
            Colors
          </AccordionTrigger>
          <AccordionContent>
            <ColorSwatchFilter
              value={selectedColors}
              onChange={setSelectedColors}
              colors={colors}
              columns={5}
            />
          </AccordionContent>
        </AccordionItem>

        <div className="h-px w-full bg-black/10" />

        {/* Size */}
        <AccordionItem value="size" className="border-b-0">
          <AccordionTrigger className="text-lg font-bold hover:no-underline">
            Size
          </AccordionTrigger>
          <AccordionContent>
            <SizeFilter
              value={selectedSizes}
              onChange={setSelectedSizes}
              options={sizes}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Apply Filter Button */}
      <button
        onClick={handleApplyFilters}
        className="w-full rounded-full bg-black py-4 text-sm font-medium text-white transition-colors hover:bg-black/90">
        Apply Filter
      </button>
    </div>
  )
}
