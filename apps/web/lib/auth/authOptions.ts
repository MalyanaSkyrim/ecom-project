import { env } from '@/env'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { NextAuthOptions } from 'next-auth'
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google'

import { db } from '@ecom/database'

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      profile: (_profile: GoogleProfile) => {
        console.log('sky', { _profile })
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
    async session({ session, token, user }) {
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
} satisfies NextAuthOptions
