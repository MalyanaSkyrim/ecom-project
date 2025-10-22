import { env } from '@/env'
// import { PrismaAdapter } from '@next-auth/prisma-adapter' // Not using PrismaAdapter since we use Customer instead of User
import { NextAuthOptions } from 'next-auth'
import { encode as defaultEncode } from 'next-auth/jwt'
import Credentials from 'next-auth/providers/credentials'
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google'

import { db } from '@ecom/database'
import { ApiClient } from '@ecom/http-client'

// Create API client instance with API key for store-specific authentication
const apiClient = new ApiClient(env.API_URL, undefined, {
  Authorization: `Bearer ${env.API_KEY}`,
})

export const authOptions = {
  // Session strategy - use JWT since we're not using PrismaAdapter
  session: {
    strategy: 'jwt',
  },
  // Configure one or more authentication providers
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        try {
          // Use our ApiClient instead of got
          const result = await apiClient.signin({
            email: credentials?.email || '',
            password: credentials?.password || '',
          })

          const { user, accessToken } = result as {
            user: {
              id: string
              email: string
              firstName: string
              lastName: string
              avatar?: string
            }
            accessToken: string
          }

          const session = await db.session.findFirst({
            where: {
              customerId: user.id,
              expires: {
                gte: new Date(),
              },
            },
          })

          const { sessionToken } =
            session ||
            (await db.session.create({
              data: {
                customerId: user.id,
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
                sessionToken: crypto.randomUUID(),
              },
            }))

          const account = await db.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: 'credentials',
                providerAccountId: user.id,
              },
            },
          })

          if (!account) {
            await db.account.create({
              data: {
                customerId: user.id, // Use customerId instead of userId
                provider: 'credentials',
                type: 'credentials',
                providerAccountId: user.id,
                access_token: accessToken,
              },
            })
          }
          if (user) {
            // Any object returned will be saved in `user` property of the JWT
            return {
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              avatar: user.avatar || '',
              accessToken,
              sessionToken,
            }
          } else {
            // If you return null then an error will be displayed advising the user to check their details.
            return null

            // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
          }
        } catch (error) {
          // Handle authentication errors
          console.error('Authentication error:', error)
          return null
        }
      },
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      profile: (_profile: GoogleProfile) => {
        return {
          id: _profile.sub,
          firstName: _profile.given_name,
          lastName: _profile.family_name,
          email: _profile.email,
          avatar: _profile.picture,
        }
      },
    }),
    // ...add more providers here
  ],
  // Note: We're not using PrismaAdapter because we use Customer instead of User
  // All database operations are handled manually in the callbacks
  callbacks: {
    async signIn({ account, profile }) {
      // If it's a Google sign-in
      if (account?.provider === 'google') {
        // Check if customer with this email exists but doesn't have a Google account
        if (profile?.email) {
          const existingCustomer = await db.customer.findFirst({
            where: {
              email: profile.email,
            },
            include: { accounts: true },
          })

          if (
            existingCustomer &&
            !existingCustomer.accounts.some((acc) => acc.provider === 'google')
          ) {
            await db.account.create({
              data: {
                customerId: existingCustomer.id,
                ...account,
              },
            })
            return true
          }
        }
      }
      return true
    },
    jwt: async ({ token, user }) => {
      return { ...token, ...user }
    },
    async session({ session, token }) {
      // Fetch full customer data including newsletter subscription status
      // Note: storeId is not needed in session since customer is already store-scoped via API key
      if (token?.id) {
        const customer = await db.customer.findUnique({
          where: { id: token.id as string },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatar: true,
            isNewsletterSubscribed: true,
          },
        })

        if (customer) {
          session.user = {
            id: customer.id,
            firstName: customer.firstName || '',
            lastName: customer.lastName || '',
            email: customer.email,
            avatar: customer.avatar || '',
            isNewsletterSubscribed: customer.isNewsletterSubscribed,
          }
        }
      }
      return session
    },
  },
  jwt: {
    encode(params) {
      // Always use default JWT encoding to ensure proper JWT structure
      return defaultEncode(params)
    },
  },
  pages: {
    signIn: '/signin',
    error: '/signin',
  },
} satisfies NextAuthOptions
