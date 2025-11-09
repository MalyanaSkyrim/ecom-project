import type { CategoryReply } from '@/server/router/categories/categories.schema'

import type { SelectOption } from '@ecom/ui'

export const ALL_CATEGORIES_OPTION_ID = '__all__'

export interface CategoryLookupEntry {
  node: CategoryReply
  parentId?: string
}

export type CategoryLookup = Map<string, CategoryLookupEntry>

export interface CategorySelectOption extends SelectOption {
  depth: number
}

export const buildCategoryLookup = (
  categories: CategoryReply[] | undefined,
): CategoryLookup => {
  const lookup: CategoryLookup = new Map()
  if (!categories) return lookup

  categories.forEach((category) => {
    lookup.set(category.id, {
      node: category,
      parentId: category.parentId ?? undefined,
    })
  })

  return lookup
}

export const buildCategoryOptions = (
  categories: CategoryReply[] | undefined,
): CategorySelectOption[] => {
  if (!categories) return []

  const childrenByParent = new Map<string | null, CategoryReply[]>()

  categories.forEach((category) => {
    if (!category.isActive) return
    const parentKey = category.parentId ?? null
    const siblings = childrenByParent.get(parentKey) ?? []
    siblings.push(category)
    childrenByParent.set(parentKey, siblings)
  })

  const sortByName = (list: CategoryReply[]) =>
    list.sort((a, b) => a.name.localeCompare(b.name))

  const options: CategorySelectOption[] = []

  const walk = (parentId: string | null, depth: number, path: string[]) => {
    const children = childrenByParent.get(parentId)
    if (!children) return

    sortByName(children).forEach((child) => {
      const currentPath = [...path, child.name]
      options.push({
        id: child.id,
        label: currentPath.join(' / '),
        depth,
        disabled: !child.isActive,
      })
      walk(child.id, depth + 1, currentPath)
    })
  }

  walk(null, 0, [])

  return options
}

export const resolveCategoryPath = (
  categoryId: string | null,
  lookup: CategoryLookup,
): CategoryReply[] => {
  if (!categoryId) return []
  const path: CategoryReply[] = []
  let currentId: string | undefined | null = categoryId

  while (currentId) {
    const entry = lookup.get(currentId)
    if (!entry) break
    path.unshift(entry.node)
    currentId = entry.parentId ?? null
  }

  return path
}
