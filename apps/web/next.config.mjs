import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@ecom/ui', '@ecom/http-client', '@ecom/common'],
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  experimental: {
    optimizePackageImports: ['@pragma/database'],
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'img.icons8.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },

  // SVG configuration
  webpack(config, { dev }) {
    // Only apply this webpack config when not using turbopack
    if (!dev) {
      const fileLoaderRule = config.module.rules.find((rule) =>
        rule.test?.test?.('.svg'),
      )

      config.externals = [...(config.externals ?? []), '@ecom/database']

      config.module.rules.push(
        {
          ...fileLoaderRule,
          test: /\.svg$/i,
          resourceQuery: /url/,
        },
        {
          test: /\.svg$/i,
          issuer: fileLoaderRule.issuer,
          resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
          use: ['@svgr/webpack'],
        },
      )

      fileLoaderRule.exclude = /\.svg$/i
    }

    return config
  },
}

export default withNextIntl(nextConfig)
