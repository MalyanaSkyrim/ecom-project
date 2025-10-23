'use client'

import * as SliderPrimitive from '@radix-ui/react-slider'
import * as React from 'react'

import { classMerge } from '../../lib/utils'

interface RangeSliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  value?: [number, number]
  onValueChange?: (value: [number, number]) => void
  min?: number
  max?: number
  step?: number
}

const RangeSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  RangeSliderProps
>(
  (
    { className, value, onValueChange, min = 0, max = 100, step = 1, ...props },
    ref,
  ) => (
    <SliderPrimitive.Root
      ref={ref}
      value={value}
      onValueChange={onValueChange}
      min={min}
      max={max}
      step={step}
      className={classMerge(
        'relative flex w-full touch-none select-none items-center',
        className,
      )}
      {...props}>
      <SliderPrimitive.Track className="bg-primary/20 relative h-1.5 w-full grow overflow-hidden rounded-full">
        <SliderPrimitive.Range className="bg-primary absolute h-full" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="border-primary/50 bg-background focus-visible:ring-ring block h-4 w-4 rounded-full border shadow transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50" />
      <SliderPrimitive.Thumb className="border-primary/50 bg-background focus-visible:ring-ring block h-4 w-4 rounded-full border shadow transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50" />
    </SliderPrimitive.Root>
  ),
)
RangeSlider.displayName = 'RangeSlider'

export { RangeSlider }
export type { RangeSliderProps }
