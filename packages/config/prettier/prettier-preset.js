// ts-check
/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("@trivago/prettier-plugin-sort-imports").PrettierConfig}
 */
module.exports = {
  bracketSpacing: true,
  bracketSameLine: true,
  singleQuote: true,
  jsxSingleQuote: false,
  trailingComma: 'all',
  semi: false,
  tabWidth: 2,
  printWidth: 80,
  arrowParens: 'always',
  importOrder: [
    '^@(pragma)/(.*)$',
    '^@lib/(.*)$',
    '^@components/(.*)$',
    '^@(server|trpc)/(.*)$',
    '^~/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true,
  plugins: [
    '@trivago/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],
}
