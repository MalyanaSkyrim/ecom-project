export type NavItem = {
  label: string
  href: string
}

export const navItems = [
  {
    label: 'Shop',
    href: '/shop',
  },
  {
    label: 'On Sale',
    href: '/on-sale',
  },
  {
    label: 'New Arrivals',
    href: '/new-arrivals',
  },
  {
    label: 'Brands',
    href: '/brands',
  },
] satisfies NavItem[]
