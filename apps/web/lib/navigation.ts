import { NestedKeyOf } from 'next-intl'

export type NavItem = {
  label: NestedKeyOf<IntlMessages['navigation']>
  href: string
}

export const navItems = [
  {
    label: 'shop',
    href: '/shop',
  },
  {
    label: 'new_arrivals',
    href: '/new-arrivals',
  },
  {
    label: 'brands',
    href: '/brands',
  },
  {
    label: 'about',
    href: '/about',
  },
] satisfies NavItem[]
