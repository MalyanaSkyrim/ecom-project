'use client'

import * as SliderPrimitive from '@radix-ui/react-slider'
import React, {
  ElementRef,
  forwardRef,
  useCallback,
  useMemo,
  useState,
} from 'react'

import { classMerge } from '../../lib/utils'

type SliderBaseProps = {
  min?: number
  max?: number
  step?: number
  formatLabel?: (value: number) => string
  className?: string
  disabled?: boolean
}

interface SliderSingleProps extends SliderBaseProps {
  variant?: 'single'
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
}

interface SliderRangeProps extends SliderBaseProps {
  variant: 'range'
  value?: [number, number]
  defaultValue?: [number, number]
  onValueChange?: (value: [number, number]) => void
}

const MAX_VALUE = 100
const MIN_VALUE = 0

type SliderProps = SliderSingleProps | SliderRangeProps
type DefaultValueParams =
  | Pick<SliderSingleProps, 'defaultValue' | 'variant' | 'min' | 'max'>
  | Pick<SliderRangeProps, 'defaultValue' | 'variant' | 'min' | 'max'>

const getValue = (value: number | number[] | undefined) => {
  if (value) {
    if (Array.isArray(value)) return value
    if (typeof value === 'number') return [value]
  }
}

const getDefaultValue = (params: DefaultValueParams): number[] => {
  const { min = MIN_VALUE, max = MAX_VALUE } = params
  if (params.defaultValue === undefined) return [min, max]
  if (params.variant === 'single') {
    const singleDefaultValue = params.defaultValue
    return [singleDefaultValue]
  }

  if (params.variant === 'range') {
    const rangeDefaultValue = params.defaultValue
    return rangeDefaultValue
  }

  return [min, max]
}

const Slider = forwardRef<ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
  (
    {
      value,
      min = MIN_VALUE,
      max = MAX_VALUE,
      className,
      formatLabel,
      ...props
    },
    ref,
  ) => {
    const defaultRangeValue = useMemo(
      (): number[] =>
        getDefaultValue({
          min,
          max,
          defaultValue: props.defaultValue,
          variant: props.variant,
        } as DefaultValueParams),
      [max, min, props.defaultValue, props.variant],
    )

    const validValue = getValue(value)

    const [rangeValue, setRangeValue] = useState<number[]>(
      validValue ?? defaultRangeValue,
    )

    const handleValueChange = useCallback(
      (newValue: number[]) => {
        if (props.variant === 'single') {
          const singleValue = newValue[0]
          if (typeof singleValue === 'number') {
            if (props.onValueChange) props.onValueChange(singleValue)
            setRangeValue([singleValue])
          }
        }

        if (props.variant === 'range') {
          const rangeValue2 = newValue[1]
          const rangeValue1 = newValue[0]
          if (
            typeof rangeValue1 === 'number' &&
            typeof rangeValue2 === 'number'
          ) {
            if (props.onValueChange)
              props.onValueChange([rangeValue1, rangeValue2])
            setRangeValue([rangeValue1, rangeValue2])
          }
        }
      },
      [props],
    )

    return (
      <SliderPrimitive.Root
        {...props}
        min={min}
        max={max}
        ref={ref}
        value={rangeValue}
        defaultValue={defaultRangeValue}
        onValueChange={handleValueChange}
        className={classMerge(
          'radix-disabled:cursor-not-allowed relative flex w-full touch-none select-none items-center',
          className,
          formatLabel && 'pb-[30px]',
        )}>
        <SliderPrimitive.Track className="radix-disabled:bg-gray-100 relative h-1.5 w-full grow overflow-hidden rounded-full bg-gray-200">
          <SliderPrimitive.Range className="radix-disabled:bg-gray-300 absolute h-full bg-black" />
        </SliderPrimitive.Track>
        {props.variant === 'single' ? (
          <SliderPrimitive.Thumb className="radix-disabled:pointer-events-none radix-disabled:bg-gray-300 radix-disabled:border-gray-300 group relative block h-5 w-5 rounded-full border border-black/20 bg-black shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black">
            {rangeValue.length > 0 && rangeValue[0] !== undefined && (
              <div className="absolute left-1/2 top-7 -translate-x-1/2 transform whitespace-nowrap font-sans text-sm font-medium leading-none tracking-normal text-black group-data-[disabled]:text-gray-300">
                {formatLabel ? formatLabel(rangeValue[0]) : rangeValue[0]}
              </div>
            )}
          </SliderPrimitive.Thumb>
        ) : (
          <>
            <SliderPrimitive.Thumb className="radix-disabled:pointer-events-none radix-disabled:bg-gray-300 radix-disabled:border-gray-300 group relative block h-5 w-5 rounded-full border border-black/20 bg-black shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black">
              {rangeValue.length > 0 && rangeValue[0] !== undefined && (
                <div className="absolute left-1/2 top-7 -translate-x-1/2 transform whitespace-nowrap text-sm font-medium leading-none tracking-normal text-black group-data-[disabled]:text-gray-300">
                  {formatLabel ? formatLabel(rangeValue[0]) : rangeValue[0]}
                </div>
              )}
            </SliderPrimitive.Thumb>
            <SliderPrimitive.Thumb className="radix-disabled:pointer-events-none radix-disabled:bg-gray-300 radix-disabled:border-gray-300 group relative block h-5 w-5 rounded-full border border-black/20 bg-black shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black">
              {rangeValue.length > 1 && rangeValue[1] !== undefined && (
                <div className="absolute left-1/2 top-7 -translate-x-1/2 transform whitespace-nowrap text-sm leading-none tracking-normal text-black group-data-[disabled]:text-gray-300">
                  {formatLabel ? formatLabel(rangeValue[1]) : rangeValue[1]}
                </div>
              )}
            </SliderPrimitive.Thumb>
          </>
        )}
      </SliderPrimitive.Root>
    )
  },
)
Slider.displayName = 'Slider'

export { Slider }
export type { SliderProps, SliderRangeProps, SliderSingleProps }
