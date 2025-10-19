import currency from 'currency.js'

import type { Locale } from './locale.enum'

/**
 * Format price in cents to a localized currency string
 * @param priceInCents - Price in cents (e.g., 2999 for $29.99)
 * @param locale - Locale for formatting (default: 'en')
 * @returns Formatted price string (e.g., "$29.99" for en, "29,99 €" for fr)
 */
export function formatPrice(
  priceInCents: number,
  locale: Locale = 'en',
): string {
  // Currency.js configuration for different locales
  const currencyConfigs = {
    en: {
      symbol: '$',
      pattern: '!#',
      decimal: '.',
      separator: ',',
      precision: 2,
    },
    fr: {
      symbol: '€',
      pattern: '# !',
      decimal: ',',
      separator: ' ',
      precision: 2,
    },
  }

  const config = currencyConfigs[locale] || currencyConfigs.en

  try {
    return currency(priceInCents, {
      fromCents: true,
      symbol: config.symbol,
      pattern: config.pattern,
      decimal: config.decimal,
      separator: config.separator,
      precision: config.precision,
    }).format()
  } catch (error) {
    console.warn('Error formatting price:', error)
    // Fallback to basic formatting
    return currency(priceInCents, { fromCents: true }).format()
  }
}
