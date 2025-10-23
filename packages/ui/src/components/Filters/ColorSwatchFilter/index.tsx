'use client'

import { Check } from 'lucide-react'

import { classMerge } from '../../../lib/utils'

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
  const toggleColor = (colorName: string) => {
    if (value.includes(colorName)) {
      onChange(value.filter((color) => color !== colorName))
    } else {
      onChange([...value, colorName])
    }
  }

  return (
    <div
      className={classMerge('grid gap-4', className)}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {colors.map((color) => (
        <button
          key={color.name}
          onClick={() => toggleColor(color.name)}
          className={classMerge(
            'relative h-[37px] w-[37px] rounded-full transition-all',
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
        </button>
      ))}
    </div>
  )
}
