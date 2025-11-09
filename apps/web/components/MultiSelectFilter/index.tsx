'use client'

import { ChevronRight } from 'lucide-react'

import { ToggleGroup, ToggleGroupItem } from '@ecom/ui/components/ToggleGroup'
import { classMerge } from '@ecom/ui/lib/utils'

interface MultiSelectFilterProps {
  value: string[]
  onChange: (value: string[]) => void
  options: string[]
  multiSelect?: boolean
  className?: string
}

export default function MultiSelectFilter({
  value,
  onChange,
  options,
  multiSelect = true,
  className,
}: MultiSelectFilterProps) {
  const handleValueChange = (newValue: string | string[]) => {
    if (multiSelect) {
      onChange(Array.isArray(newValue) ? newValue : [])
    } else {
      // Single select - convert to array format for backward compatibility
      const singleValue = Array.isArray(newValue)
        ? newValue[0] || ''
        : newValue || ''
      onChange(singleValue ? [singleValue] : [])
    }
  }

  if (multiSelect) {
    return (
      <ToggleGroup
        type="multiple"
        value={value}
        onValueChange={handleValueChange}
        className={classMerge('flex flex-col gap-5', className)}>
        {options.map((option) => (
          <ToggleGroupItem
            key={option}
            value={option}
            className={classMerge(
              'flex items-center justify-between text-left transition-colors',
              value.includes(option)
                ? 'font-medium text-black'
                : 'text-black/60 hover:text-black',
            )}>
            <span>{option}</span>
            <ChevronRight className="h-4 w-4" />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    )
  } else {
    return (
      <ToggleGroup
        type="single"
        value={value[0] || ''}
        onValueChange={handleValueChange}
        className={classMerge('flex flex-col gap-5', className)}>
        {options.map((option) => (
          <ToggleGroupItem
            key={option}
            value={option}
            className={classMerge(
              'flex items-center justify-between text-left transition-colors',
              value.includes(option)
                ? 'font-medium text-black'
                : 'text-black/60 hover:text-black',
            )}>
            <span>{option}</span>
            <ChevronRight className="h-4 w-4" />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    )
  }
}
