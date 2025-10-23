'use client'

import { ChevronRight, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  ColorSwatchFilter,
  MultiSelectFilter,
  RangeFilter,
} from '@ecom/ui'
import { classMerge } from '@ecom/ui/lib/utils'

const categories = ['T-shirts', 'Shorts', 'Shirts', 'Hoodie', 'Jeans']
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
const dressStyles = ['Casual', 'Formal', 'Party', 'Gym']

export interface FilterState {
  selectedCategories: string[]
  priceRange: [number, number]
  selectedColors: string[]
  selectedSizes: string[]
  selectedDressStyles: string[]
}

interface FilterSidebarProps {
  onFiltersChange: (filters: FilterState) => void
  className?: string
  showHeader?: boolean
}

export default function FilterSidebar({
  onFiltersChange,
  className,
  showHeader = true,
}: FilterSidebarProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedDressStyles, setSelectedDressStyles] = useState<string[]>([])

  const handleApplyFilters = () => {
    const filters: FilterState = {
      selectedCategories,
      priceRange,
      selectedColors,
      selectedSizes,
      selectedDressStyles,
    }
    onFiltersChange(filters)
  }

  return (
    <div
      className={classMerge(
        'sticky top-4 flex h-fit w-[295px] flex-col gap-6 rounded-[20px] border border-black/10 p-5 lg:p-6',
        className,
      )}>
      {/* Header */}
      {showHeader && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Filters</h2>
            <SlidersHorizontal className="h-6 w-6 text-black/40" />
          </div>
          <div className="h-px w-full bg-black/10" />
        </>
      )}

      {/* Categories - Not in accordion */}
      <div className="flex flex-col gap-5">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => {
              if (selectedCategories.includes(category)) {
                setSelectedCategories([])
              } else {
                setSelectedCategories([category])
              }
            }}
            className={classMerge(
              'flex items-center justify-between text-left transition-colors',
              selectedCategories.includes(category)
                ? 'font-medium text-black'
                : 'text-black/60 hover:text-black',
            )}>
            <span>{category}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        ))}
      </div>

      <div className="h-px w-full bg-black/10" />

      <Accordion
        type="multiple"
        defaultValue={['price', 'colors', 'size', 'style']}
        className="space-y-0">
        {/* Price */}
        <AccordionItem value="price" className="border-b-0">
          <AccordionTrigger className="text-xl font-bold hover:no-underline">
            Price
          </AccordionTrigger>
          <AccordionContent>
            <RangeFilter
              value={priceRange}
              onChange={setPriceRange}
              min={0}
              max={1000}
              step={10}
              formatLabel={(value) => `$${value}`}
            />
          </AccordionContent>
        </AccordionItem>

        <div className="h-px w-full bg-black/10" />

        {/* Colors */}
        <AccordionItem value="colors" className="border-b-0">
          <AccordionTrigger className="text-xl font-bold hover:no-underline">
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
          <AccordionTrigger className="text-xl font-bold hover:no-underline">
            Size
          </AccordionTrigger>
          <AccordionContent>
            <MultiSelectFilter
              value={selectedSizes}
              onChange={setSelectedSizes}
              options={sizes}
              variant="chips"
            />
          </AccordionContent>
        </AccordionItem>

        <div className="h-px w-full bg-black/10" />

        {/* Dress Style */}
        <AccordionItem value="style" className="border-b-0">
          <AccordionTrigger className="text-xl font-bold hover:no-underline">
            Dress Style
          </AccordionTrigger>
          <AccordionContent>
            <MultiSelectFilter
              value={selectedDressStyles}
              onChange={setSelectedDressStyles}
              options={dressStyles}
              variant="list"
              multiSelect={false}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="h-px w-full bg-black/10" />

      {/* Apply Filter Button */}
      <button
        onClick={handleApplyFilters}
        className="w-full rounded-full bg-black py-4 text-sm font-medium text-white transition-colors hover:bg-black/90">
        Apply Filter
      </button>
    </div>
  )
}
