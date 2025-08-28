import * as React from 'react'

import { classMerge } from '@ecom/ui/lib/utils'

export type InputProps = React.ComponentProps<'input'> & {
  icon?: React.ElementType
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, ...props }, ref) => {
    const Icon = icon

    return (
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-4">
            {<Icon className="h-[18px] w-[18px] text-gray-500 md:h-5 md:w-5" />}
          </div>
        )}
        <input
          type={type}
          className={classMerge(
            'border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-neutral-100 px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-sm focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm md:placeholder:text-base',
            icon ? 'pl-11 md:pl-12' : '',
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  },
)
Input.displayName = 'Input'

export { Input }
