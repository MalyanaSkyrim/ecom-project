'use client'

import { Slot } from '@radix-ui/react-slot'
import { ChevronRight } from 'lucide-react'
import * as React from 'react'

import { classMerge } from '../../lib/utils'

const BreadcrumbRoot = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<'nav'>
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />)
BreadcrumbRoot.displayName = 'Breadcrumb'

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<'ol'>
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={classMerge(
      'text-muted-foreground flex flex-wrap items-center gap-1.5 break-words text-sm sm:gap-2.5',
      className,
    )}
    {...props}
  />
))
BreadcrumbList.displayName = 'BreadcrumbList'

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<'li'>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={classMerge('inline-flex items-center gap-1.5', className)}
    {...props}
  />
))
BreadcrumbItem.displayName = 'BreadcrumbItem'

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<'a'> & {
    asChild?: boolean
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : 'a'
  return (
    <Comp
      ref={ref}
      className={classMerge(
        'hover:text-foreground transition-colors',
        className,
      )}
      {...props}
    />
  )
})
BreadcrumbLink.displayName = 'BreadcrumbLink'

const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<'span'>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={classMerge('text-foreground font-normal', className)}
    {...props}
  />
))
BreadcrumbPage.displayName = 'BreadcrumbPage'

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<'li'>) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={classMerge('[&>svg]:size-3.5', className)}
    {...props}>
    {children ?? <ChevronRight className="h-4 w-4" />}
  </li>
)
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator'

export interface BreadcrumbItem {
  label: string
  path: string
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
  separator?: React.ReactNode
}

/**
 * Simplified Breadcrumb component that uses shadcn/ui components internally
 * Accepts an array of {label, path} items for easy usage
 */
const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ items, className, separator, ...props }, ref) => {
    if (items.length === 0) return null

    return (
      <BreadcrumbRoot ref={ref} className={className} {...props}>
        <BreadcrumbList>
          {items.map((item, index) => {
            const isLast = index === items.length - 1

            return (
              <React.Fragment key={`${item.path}-${index}`}>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={item.path}>
                      {item.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && (
                  <BreadcrumbSeparator>
                    {separator ?? <ChevronRight className="h-4 w-4" />}
                  </BreadcrumbSeparator>
                )}
              </React.Fragment>
            )
          })}
        </BreadcrumbList>
      </BreadcrumbRoot>
    )
  },
)

Breadcrumb.displayName = 'Breadcrumb'

export { Breadcrumb }
