'use client'

import { classMerge } from '../../../lib/utils'
import { RangeSlider } from '../../RangeSlider'

interface RangeFilterProps {
  value: [number, number]
  onChange: (value: [number, number]) => void
  min: number
  max: number
  step?: number
  formatLabel?: (value: number) => string
  className?: string
}

export default function RangeFilter({
  value,
  onChange,
  min,
  max,
  step = 1,
  formatLabel = (val) => `$${val}`,
  className,
}: RangeFilterProps) {
  return (
    <div className={classMerge('relative pt-5', className)}>
      <div className="mb-1 flex justify-between text-sm font-medium">
        <span>{formatLabel(value[0])}</span>
        <span>{formatLabel(value[1])}</span>
      </div>
      <RangeSlider
        value={value}
        onValueChange={onChange}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
    </div>
  )
}
