import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { LoaderCircle } from 'lucide-react'
import * as React from 'react'

import { classMerge } from '@ecom/ui/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 outline-none whitespace-nowrap rounded-md text-sm md:text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

const loadingIconVariants = cva('animate-spin', {
  variants: {
    variant: {
      default: 'text-white',
      destructive: 'text-white',
      outline: 'text-primary',
      secondary: 'text-primary',
      ghost: 'text-primary',
      link: 'text-primary',
    },
    size: {
      default: 'h-4 w-4',
      icon: 'hidden',
      sm: 'h-3 w-3',
      lg: 'h-5 w-5',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={classMerge(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        disabled={disabled || isLoading}>
        <div className="flex items-center gap-2">
          {isLoading && (
            <LoaderCircle
              className={classMerge(
                loadingIconVariants({
                  variant,
                  size,
                }),
              )}
            />
          )}
          {children}
        </div>
      </Comp>
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
