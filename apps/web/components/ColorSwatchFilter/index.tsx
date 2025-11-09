'use client'

import { Check } from 'lucide-react'

import { ToggleGroup, ToggleGroupItem } from '@ecom/ui/components/ToggleGroup'
import { classMerge } from '@ecom/ui/lib/utils'

interface ColorOption {
  name: string
  hex: string
}

interface ColorSwatchFilterProps {
  value: string[]
  onChange: (value: string[]) => void
  colors: ColorOption[]
  columns?: number
  className?: string
}

export default function ColorSwatchFilter({
  value,
  onChange,
  colors,
  columns = 5,
  className,
}: ColorSwatchFilterProps) {
  return (
    <ToggleGroup
      type="multiple"
      value={value}
      onValueChange={onChange}
      className={classMerge('grid gap-4', className)}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {colors.map((color) => (
        <ToggleGroupItem
          key={color.name}
          value={color.name}
          className={classMerge(
            'relative aspect-square h-auto w-full rounded-full p-0 transition-all',
            color.hex === '#FFFFFF' && 'border border-black/20',
          )}
          style={{ backgroundColor: color.hex }}>
          {value.includes(color.name) && (
            <Check
              className={classMerge(
                'absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2',
                color.hex === '#FFFFFF' || color.hex === '#F5DD06'
                  ? 'text-black'
                  : 'text-white',
              )}
              strokeWidth={3}
            />
          )}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
