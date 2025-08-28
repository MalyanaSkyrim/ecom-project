import { env } from '@/env'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import got from 'got'
import { NextAuthOptions, User } from 'next-auth'
import { encode as defaultEncode } from 'next-auth/jwt'
import Credentials from 'next-auth/providers/credentials'
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google'

import { db } from '@ecom/database'

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        const { body } = await got.post<{
          user: User
          accessToken: string
          sessionToken: string
        }>(`${env.API_URL}/v1/auth/signin`, {
          json: {
            email: credentials?.email,
            password: credentials?.password,
          },
          responseType: 'json',
        })

        const { user, accessToken } = body

        const session = await db.session.findFirst({
          where: {
            userId: user.id,
            expires: {
              gte: new Date(),
            },
          },
        })

        const { sessionToken } =
          session ||
          (await db.session.create({
            data: {
              userId: user.id,
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
              userId: user.id,
              provider: 'credentials',
              type: 'credentials',
              providerAccountId: user.id,
              access_token: accessToken,
            },
          })
        }
        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return { ...user, accessToken, sessionToken }
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
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
  adapter: PrismaAdapter(db),
  callbacks: {
    async signIn({ account, profile }) {
      // If it's a Google sign-in
      if (account?.provider === 'google') {
        // Check if user with this email exists but doesn't have a Google account
        const existingUser = await db.user.findUnique({
          where: { email: profile?.email },
          include: { accounts: true },
        })

        if (
          existingUser &&
          !existingUser.accounts.some((acc) => acc.provider === 'google')
        ) {
          await db.account.create({
            data: {
              userId: existingUser.id,
              ...account,
            },
          })
          return true
        }
      }
      return true
    },
    jwt: async ({ token, user }) => {
      return { ...token, ...user }
    },
    async session({ session, user }) {
      // Send properties to the client, like an access_token and user id from a provider.
      session.user = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar,
      }
      return session
    },
  },
  jwt: {
    encode(params) {
      const token = params.token as { sessionToken: string }

      if ('sessionToken' in token) {
        return token.sessionToken
      }

      return defaultEncode(params)
    },
  },
  pages: {
    signIn: '/signin',
    error: '/signin',
  },
} satisfies NextAuthOptions
