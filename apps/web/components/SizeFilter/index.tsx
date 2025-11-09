'use client'

import { ToggleGroup, ToggleGroupItem } from '@ecom/ui/components/ToggleGroup'
import { classMerge } from '@ecom/ui/lib/utils'

interface SizeFilterProps {
  value: string[]
  onChange: (value: string[]) => void
  options: string[]
  className?: string
}

export default function SizeFilter({
  value,
  onChange,
  options,
  className,
}: SizeFilterProps) {
  return (
    <ToggleGroup
      type="multiple"
      value={value}
      onValueChange={onChange}
      className={classMerge('flex flex-wrap justify-start gap-2', className)}>
      {options.map((option) => (
        <ToggleGroupItem
          key={option}
          value={option}
          className={classMerge(
            'rounded-full px-5 py-2.5 text-sm transition-all',
            'data-[state=on]:bg-black data-[state=on]:font-medium data-[state=on]:text-white',
            'data-[state=off]:bg-[#F0F0F0] data-[state=off]:text-black/60',
          )}>
          {option}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
