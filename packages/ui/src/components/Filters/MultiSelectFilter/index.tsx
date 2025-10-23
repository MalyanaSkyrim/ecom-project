'use client'

import { ChevronRight } from 'lucide-react'

import { classMerge } from '../../../lib/utils'

interface MultiSelectFilterProps {
  value: string[]
  onChange: (value: string[]) => void
  options: string[]
  variant?: 'list' | 'chips'
  multiSelect?: boolean
  className?: string
}

export default function MultiSelectFilter({
  value,
  onChange,
  options,
  variant = 'list',
  multiSelect = true,
  className,
}: MultiSelectFilterProps) {
  const toggleOption = (option: string) => {
    if (multiSelect) {
      if (value.includes(option)) {
        onChange(value.filter((item) => item !== option))
      } else {
        onChange([...value, option])
      }
    } else {
      // Single select
      onChange(value.includes(option) ? [] : [option])
    }
  }

  if (variant === 'list') {
    return (
      <div className={classMerge('flex flex-col gap-5', className)}>
        {options.map((option) => (
          <button
            key={option}
            onClick={() => toggleOption(option)}
            className={classMerge(
              'flex items-center justify-between text-left transition-colors',
              value.includes(option)
                ? 'font-medium text-black'
                : 'text-black/60 hover:text-black',
            )}>
            <span>{option}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        ))}
      </div>
    )
  }

  // chips variant
  return (
    <div className={classMerge('flex flex-wrap gap-2', className)}>
      {options.map((option) => (
        <button
          key={option}
          onClick={() => toggleOption(option)}
          className={classMerge(
            'rounded-full px-5 py-2.5 text-sm transition-all',
            value.includes(option)
              ? 'bg-black font-medium text-white'
              : 'bg-[#F0F0F0] text-black/60',
          )}>
          {option}
        </button>
      ))}
    </div>
  )
}
